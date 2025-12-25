import { useEffect } from 'react';

export default function OfflineCache() {
  useEffect(() => {
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
