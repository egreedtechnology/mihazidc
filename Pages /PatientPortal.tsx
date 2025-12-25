import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  User, 
  Clock,
  Phone,
  LogOut,
  Home
} from 'lucide-react';
import { format } from 'date-fns';

export default function PatientPortal() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('patient_phone');
    if (savedPhone) {
      setPhone(savedPhone);
      setIsAuthenticated(true);
    }
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['patient-appointments', phone],
    queryFn: () => base44.entities.Appointment.filter({ patient_phone: phone }, '-created_date'),
    enabled: isAuthenticated && !!phone,
  });

  const { data: intakeForms = [] } = useQuery({
    queryKey: ['intake-forms', phone],
    queryFn: () => base44.entities.PatientIntakeForm.filter({ patient_phone: phone }),
    enabled: isAuthenticated && !!phone,
  });

  const handleLogin = () => {
    if (phone.trim()) {
      localStorage.setItem('patient_phone', phone);
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patient_phone');
    setIsAuthenticated(false);
    setPhone('');
  };

  const upcomingAppointments = appointments.filter(
    a => new Date(a.date) >= new Date() && a.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(
    a => new Date(a.date) < new Date() || a.status === 'completed'
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
              alt="Muhazi Dental Clinic" 
              className="h-16 w-auto object-contain mx-auto mb-4"
            />
            <CardTitle className="text-center">Patient Portal</CardTitle>
            <p className="text-center text-gray-600">Enter your phone number to access your records</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <Button 
                onClick={handleLogin}
                disabled={!phone.trim()}
                className="w-full bg-teal-600 hover:bg-teal-700"
              >
                Access Portal
              </Button>
              <Link to={createPageUrl('Home')}>
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
                alt="Muhazi Dental Clinic" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
                <p className="text-sm text-gray-600">{phone}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to={createPageUrl('BookAppointment')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Book Appointment</p>
                  <p className="text-sm text-gray-500">Schedule new visit</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl('IntakeForm')}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Intake Form</p>
                  <p className="text-sm text-gray-500">Complete forms</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{appointments.length}</p>
                <p className="text-sm text-gray-500">Total Visits</p>
              </div>
            </CardContent>
          </Card>

          <a href="tel:+250787630399">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Call Clinic</p>
                  <p className="text-sm text-gray-500">+250 787 630 399</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map(apt => (
                    <div key={apt.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{apt.service_name}</p>
                          <p className="text-sm text-gray-600">{apt.staff_name || 'Dentist TBA'}</p>
                        </div>
                        <Badge className={
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(apt.date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </span>
                      </div>
                      <Link to={createPageUrl('AppointmentDetails') + `?id=${apt.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Link to={createPageUrl('BookAppointment')}>
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                      Book Now
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pastAppointments.slice(0, 5).map(apt => (
                    <div key={apt.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{apt.service_name}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(apt.date), 'MMM d, yyyy')} at {apt.time}
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700">
                          {apt.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No appointment history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Intake Forms Status */}
        {intakeForms.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Intake Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {intakeForms.map(form => (
                  <div key={form.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Medical Intake Form</p>
                      <p className="text-sm text-gray-500">
                        Submitted {format(new Date(form.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Badge className={
                      form.status === 'approved' ? 'bg-green-100 text-green-700' :
                      form.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {form.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
