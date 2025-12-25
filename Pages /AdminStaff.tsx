import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { 
  UserCog, 
  Search, 
  Plus,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const ROLES = [
  { value: 'dentist', label: 'Dentist' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'admin', label: 'Admin' },
  { value: 'pro', label: 'PRO' },
  { value: 'assistant', label: 'Assistant' },
];

export default function AdminStaff() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: '',
    specialization: '',
    bio: '',
    photo: '',
    working_days: [],
    start_time: '08:00',
    end_time: '20:00',
    status: 'active'
  });
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => base44.entities.Staff.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Staff.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setShowNewDialog(false);
      resetForm();
      toast.success('Staff member added successfully');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Staff.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setEditingStaff(null);
      toast.success('Staff member updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Staff.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member removed');
    },
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: '',
      specialization: '',
      bio: '',
      photo: '',
      working_days: [],
      start_time: '08:00',
      end_time: '20:00',
      status: 'active'
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, photo: file_url });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (editingStaff) {
      await updateMutation.mutateAsync({ id: editingStaff.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const openEditDialog = (member) => {
    setFormData({
      full_name: member.full_name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || '',
      specialization: member.specialization || '',
      bio: member.bio || '',
      photo: member.photo || '',
      working_days: member.working_days || [],
      start_time: member.start_time || '08:00',
      end_time: member.end_time || '20:00',
      status: member.status || 'active'
    });
    setEditingStaff(member);
  };

  const toggleDay = (day) => {
    if (formData.working_days.includes(day)) {
      setFormData({
        ...formData,
        working_days: formData.working_days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        working_days: [...formData.working_days, day]
      });
    }
  };

  const filteredStaff = staff.filter(s =>
    s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors = {
    dentist: 'bg-teal-100 text-teal-700',
    receptionist: 'bg-blue-100 text-blue-700',
    accountant: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
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
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600">{staff.length} team members</p>
          </div>
          <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-200 rounded-full w-16 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <img
                        src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=0D9488&color=fff`}
                        alt={member.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(member)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteMutation.mutate(member.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1">{member.full_name}</h3>
                    <Badge className={roleColors[member.role] || 'bg-gray-100 text-gray-700'}>
                      {member.role}
                    </Badge>
                    {member.specialization && (
                      <p className="text-sm text-gray-500 mt-2">{member.specialization}</p>
                    )}

                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      {member.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </div>
                      )}
                      {member.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.working_days?.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span className="truncate">{member.working_days.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Badge className={member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {member.status || 'active'}
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
              <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No staff found</h3>
              <Button onClick={() => setShowNewDialog(true)} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Staff Member
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* New/Edit Dialog */}
      <Dialog open={showNewDialog || !!editingStaff} onOpenChange={(open) => {
        if (!open) {
          setShowNewDialog(false);
          setEditingStaff(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({...formData, role: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            {(formData.role === 'dentist' || formData.role === 'therapist') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  placeholder="e.g., Dental Surgeon, Dental Therapist"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              {formData.photo && (
                <div className="mb-3">
                  <img src={formData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Short biography..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <Button
                    key={day}
                    type="button"
                    variant={formData.working_days.includes(day) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleDay(day)}
                    className={formData.working_days.includes(day) ? "bg-teal-600" : ""}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({...formData, status: v})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => {
                setShowNewDialog(false);
                setEditingStaff(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.full_name || !formData.role}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {editingStaff ? 'Update' : 'Add'} Staff
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
