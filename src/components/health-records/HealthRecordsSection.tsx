import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Upload, Calendar, User, Shield, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import AIAssistant from '@/components/ai/AIAssistant';

export default function HealthRecordsSection({ patient, userRole }) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    record_type: 'treatment_note',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    medications: '',
    symptoms: '',
    visit_date: format(new Date(), 'yyyy-MM-dd'),
    follow_up_required: false
  });

  const queryClient = useQueryClient();
  const canEdit = ['dentist', 'admin'].includes(userRole);

  const { data: records = [] } = useQuery({
    queryKey: ['health-records', patient.id],
    queryFn: () => base44.entities.PatientHealthRecord.filter({ patient_id: patient.id }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PatientHealthRecord.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      setShowDialog(false);
      resetForm();
      toast.success('Health record added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PatientHealthRecord.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      setShowDialog(false);
      setEditingRecord(null);
      resetForm();
      toast.success('Health record updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PatientHealthRecord.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      toast.success('Health record deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      record_type: 'treatment_note',
      title: '',
      description: '',
      diagnosis: '',
      treatment: '',
      medications: '',
      symptoms: '',
      visit_date: format(new Date(), 'yyyy-MM-dd'),
      follow_up_required: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await base44.auth.me();
    
    const data = {
      ...formData,
      patient_id: patient.id,
      patient_name: patient.full_name,
      dentist_name: user.full_name,
    };

    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData(record);
    setShowDialog(true);
  };

  const recordTypeColors = {
    medical_history: 'bg-blue-100 text-blue-800',
    allergy: 'bg-red-100 text-red-800',
    treatment_note: 'bg-green-100 text-green-800',
    diagnostic_report: 'bg-purple-100 text-purple-800',
    prescription: 'bg-orange-100 text-orange-800',
    x_ray: 'bg-cyan-100 text-cyan-800',
    lab_result: 'bg-pink-100 text-pink-800',
    consultation: 'bg-indigo-100 text-indigo-800'
  };

  const groupedRecords = records.reduce((acc, record) => {
    if (!acc[record.record_type]) acc[record.record_type] = [];
    acc[record.record_type].push(record);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" />
            Patient Health Records
          </h3>
          <p className="text-sm text-gray-500 mt-1">Secure, encrypted medical records</p>
        </div>
        {canEdit && (
          <Button onClick={() => { resetForm(); setShowDialog(true); }} className="bg-teal-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </Button>
        )}
      </div>

      {/* AI Assistant */}
      {canEdit && <AIAssistant patient={patient} records={records} />}

      {/* Records */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">
          <TabsTrigger value="all">All ({records.length})</TabsTrigger>
          <TabsTrigger value="treatment_note">Treatments</TabsTrigger>
          <TabsTrigger value="allergy">Allergies</TabsTrigger>
          <TabsTrigger value="prescription">Rx</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {records.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No health records yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {records.sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date)).map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={recordTypeColors[record.record_type]}>
                            {record.record_type.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(record.visit_date), 'MMM d, yyyy')}
                          </span>
                          {record.dentist_name && (
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {record.dentist_name}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg mb-2">{record.title}</h4>
                        {record.description && (
                          <p className="text-gray-600 mb-3">{record.description}</p>
                        )}
                        {record.diagnosis && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Diagnosis: </span>
                            <span className="text-sm text-gray-600">{record.diagnosis}</span>
                          </div>
                        )}
                        {record.treatment && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Treatment: </span>
                            <span className="text-sm text-gray-600">{record.treatment}</span>
                          </div>
                        )}
                        {record.medications && (
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-700">Medications: </span>
                            <span className="text-sm text-gray-600">{record.medications}</span>
                          </div>
                        )}
                      </div>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(record.id)}>
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {['treatment_note', 'allergy', 'prescription'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4 mt-6">
            {groupedRecords[type]?.length > 0 ? (
              groupedRecords[type].map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">{record.title}</h4>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {format(new Date(record.visit_date), 'MMM d, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No {type.replace('_', ' ')} records</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Edit' : 'Add'} Health Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Record Type *</label>
                <Select value={formData.record_type} onValueChange={(v) => setFormData({...formData, record_type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical_history">Medical History</SelectItem>
                    <SelectItem value="allergy">Allergy</SelectItem>
                    <SelectItem value="treatment_note">Treatment Note</SelectItem>
                    <SelectItem value="diagnostic_report">Diagnostic Report</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="x_ray">X-Ray</SelectItem>
                    <SelectItem value="lab_result">Lab Result</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Visit Date *</label>
                <Input
                  type="date"
                  value={formData.visit_date}
                  onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Root Canal Treatment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Diagnosis</label>
                <Input
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Treatment</label>
                <Input
                  value={formData.treatment}
                  onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Medications</label>
              <Textarea
                value={formData.medications}
                onChange={(e) => setFormData({...formData, medications: e.target.value})}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600">
                {editingRecord ? 'Update' : 'Add'} Record
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
