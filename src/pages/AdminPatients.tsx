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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthRecordsSection from '@/components/health-records/HealthRecordsSection';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  FileText,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export default function AdminPatients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    gender: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    medical_history: '',
    notes: ''
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list('-created_date'),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['patient-appointments', viewingPatient?.id],
    queryFn: () => viewingPatient 
      ? base44.entities.Appointment.filter({ patient_id: viewingPatient.id })
      : [],
    enabled: !!viewingPatient,
  });

  const { data: treatments = [] } = useQuery({
    queryKey: ['patient-treatments', viewingPatient?.id],
    queryFn: () => viewingPatient 
      ? base44.entities.TreatmentRecord.filter({ patient_id: viewingPatient.id })
      : [],
    enabled: !!viewingPatient,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Patient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowNewDialog(false);
      resetForm();
      toast.success('Patient added successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Patient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setEditingPatient(null);
      toast.success('Patient updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Patient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient deleted successfully');
    },
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      gender: '',
      date_of_birth: '',
      address: '',
      emergency_contact: '',
      medical_history: '',
      notes: ''
    });
  };

  const handleSubmit = async () => {
    if (editingPatient) {
      await updateMutation.mutateAsync({ id: editingPatient.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const openEditDialog = (patient) => {
    setFormData({
      full_name: patient.full_name || '',
      phone: patient.phone || '',
      email: patient.email || '',
      gender: patient.gender || '',
      date_of_birth: patient.date_of_birth || '',
      address: patient.address || '',
      emergency_contact: patient.emergency_contact || '',
      medical_history: patient.medical_history || '',
      notes: patient.notes || ''
    });
    setEditingPatient(patient);
  };

  const filteredPatients = patients.filter(p =>
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600">{patients.length} total patients</p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-10 bg-gray-200 rounded w-10 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-lg">
                          {patient.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewingPatient(patient)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(patient)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMutation.mutate(patient.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1">{patient.full_name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {patient.phone}
                      </div>
                      {patient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                      )}
                      {patient.last_visit_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Last visit: {format(parseISO(patient.last_visit_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
                      <span className="text-gray-500">{patient.total_visits || 0} visits</span>
                      <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {patient.status || 'active'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500 mb-4">Add your first patient to get started</p>
              <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* New/Edit Patient Dialog */}
      <Dialog open={showNewDialog || !!editingPatient} onOpenChange={(open) => {
        if (!open) {
          setShowNewDialog(false);
          setEditingPatient(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Patient full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+250..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(v) => setFormData({...formData, gender: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <Input
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  placeholder="Name - Phone"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Patient address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
              <Textarea
                value={formData.medical_history}
                onChange={(e) => setFormData({...formData, medical_history: e.target.value})}
                placeholder="Allergies, conditions, medications..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowNewDialog(false);
                setEditingPatient(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.full_name || !formData.phone}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {editingPatient ? 'Update' : 'Add'} Patient
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Patient Dialog */}
      <Dialog open={!!viewingPatient} onOpenChange={(open) => !open && setViewingPatient(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
          </DialogHeader>

          {viewingPatient && (
            <Tabs defaultValue="info" className="mt-4">
              <TabsList>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="health">Health Records</TabsTrigger>
                <TabsTrigger value="history">Visit History</TabsTrigger>
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
              </TabsList>

              <TabsContent value="health" className="mt-4">
                <HealthRecordsSection patient={viewingPatient} userRole={user?.role} />
              </TabsContent>

              <TabsContent value="info" className="mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="font-medium">{viewingPatient.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="font-medium">{viewingPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{viewingPatient.email || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Gender</label>
                      <p className="font-medium capitalize">{viewingPatient.gender || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Date of Birth</label>
                      <p className="font-medium">{viewingPatient.date_of_birth || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Address</label>
                      <p className="font-medium">{viewingPatient.address || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Emergency Contact</label>
                      <p className="font-medium">{viewingPatient.emergency_contact || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Medical History</label>
                      <p className="font-medium">{viewingPatient.medical_history || 'None recorded'}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                {appointments.length > 0 ? (
                  <div className="space-y-3">
                    {appointments.map(apt => (
                      <div key={apt.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{apt.service_name}</p>
                          <p className="text-sm text-gray-500">
                            {format(parseISO(apt.date), 'MMM d, yyyy')} at {apt.time}
                          </p>
                        </div>
                        <Badge className={apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No visit history found
                  </div>
                )}
              </TabsContent>

              <TabsContent value="treatments" className="mt-4">
                {treatments.length > 0 ? (
                  <div className="space-y-3">
                    {treatments.map(t => (
                      <div key={t.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{t.service_name}</p>
                            <p className="text-sm text-gray-500">{t.treatment_performed}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {t.created_date && format(parseISO(t.created_date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {t.notes && (
                          <p className="mt-2 text-sm text-gray-600">{t.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No treatment records found
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
