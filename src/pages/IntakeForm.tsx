import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function IntakeForm() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    medications: '',
    allergies: '',
    dental_history: '',
    insurance_provider: '',
    insurance_number: '',
    preferred_dentist: '',
    how_did_you_hear: '',
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PatientIntakeForm.create(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Intake form submitted successfully!');
      setTimeout(() => {
        navigate(createPageUrl('PatientPortal'));
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Form Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for completing the intake form. Our team will review your information before your appointment.
            </p>
            <Button 
              onClick={() => navigate(createPageUrl('PatientPortal'))}
              className="bg-teal-600 hover:bg-teal-700"
            >
              Go to Patient Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
              alt="Muhazi Dental Clinic" 
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
            <CardTitle className="text-center text-2xl">Patient Intake Form</CardTitle>
            <p className="text-center text-gray-600">Please complete this form before your first appointment</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <Input
                      required
                      value={formData.patient_name}
                      onChange={(e) => setFormData({...formData, patient_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <Input
                      required
                      type="tel"
                      value={formData.patient_phone}
                      onChange={(e) => setFormData({...formData, patient_phone: e.target.value})}
                      placeholder="+250..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <Input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
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
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <Input
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <Input
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
                    <Textarea
                      value={formData.medical_conditions}
                      onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                      placeholder="List any medical conditions..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                    <Textarea
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                      placeholder="List current medications..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <Textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                      placeholder="List any allergies..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dental History</label>
                    <Textarea
                      value={formData.dental_history}
                      onChange={(e) => setFormData({...formData, dental_history: e.target.value})}
                      placeholder="Previous dental treatments, concerns..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Insurance & Other */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                    <Input
                      value={formData.insurance_provider}
                      onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Number</label>
                    <Input
                      value={formData.insurance_number}
                      onChange={(e) => setFormData({...formData, insurance_number: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Dentist</label>
                    <Input
                      value={formData.preferred_dentist}
                      onChange={(e) => setFormData({...formData, preferred_dentist: e.target.value})}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                    <Input
                      value={formData.how_did_you_hear}
                      onChange={(e) => setFormData({...formData, how_did_you_hear: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl('Home'))}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.patient_name || !formData.patient_phone || createMutation.isPending}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  {createMutation.isPending ? 'Submitting...' : 'Submit Form'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
