import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, User, Phone, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AppointmentDetails() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [reason, setReason] = useState('');

  const params = new URLSearchParams(window.location.search);
  const appointmentId = params.get('id');

  const { data: appointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const apts = await base44.entities.Appointment.filter({ id: appointmentId });
      return apts[0];
    },
    enabled: !!appointmentId,
  });

  const createRequestMutation = useMutation({
    mutationFn: (data) => base44.entities.AppointmentRequest.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment'] });
      toast.success('Request submitted successfully');
      setShowRescheduleDialog(false);
      setShowCancelDialog(false);
      setReason('');
    },
  });

  const handleReschedule = () => {
    createRequestMutation.mutate({
      appointment_id: appointment.id,
      patient_name: appointment.patient_name,
      patient_phone: appointment.patient_phone,
      request_type: 'reschedule',
      current_date: appointment.date,
      current_time: appointment.time,
      reason,
      status: 'pending'
    });
  };

  const handleCancel = () => {
    createRequestMutation.mutate({
      appointment_id: appointment.id,
      patient_name: appointment.patient_name,
      patient_phone: appointment.patient_phone,
      request_type: 'cancel',
      current_date: appointment.date,
      current_time: appointment.time,
      reason,
      status: 'pending'
    });
  };

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" onClick={() => navigate(createPageUrl('PatientPortal'))} className="mb-6">
          ← Back to Portal
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Appointment Details</CardTitle>
                <p className="text-gray-600 mt-1">Booking Reference: {appointment.id.slice(0, 8)}</p>
              </div>
              <Badge className={
                appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }>
                {appointment.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold">{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">{appointment.time}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Dentist</p>
                    <p className="font-semibold">{appointment.staff_name || 'To be assigned'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold">{appointment.service_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            )}

            {appointment.status === 'confirmed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Your appointment is confirmed!</p>
                <p className="text-green-700 text-sm mt-1">You will receive a reminder before your appointment.</p>
              </div>
            )}

            {appointment.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-medium">⏳ Waiting for confirmation</p>
                <p className="text-yellow-700 text-sm mt-1">Our team will confirm your appointment shortly.</p>
              </div>
            )}

            {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRescheduleDialog(true)}
                  className="flex-1"
                >
                  Request Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Request Cancellation
                </Button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-medium">Need help?</p>
                  <p className="text-blue-800 text-sm mt-1">Contact us at +250 787 630 399</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">Please provide a reason for rescheduling. Our team will contact you to arrange a new time.</p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for rescheduling..."
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>Cancel</Button>
              <Button onClick={handleReschedule} disabled={!reason.trim()} className="bg-teal-600 hover:bg-teal-700">
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Cancellation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">Please provide a reason for cancellation.</p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Cancel</Button>
              <Button onClick={handleCancel} disabled={!reason.trim()} className="bg-red-600 hover:bg-red-700 text-white">
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
