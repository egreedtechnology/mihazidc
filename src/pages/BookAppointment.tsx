import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { notifyAppointmentConfirmation } from '@/components/notifications/NotificationManager';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function BookAppointment() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en');
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => { localStorage.setItem('lang', language); }, [language]);

  // Get service from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    if (serviceId) {
      setSelectedService(serviceId);
    }
  }, []);

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }),
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff-dentists'],
    queryFn: () => base44.entities.Staff.filter({ role: 'dentist', status: 'active' }),
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments', selectedDate],
    queryFn: () => selectedDate 
      ? base44.entities.Appointment.filter({ date: format(selectedDate, 'yyyy-MM-dd') })
      : [],
    enabled: !!selectedDate,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      setIsSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const selectedServiceData = services.find(s => s.id === selectedService);
  const selectedDentistData = staff.find(s => s.id === selectedDentist);

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 20;
    const interval = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        
        // Check if slot is taken
        const isTaken = appointments.some(apt => 
          apt.time === time && 
          (apt.status === 'pending' || apt.status === 'confirmed') &&
          (!selectedDentist || apt.staff_id === selectedDentist)
        );
        
        if (!isTaken) {
          slots.push(time);
        }
      }
    }
    return slots;
  };

  const timeSlots = selectedDate ? generateTimeSlots() : [];

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.phone) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Uzuza imyanya yose isabwa');
      return;
    }

    await createAppointment();
  };

  const createAppointment = async () => {
    const duration = selectedServiceData?.duration || 30;
    const [hours, mins] = selectedTime.split(':').map(Number);
    const endHours = hours + Math.floor((mins + duration) / 60);
    const endMins = (mins + duration) % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;

    const appointmentData = {
      patient_name: formData.name,
      patient_phone: formData.phone,
      service_id: selectedService,
      service_name: selectedServiceData?.name,
      staff_id: selectedDentist || undefined,
      staff_name: selectedDentistData?.full_name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      end_time: endTime,
      duration,
      notes: formData.notes,
      source: 'online',
      status: 'pending',
    };

    await createAppointmentMutation.mutateAsync(appointmentData);

    // Send notification
    notifyAppointmentConfirmation(appointmentData);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar language={language} setLanguage={setLanguage} />
        <div className="pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto px-4 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Appointment Requested!' : 'Gahunda Yasabwe!'}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {language === 'en'
                ? 'Your appointment request has been submitted. We will confirm it shortly via phone or WhatsApp.'
                : 'Gahunda yawe yoherejwe. Tuzayemeza vuba kuri telefoni cyangwa WhatsApp.'}
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Appointment Details' : 'Amakuru y\'Gahunda'}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'en' ? 'Service' : 'Serivisi'}</span>
                  <span className="font-medium">{selectedServiceData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'en' ? 'Date' : 'Itariki'}</span>
                  <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'en' ? 'Time' : 'Isaha'}</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                {selectedDentistData && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">{language === 'en' ? 'Dentist' : 'Umuganga'}</span>
                    <span className="font-medium">{selectedDentistData.full_name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <a href="/" className="px-6 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700">
                {language === 'en' ? 'Back to Home' : 'Subira Ahabanza'}
              </a>
            </div>
          </motion.div>
        </div>
        <Footer language={language} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar language={language} setLanguage={setLanguage} />

      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              {language === 'en' ? 'Book Appointment' : 'Fata Gahunda'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Schedule Your Visit' : 'Shiraho Isura Yawe'}
            </h1>
            <p className="text-gray-600">
              {language === 'en'
                ? 'Follow the simple steps below to book your appointment'
                : 'Kurikiza intambwe zoroshye hepfo kugira ngo ufate gahunda yawe'}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-teal-600' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 lg:p-12"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Select Service */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'en' ? 'Select a Service' : 'Hitamo Serivisi'}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedService === service.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedService}
                      className="bg-teal-600 hover:bg-teal-700 rounded-full px-8"
                    >
                      {language === 'en' ? 'Continue' : 'Komeza'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Dentist (Optional) */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'en' ? 'Select a Dentist (Optional)' : 'Hitamo Umuganga (Ubishatse)'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {language === 'en' ? 'Skip if you have no preference' : 'Simbuka niba nta byo ushaka by\'umwihariko'}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {staff.map((dentist) => (
                      <button
                        key={dentist.id}
                        onClick={() => setSelectedDentist(dentist.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all flex gap-4 items-center ${
                          selectedDentist === dentist.id
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        <img
                          src={dentist.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(dentist.full_name)}&background=0D9488&color=fff`}
                          alt={dentist.full_name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{dentist.full_name}</h3>
                          <p className="text-sm text-gray-500">{dentist.specialization || 'General Dentist'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(1)} className="rounded-full px-8">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Back' : 'Subira'}
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="bg-teal-600 hover:bg-teal-700 rounded-full px-8"
                    >
                      {selectedDentist ? (language === 'en' ? 'Continue' : 'Komeza') : (language === 'en' ? 'Skip' : 'Simbuka')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Select Date & Time */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'en' ? 'Select Date & Time' : 'Hitamo Itariki n\'Isaha'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'en' ? 'Choose Date' : 'Hitamo Itariki'}
                      </label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => isBefore(date, startOfDay(new Date()))}
                        className="rounded-xl border shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {language === 'en' ? 'Choose Time' : 'Hitamo Isaha'}
                      </label>
                      {selectedDate ? (
                        <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                selectedTime === time
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-teal-100'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-50 rounded-xl">
                          <p className="text-gray-500">
                            {language === 'en' ? 'Please select a date first' : 'Hitamo itariki mbere'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(2)} className="rounded-full px-8">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Back' : 'Subira'}
                    </Button>
                    <Button
                      onClick={() => setStep(4)}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-teal-600 hover:bg-teal-700 rounded-full px-8"
                    >
                      {language === 'en' ? 'Continue' : 'Komeza'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Personal Info */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {language === 'en' ? 'Your Information' : 'Amakuru Yawe'}
                  </h2>
                  <div className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Full Name' : 'Amazina Yuzuye'} *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder={language === 'en' ? 'John Doe' : 'Amazina yawe'}
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Phone Number' : 'Telefoni'} *
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+250 7XX XXX XXX"
                          className="h-12 rounded-xl"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Email (Optional)' : 'Imeli (Ubishatse)'}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@example.com"
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'en' ? 'Notes (Optional)' : 'Andi Makuru (Ubishatse)'}
                      </label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder={language === 'en' ? 'Any special requests or health concerns...' : 'Ibisabwa byihariye cyangwa ibibazo by\'ubuzima...'}
                        className="rounded-xl"
                        rows={3}
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        {language === 'en' ? 'Appointment Summary' : 'Incamake y\'Gahunda'}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">{language === 'en' ? 'Service' : 'Serivisi'}</span>
                          <span className="font-medium">{selectedServiceData?.name}</span>
                        </div>
                        {selectedDentistData && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{language === 'en' ? 'Dentist' : 'Umuganga'}</span>
                            <span className="font-medium">{selectedDentistData.full_name}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">{language === 'en' ? 'Date' : 'Itariki'}</span>
                          <span className="font-medium">{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">{language === 'en' ? 'Time' : 'Isaha'}</span>
                          <span className="font-medium">{selectedTime}</span>
                        </div>
                      </div>
                    </div>


                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(3)} className="rounded-full px-8">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Back' : 'Subira'}
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!formData.name || !formData.phone || createAppointmentMutation.isPending}
                      className="bg-teal-600 hover:bg-teal-700 rounded-full px-8"
                    >
                      {createAppointmentMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {language === 'en' ? 'Booking...' : 'Gukora gahunda...'}
                        </div>
                      ) : (
                        <>
                          {language === 'en' ? 'Book Appointment' : 'Fata Gahunda'}
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Footer language={language} />
      <OfflineIndicator />
    </div>
  );
}
