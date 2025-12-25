import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Trash2, Edit, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: 'clinic_tour', label: 'Clinic Tour' },
  { value: 'procedures', label: 'Procedures' },
  { value: 'team_action', label: 'Team in Action' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'before_after', label: 'Before/After' },
];

export default function AdminGallery() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_url: '',
    thumbnail_url: '',
    media_type: 'image',
    category: 'clinic_tour',
    order: 0,
    is_featured: false,
    status: 'active'
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => base44.auth.redirectToLogin());
  }, []);

  const { data: gallery = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => base44.entities.GalleryItem.list('-order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GalleryItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setShowDialog(false);
      resetForm();
      toast.success('Gallery item added');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GalleryItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      setShowDialog(false);
      setEditItem(null);
      toast.success('Gallery item updated');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GalleryItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Item deleted');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      media_url: '',
      thumbnail_url: '',
      media_type: 'image',
      category: 'clinic_tour',
      order: 0,
      is_featured: false,
      status: 'active'
    });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, [field]: file_url });
      toast.success('File uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
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
      title: item.title,
      description: item.description || '',
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || '',
      media_type: item.media_type,
      category: item.category,
      order: item.order || 0,
      is_featured: item.is_featured || false,
      status: item.status
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
            <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600">{gallery.length} items</p>
          </div>
          <Button onClick={() => { setShowDialog(true); resetForm(); }} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Media
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {item.media_type === 'video' ? (
                  <video src={item.media_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={item.media_type === 'video' ? 'bg-red-500' : 'bg-blue-500'}>
                    {item.media_type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{CATEGORIES.find(c => c.value === item.category)?.label}</p>
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
          ))}
        </div>
      </main>

      <Dialog open={showDialog} onOpenChange={(open) => { if (!open) { setShowDialog(false); setEditItem(null); resetForm(); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit' : 'Add'} Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Media Type</label>
              <Select value={formData.media_type} onValueChange={(v) => setFormData({...formData, media_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload {formData.media_type}</label>
              <Input type="file" accept={formData.media_type === 'video' ? 'video/*' : 'image/*'} onChange={(e) => handleFileUpload(e, 'media_url')} disabled={uploading} />
              {formData.media_url && <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>}
            </div>
            {formData.media_type === 'video' && (
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail (optional)</label>
                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail_url')} disabled={uploading} />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => { setShowDialog(false); setEditItem(null); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!formData.title || !formData.media_url} className="bg-teal-600 hover:bg-teal-700">
                {editItem ? 'Update' : 'Add'} Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
