import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Download,
  TrendingUp,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import { cn } from "@/lib/utils";

const COLORS = ['#0D9488', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments-reports'],
    queryFn: () => base44.entities.Appointment.list('-created_date', 500),
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['payments-reports'],
    queryFn: () => base44.entities.Payment.list('-created_date', 500),
  });

  const { data: patients = [] } = useQuery({
    queryKey: ['patients-reports'],
    queryFn: () => base44.entities.Patient.list('-created_date'),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services-reports'],
    queryFn: () => base44.entities.Service.list(),
  });

  const { data: staff = [] } = useQuery({
    queryKey: ['staff-reports'],
    queryFn: () => base44.entities.Staff.filter({ role: 'dentist' }),
  });

  // Filter data by date range
  const getDateRange = () => {
    const today = new Date();
    switch (dateRange) {
      case 'week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'month':
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case '3months':
        return { start: subDays(today, 90), end: today };
      default:
        return { start: startOfMonth(today), end: endOfMonth(today) };
    }
  };

  const { start, end } = getDateRange();

  // Revenue by day
  const revenueByDay = eachDayOfInterval({ start, end }).map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayPayments = payments.filter(p => 
      p.created_date?.startsWith(dayStr) && p.status === 'completed'
    );
    return {
      date: format(day, 'MMM d'),
      revenue: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    };
  });

  // Appointments by status
  const appointmentsByStatus = [
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
    { name: 'Pending', value: appointments.filter(a => a.status === 'pending').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
    { name: 'No Show', value: appointments.filter(a => a.status === 'no_show').length },
  ].filter(s => s.value > 0);

  // Service popularity
  const servicePopularity = services.map(service => {
    const count = appointments.filter(a => a.service_id === service.id).length;
    return { name: service.name, count };
  }).sort((a, b) => b.count - a.count).slice(0, 6);

  // Dentist performance
  const dentistPerformance = staff.map(dentist => {
    const aptCount = appointments.filter(a => a.staff_id === dentist.id).length;
    const completed = appointments.filter(a => a.staff_id === dentist.id && a.status === 'completed').length;
    return { 
      name: dentist.full_name?.split(' ')[0] || 'Unknown', 
      appointments: aptCount,
      completed
    };
  });

  // Patient growth
  const patientGrowth = eachDayOfInterval({ start, end }).map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const newPatients = patients.filter(p => 
      p.created_date?.startsWith(dayStr)
    ).length;
    return {
      date: format(day, 'MMM d'),
      patients: newPatients
    };
  });

  // Summary stats
  const totalRevenue = payments
    .filter(p => {
      if (!p.created_date) return false;
      const date = parseISO(p.created_date);
      return date >= start && date <= end && p.status === 'completed';
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalAppointments = appointments.filter(a => {
    if (!a.date) return false;
    const date = parseISO(a.date);
    return date >= start && date <= end;
  }).length;

  const newPatients = patients.filter(p => {
    if (!p.created_date) return false;
    const date = parseISO(p.created_date);
    return date >= start && date <= end;
  }).length;

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
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Track clinic performance and trends</p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">RWF</span></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Appointments</p>
                  <p className="text-2xl font-bold">{totalAppointments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Patients</p>
                  <p className="text-2xl font-bold">{newPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Daily Revenue</p>
                  <p className="text-2xl font-bold">
                    {Math.round(totalRevenue / Math.max(revenueByDay.length, 1)).toLocaleString()} <span className="text-sm font-normal text-gray-500">RWF</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value.toLocaleString()} RWF`, 'Revenue']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0D9488" 
                      strokeWidth={2}
                      dot={{ fill: '#0D9488' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Appointments by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appointmentsByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {appointmentsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Service Popularity */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={servicePopularity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Dentist Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Dentist Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dentistPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="appointments" fill="#0EA5E9" name="Total Appointments" />
                    <Bar dataKey="completed" fill="#10B981" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="patients" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
