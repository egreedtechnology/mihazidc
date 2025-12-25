import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
];

export default function AdminSocial() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    handle: '',
    url: '',
    is_active: true,
    order: 0
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: socials = [] } = useQuery({
    queryKey: ['socials'],
    queryFn: () => base44.entities.SocialMedia.list('order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SocialMedia.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      setShowDialog(false);
      resetForm();
      toast.success('Social media added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SocialMedia.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      setShowDialog(false);
      setEditItem(null);
      toast.success('Updated successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SocialMedia.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] });
      toast.success('Deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      platform: '',
      handle: '',
      url: '',
      is_active: true,
      order: 0
    });
  };

  const handleSubmit = () => {
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item) => {
    setFormData({
      platform: item.platform,
      handle: item.handle || '',
      url: item.url,
      is_active: item.is_active,
      order: item.order || 0
    });
    setEditItem(item);
    setShowDialog(true);
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />
      <AdminHeader setIsOpen={setSidebarOpen} isCollapsed={sidebarCollapsed} user={user} />

      <main className={cn("pt-20 pb-8 px-4 lg:px-8 transition-all duration-300", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Social Media</h1>
            <p className="text-gray-600">Manage social media links</p>
          </div>
          <Button onClick={() => { setShowDialog(true); resetForm(); }} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Platform
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socials.map((item) => {
            const Platform = PLATFORMS.find(p => p.value === item.platform);
            const Icon = Platform?.icon || MessageCircle;
            return (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-teal-600" />
                    {Platform?.label || item.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 truncate">{item.url}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteMutation.mutate(item.id)} className="text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) { setShowDialog(false); setEditItem(null); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit' : 'Add'} Social Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Platform *</label>
              <Select value={formData.platform} onValueChange={(v) => setFormData({...formData, platform: v})}>
                <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <Input value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Handle/Username</label>
              <Input value={formData.handle} onChange={(e) => setFormData({...formData, handle: e.target.value})} placeholder="@username" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => { setShowDialog(false); setEditItem(null); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.platform || !formData.url} className="bg-teal-600 hover:bg-teal-700">
                {editItem ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
