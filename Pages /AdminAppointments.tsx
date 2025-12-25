import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import NotificationManager, { notifyAdminAlert } from '@/components/notifications/NotificationManager';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppointmentCalendar from '@/components/calendar/AppointmentCalendar';
import { format, parseISO, isToday, isTomorrow, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Search, 
  Filter, 
  Plus,
  Phone,
  User,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function AdminAppointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    service_id: '',
    staff_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    notes: '',
    source: 'phone',
    status: 'confirmed'
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => base44.entities.Appointment.filter({ date: format(selectedDate, 'yyyy-MM-dd') }),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }),
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: () => base44.entities.Staff.filter({ role: 'dentist', status: 'active' }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: (newAppointment) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setShowNewDialog(false);
      resetForm();
      toast.success('Appointment created successfully');
      notifyAdminAlert(`New appointment: ${newAppointment.patient_name} - ${newAppointment.service_name}`, 'success');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setEditingAppointment(null);
      toast.success('Appointment updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Appointment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Appointment deleted successfully');
    },
  });

  const resetForm = () => {
    setFormData({
      patient_name: '',
      patient_phone: '',
      service_id: '',
      staff_id: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '',
      notes: '',
      source: 'phone',
      status: 'confirmed'
    });
  };

  const handleSubmit = async () => {
    const service = services.find(s => s.id === formData.service_id);
    const dentist = staff.find(s => s.id === formData.staff_id);
    
    const data = {
      ...formData,
      service_name: service?.name,
      staff_name: dentist?.full_name,
      duration: service?.duration || 30,
    };

    if (editingAppointment) {
      await updateMutation.mutateAsync({ id: editingAppointment.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleStatusChange = async (apt, newStatus) => {
    await updateMutation.mutateAsync({ id: apt.id, data: { ...apt, status: newStatus } });
  };

  const openEditDialog = (apt) => {
    setFormData({
      patient_name: apt.patient_name,
      patient_phone: apt.patient_phone,
      service_id: apt.service_id || '',
      staff_id: apt.staff_id || '',
      date: apt.date,
      time: apt.time,
      notes: apt.notes || '',
      source: apt.source || 'phone',
      status: apt.status
    });
    setEditingAppointment(apt);
  };

  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = apt.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           apt.patient_phone?.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.time?.localeCompare(b.time));

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    no_show: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const timeSlots = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }

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
      <NotificationManager />
      <OfflineIndicator />

      <main className={cn(
        "pt-20 pb-8 px-4 lg:px-8 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">
              {isToday(selectedDate) ? 'Today' : isTomorrow(selectedDate) ? 'Tomorrow' : format(selectedDate, 'EEEE, MMMM d, yyyy')}
              {' • '}{filteredAppointments.length} appointments
            </p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1">
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-lg"
              />

              {/* Quick Dates */}
              <div className="mt-4 space-y-2">
                <Button
                  variant={isToday(selectedDate) ? "default" : "outline"}
                  className={cn("w-full justify-start", isToday(selectedDate) && "bg-teal-600")}
                  onClick={() => setSelectedDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant={isTomorrow(selectedDate) ? "default" : "outline"}
                  className={cn("w-full justify-start", isTomorrow(selectedDate) && "bg-teal-600")}
                  onClick={() => setSelectedDate(addDays(new Date(), 1))}
                >
                  Tomorrow
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredAppointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 text-center py-2 bg-gray-50 rounded-lg">
                              <p className="text-xl font-bold text-gray-900">{apt.time}</p>
                              <p className="text-xs text-gray-500">{apt.duration || 30} min</p>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{apt.patient_name}</h3>
                                <Badge className={statusColors[apt.status]}>
                                  {apt.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {apt.patient_phone}
                                </span>
                                <span>{apt.service_name}</span>
                                {apt.staff_name && (
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {apt.staff_name}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleStatusChange(apt, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleStatusChange(apt, 'confirmed')}>
                                    <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                                    Mark Confirmed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(apt, 'completed')}>
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    Mark Completed
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(apt, 'cancelled')}>
                                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                    Cancel
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEditDialog(apt)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => deleteMutation.mutate(apt.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments</h3>
                  <p className="text-gray-500 mb-4">No appointments scheduled for this date</p>
                  <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* New/Edit Dialog */}
      <Dialog open={showNewDialog || !!editingAppointment} onOpenChange={(open) => {
        if (!open) {
          setShowNewDialog(false);
          setEditingAppointment(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
            <DialogDescription>
              {editingAppointment ? 'Update appointment details' : 'Schedule a new appointment'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <Input
                  value={formData.patient_name}
                  onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Input
                  value={formData.patient_phone}
                  onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                  placeholder="+250..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service *</label>
              <Select 
                value={formData.service_id} 
                onValueChange={(v) => setFormData({...formData, service_id: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name} - {s.price?.toLocaleString()} RWF</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dentist (Optional)</label>
              <Select 
                value={formData.staff_id} 
                onValueChange={(v) => setFormData({...formData, staff_id: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign dentist" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <Select 
                  value={formData.time} 
                  onValueChange={(v) => setFormData({...formData, time: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowNewDialog(false);
                setEditingAppointment(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.patient_name || !formData.patient_phone || !formData.service_id || !formData.time}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {editingAppointment ? 'Update' : 'Create'} Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
