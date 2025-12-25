import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`px-6 py-3 rounded-full shadow-lg flex items-center gap-3 ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5" />
                <span className="font-medium">Back online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <span className="font-medium">No internet connection</span>
              </>
            )}
          </div>
        </motion.div>
      )}

      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center text-sm z-40">
          <WifiOff className="w-4 h-4 inline mr-2" />
          You're offline. Some features may be limited.
        </div>
      )}
    </AnimatePresence>
  );
}
