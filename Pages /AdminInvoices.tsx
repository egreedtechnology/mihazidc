import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Plus,
  Eye,
  Printer,
  MoreVertical,
  Trash2,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function AdminInvoices() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    items: [{ service_id: '', service_name: '', quantity: 1, unit_price: 0, total: 0 }],
    discount: 0,
    discount_reason: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date'),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Invoice.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setShowNewDialog(false);
      resetForm();
      toast.success('Invoice created successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Invoice.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      patient_id: '',
      items: [{ service_id: '', service_name: '', quantity: 1, unit_price: 0, total: 0 }],
      discount: 0,
      discount_reason: '',
      notes: ''
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { service_id: '', service_name: '', quantity: 1, unit_price: 0, total: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'service_id') {
      const service = services.find(s => s.id === value);
      if (service) {
        newItems[index].service_name = service.name;
        newItems[index].unit_price = service.price;
        newItems[index].total = service.price * newItems[index].quantity;
      }
    }
    
    if (field === 'quantity') {
      newItems[index].total = newItems[index].unit_price * value;
    }
    
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    return subtotal - (formData.discount || 0);
  };

  const handleSubmit = async () => {
    const patient = patients.find(p => p.id === formData.patient_id);
    const subtotal = formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = subtotal - (formData.discount || 0);
    
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    
    await createMutation.mutateAsync({
      invoice_number: invoiceNumber,
      patient_id: formData.patient_id,
      patient_name: patient?.full_name,
      patient_phone: patient?.phone,
      items: formData.items,
      subtotal,
      discount: formData.discount,
      discount_reason: formData.discount_reason,
      total,
      amount_paid: 0,
      balance: total,
      status: 'sent',
      notes: formData.notes
    });
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoice_number?.includes(searchQuery)
  );

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    partial: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <AdminHeader 
        setIsOpen={setSidebarOpen} 
        isCollapsed={sidebarCollapsed}
        user={user}
      />
      <OfflineIndicator />

      <main className={cn(
        "pt-20 pb-8 px-4 lg:px-8 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">{invoices.length} total invoices</p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by patient or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredInvoices.length > 0 ? (
              <div className="space-y-3">
                {filteredInvoices.map((invoice) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-sm text-gray-500">{invoice.invoice_number}</span>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="font-semibold text-gray-900">{invoice.patient_name}</p>
                        <p className="text-sm text-gray-500">
                          {invoice.created_date && format(parseISO(invoice.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>

                      <div className="text-right mr-4">
                        <p className="text-lg font-bold text-gray-900">{invoice.total?.toLocaleString()} RWF</p>
                        {invoice.balance > 0 && (
                          <p className="text-sm text-red-600">Balance: {invoice.balance?.toLocaleString()} RWF</p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingInvoice(invoice)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMutation.mutate(invoice.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
                <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* New Invoice Dialog */}
      <Dialog open={showNewDialog} onOpenChange={(open) => {
        if (!open) {
          setShowNewDialog(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <Select 
                value={formData.patient_id} 
                onValueChange={(v) => setFormData({...formData, patient_id: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.full_name} - {p.phone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Line Items</label>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Service</label>
                      <Select 
                        value={item.service_id} 
                        onValueChange={(v) => updateItem(index, 'service_id', v)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <label className="block text-xs text-gray-500 mb-1">Qty</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        className="h-9"
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-xs text-gray-500 mb-1">Price</label>
                      <Input
                        value={item.unit_price}
                        readOnly
                        className="h-9 bg-gray-100"
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-xs text-gray-500 mb-1">Total</label>
                      <Input
                        value={item.total}
                        readOnly
                        className="h-9 bg-gray-100 font-medium"
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (RWF)</label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Reason</label>
                <Input
                  value={formData.discount_reason}
                  onChange={(e) => setFormData({...formData, discount_reason: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-xl">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-teal-700">{calculateTotal().toLocaleString()} RWF</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowNewDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.patient_id || formData.items.every(i => !i.service_id)}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewingInvoice} onOpenChange={(open) => !open && setViewingInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice {viewingInvoice?.invoice_number}</DialogTitle>
          </DialogHeader>

          {viewingInvoice && (
            <div className="mt-4">
              <div className="bg-gray-50 p-6 rounded-xl mb-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-teal-600">Muhazi Dental Clinic</h3>
                    <p className="text-sm text-gray-500">Rwamagana, Rwanda</p>
                    <p className="text-sm text-gray-500">+250 787 630 399</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">{viewingInvoice.invoice_number}</p>
                    <p className="text-sm text-gray-500">
                      {viewingInvoice.created_date && format(parseISO(viewingInvoice.created_date), 'MMM d, yyyy')}
                    </p>
                    <Badge className={statusColors[viewingInvoice.status]}>
                      {viewingInvoice.status}
                    </Badge>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Bill To:</p>
                  <p className="font-semibold">{viewingInvoice.patient_name}</p>
                  <p className="text-sm text-gray-600">{viewingInvoice.patient_phone}</p>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm text-gray-500">Service</th>
                    <th className="text-center py-2 text-sm text-gray-500">Qty</th>
                    <th className="text-right py-2 text-sm text-gray-500">Price</th>
                    <th className="text-right py-2 text-sm text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items?.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{item.service_name}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">{item.unit_price?.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium">{item.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 text-right">
                <div className="flex justify-end gap-8">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>{viewingInvoice.subtotal?.toLocaleString()} RWF</span>
                </div>
                {viewingInvoice.discount > 0 && (
                  <div className="flex justify-end gap-8">
                    <span className="text-gray-500">Discount:</span>
                    <span className="text-red-600">-{viewingInvoice.discount?.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-end gap-8 text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-teal-600">{viewingInvoice.total?.toLocaleString()} RWF</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
