import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';
import NotificationManager from '@/components/notifications/NotificationManager';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { format, isToday, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  Plus
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

  const { data: todayAppointments = [] } = useQuery({
    queryKey: ['appointments-today', today],
    queryFn: () => base44.entities.Appointment.filter({ date: today }),
  });

  const { data: allAppointments = [] } = useQuery({
    queryKey: ['appointments-month'],
    queryFn: () => base44.entities.Appointment.list('-created_date', 100),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients'],
    queryFn: () => base44.entities.Patient.list('-created_date', 100),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments-month'],
    queryFn: () => base44.entities.Payment.list('-created_date', 100),
  });

  // Calculate stats
  const pendingAppointments = todayAppointments.filter(a => a.status === 'pending');
  const confirmedAppointments = todayAppointments.filter(a => a.status === 'confirmed');
  const completedAppointments = todayAppointments.filter(a => a.status === 'completed');

  const monthlyRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const newPatientsThisMonth = patients.filter(p => {
    if (!p.created_date) return false;
    const created = parseISO(p.created_date);
    return created >= parseISO(monthStart);
  }).length;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-gray-100 text-gray-700',
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
      <NotificationManager />
      <OfflineIndicator />

      <main className={cn(
        "pt-20 pb-8 px-4 lg:px-8 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Admin'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening at Muhazi Dental Clinic today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Appointments"
            value={todayAppointments.length}
            icon={Calendar}
            color="teal"
            delay={0}
          />
          <StatsCard
            title="Total Patients"
            value={patients.length}
            icon={Users}
            trend="up"
            trendValue={`+${newPatientsThisMonth} this month`}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`${monthlyRevenue.toLocaleString()} RWF`}
            icon={CreditCard}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Pending Appointments"
            value={pendingAppointments.length}
            icon={Clock}
            color="amber"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
                <Link to={createPageUrl('AdminAppointments')}>
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.slice(0, 6).map((apt) => (
                      <div key={apt.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-14 text-center">
                          <p className="text-lg font-bold text-gray-900">{apt.time}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{apt.patient_name}</p>
                          <p className="text-sm text-gray-500 truncate">{apt.service_name}</p>
                        </div>
                        <Badge className={statusColors[apt.status]}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments scheduled for today</p>
                    <Link to={createPageUrl('AdminAppointments')}>
                      <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Appointment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Today's Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pending</p>
                      <p className="text-xl font-bold text-gray-900">{pendingAppointments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Confirmed</p>
                      <p className="text-xl font-bold text-gray-900">{confirmedAppointments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completed</p>
                      <p className="text-xl font-bold text-gray-900">{completedAppointments.length}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Link to={createPageUrl('AdminAppointments')}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      <Plus className="w-4 h-4 mr-2" />
                      New Appointment
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Patients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Patients</CardTitle>
              <Link to={createPageUrl('AdminPatients')}>
                <Button variant="ghost" size="sm" className="text-teal-600">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Visit</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.slice(0, 5).map((patient) => (
                      <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
                              <span className="text-teal-600 font-medium text-sm">
                                {patient.full_name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{patient.full_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{patient.phone}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {patient.last_visit_date 
                            ? format(parseISO(patient.last_visit_date), 'MMM d, yyyy')
                            : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {patient.status || 'active'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
