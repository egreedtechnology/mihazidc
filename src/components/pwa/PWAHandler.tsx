import { useEffect } from 'react';
import { toast } from 'sonner';

export default function PWAHandler() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered:', registration);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute

            // Handle updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker?.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  toast.info('New version available!', {
                    action: {
                      label: 'Refresh',
                      onClick: () => window.location.reload()
                    },
                    duration: Infinity
                  });
                }
              });
            });
          })
          .catch((err) => {
            console.log('SW registration failed:', err);
          });
      });
    }

    // Handle app installation
    let installPrompt;
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      toast.success('App installed successfully! 🎉');
      localStorage.setItem('pwa-installed', 'true');
    });

    // Handle iOS standalone mode
    if (window.navigator.standalone === true) {
      localStorage.setItem('pwa-installed', 'true');
    }

    // Display mode detection
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running in standalone mode');
      document.body.classList.add('pwa-standalone');
    }

    // Update available notification
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        toast.info('App updated! Refresh to see changes.', {
          action: {
            label: 'Refresh Now',
            onClick: () => window.location.reload()
          }
        });
      });
    }
  }, []);

  return null;
}
