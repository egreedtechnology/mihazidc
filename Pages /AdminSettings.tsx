import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Building, 
  Clock, 
  Bell,
  CreditCard,
  Globe,
  Save,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const DEFAULT_SETTINGS = {
  clinic_name: 'Muhazi Dental Clinic',
  tagline: 'Your Smile, Our Priority',
  phone: '+250 787 630 399',
  whatsapp: '+250 787 630 399',
  email: 'info@muhazidental.rw',
  address: '2nd Floor, Above MTN Branch',
  city: 'Rwamagana',
  country: 'Rwanda',
  opening_time: '08:00',
  closing_time: '20:00',
  working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  currency: 'RWF',
  appointment_buffer: 15,
  reminder_hours_before: 24,
  enable_online_booking: true,
  require_approval: true,
  payment_methods: ['cash', 'mtn_momo', 'airtel_money']
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: existingSettings } = useQuery({
    queryKey: ['clinic-settings'],
    queryFn: async () => {
      const list = await base44.entities.ClinicSettings.list();
      return list[0];
    },
  });

  useEffect(() => {
    if (existingSettings) {
      setSettings({ ...DEFAULT_SETTINGS, ...existingSettings });
    }
  }, [existingSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existingSettings?.id) {
        return base44.entities.ClinicSettings.update(existingSettings.id, data);
      } else {
        return base44.entities.ClinicSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic-settings'] });
      toast.success('Settings saved successfully');
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const toggleDay = (day) => {
    if (settings.working_days?.includes(day)) {
      setSettings({
        ...settings,
        working_days: settings.working_days.filter(d => d !== day)
      });
    } else {
      setSettings({
        ...settings,
        working_days: [...(settings.working_days || []), day]
      });
    }
  };

  const togglePaymentMethod = (method) => {
    if (settings.payment_methods?.includes(method)) {
      setSettings({
        ...settings,
        payment_methods: settings.payment_methods.filter(m => m !== method)
      });
    } else {
      setSettings({
        ...settings,
        payment_methods: [...(settings.payment_methods || []), method]
      });
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Clinic Settings</h1>
            <p className="text-gray-600">Manage your clinic configuration</p>
          </div>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="hours" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Hours
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
                <CardDescription>Basic information about your clinic</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                    <Input
                      value={settings.clinic_name}
                      onChange={(e) => setSettings({...settings, clinic_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                    <Input
                      value={settings.tagline}
                      onChange={(e) => setSettings({...settings, tagline: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <Input
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Address
                  </label>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <Input
                      value={settings.city}
                      onChange={(e) => setSettings({...settings, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <Input
                      value={settings.country}
                      onChange={(e) => setSettings({...settings, country: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Working Hours */}
          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Set your clinic's operating hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                    <Input
                      type="time"
                      value={settings.opening_time}
                      onChange={(e) => setSettings({...settings, opening_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                    <Input
                      type="time"
                      value={settings.closing_time}
                      onChange={(e) => setSettings({...settings, closing_time: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={settings.working_days?.includes(day) ? "default" : "outline"}
                        onClick={() => toggleDay(day)}
                        className={settings.working_days?.includes(day) ? "bg-teal-600" : ""}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Settings */}
          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>Configure online appointment booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Enable Online Booking</p>
                    <p className="text-sm text-gray-500">Allow patients to book appointments online</p>
                  </div>
                  <Switch
                    checked={settings.enable_online_booking}
                    onCheckedChange={(checked) => setSettings({...settings, enable_online_booking: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Require Approval</p>
                    <p className="text-sm text-gray-500">Appointments need staff approval before confirmation</p>
                  </div>
                  <Switch
                    checked={settings.require_approval}
                    onCheckedChange={(checked) => setSettings({...settings, require_approval: checked})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Between Appointments (minutes)</label>
                    <Input
                      type="number"
                      value={settings.appointment_buffer}
                      onChange={(e) => setSettings({...settings, appointment_buffer: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reminder Hours Before</label>
                    <Input
                      type="number"
                      value={settings.reminder_hours_before}
                      onChange={(e) => setSettings({...settings, reminder_hours_before: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <Input
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="max-w-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods</label>
                  <div className="space-y-3">
                    {[
                      { value: 'cash', label: 'Cash', icon: '💵' },
                      { value: 'mtn_momo', label: 'MTN Mobile Money', icon: '📱' },
                      { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
                      { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
                      { value: 'insurance', label: 'Insurance', icon: '🏥' },
                    ].map(method => (
                      <div key={method.value} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-medium">{method.label}</span>
                        </div>
                        <Switch
                          checked={settings.payment_methods?.includes(method.value)}
                          onCheckedChange={() => togglePaymentMethod(method.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
