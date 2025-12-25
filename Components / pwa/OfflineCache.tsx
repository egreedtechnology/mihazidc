import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Cache essential data for offline use
export default function OfflineCache() {
  // Prefetch and cache essential data
  useQuery({
    queryKey: ['offline-services'],
    queryFn: () => base44.entities.Service.filter({ status: 'active' }),
    staleTime: Infinity, // Keep in cache indefinitely
    cacheTime: Infinity,
  });

  useQuery({
    queryKey: ['offline-staff'],
    queryFn: () => base44.entities.Staff.filter({ status: 'active' }),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useQuery({
    queryKey: ['offline-settings'],
    queryFn: async () => {
      const list = await base44.entities.ClinicSettings.list();
      return list[0];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    // Cache static assets
    if ('caches' in window) {
      caches.open('muhazi-dental-v1').then((cache) => {
        cache.addAll([
          '/',
          '/Home',
          '/About',
          '/Services',
          '/Team',
          '/Contact',
          '/BookAppointment'
        ]).catch(err => {
          console.log('Cache failed:', err);
        });
      });
    }

    // Preload critical images
    const criticalImages = [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
}
