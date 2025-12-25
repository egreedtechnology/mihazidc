import { useEffect } from 'react';

export default function PWAHandler() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((err) => {
            console.log('SW registration failed:', err);
          });
      });
    }

    if ((window.navigator as any).standalone === true) {
      localStorage.setItem('pwa-installed', 'true');
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('Running in standalone mode');
      document.body.classList.add('pwa-standalone');
    }
  }, []);

  return null;
}
