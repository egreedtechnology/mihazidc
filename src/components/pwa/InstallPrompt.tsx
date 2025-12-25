import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Monitor, Apple } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [device, setDevice] = useState(null);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMacOS = /macintosh|mac os x/.test(userAgent);
    const isWindows = /windows/.test(userAgent);
    const isLinux = /linux/.test(userAgent) && !isAndroid;

    let detectedDevice = 'desktop';
    let deviceName = 'Desktop';
    let deviceIcon = Monitor;

    if (isIOS) {
      detectedDevice = 'ios';
      deviceName = 'iOS';
      deviceIcon = Apple;
    } else if (isAndroid) {
      detectedDevice = 'android';
      deviceName = 'Android';
      deviceIcon = Smartphone;
    } else if (isMacOS) {
      deviceName = 'macOS';
    } else if (isWindows) {
      deviceName = 'Windows';
    } else if (isLinux) {
      deviceName = 'Linux';
    }

    setDevice({ type: detectedDevice, name: deviceName, icon: deviceIcon });

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true;

    if (isInstalled) {
      return;
    }

    // Check if user dismissed the prompt before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = new Date(dismissed).getTime();
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show manual install instructions after a delay
    if (isIOS) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt || !device) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <Card className="bg-gradient-to-br from-teal-600 to-teal-700 text-white shadow-2xl border-0">
          <CardContent className="p-6">
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <device.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Install Muhazi Dental App</h3>
                <p className="text-teal-100 text-sm mb-4">
                  {device.type === 'ios' 
                    ? 'Tap the share button and select "Add to Home Screen"'
                    : 'Get quick access with one click. Works offline!'}
                </p>

                {device.type === 'ios' ? (
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-2">How to install on iOS:</p>
                    <ol className="space-y-1 text-teal-100">
                      <li>1. Tap the Share button <span className="inline-block">□↑</span></li>
                      <li>2. Scroll down and tap "Add to Home Screen"</li>
                      <li>3. Tap "Add" to confirm</li>
                    </ol>
                  </div>
                ) : deferredPrompt ? (
                  <Button
                    onClick={handleInstallClick}
                    className="w-full bg-white text-teal-700 hover:bg-teal-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install for {device.name}
                  </Button>
                ) : (
                  <div className="bg-white/10 rounded-lg p-3 text-sm">
                    <p className="text-teal-100">
                      Use your browser's menu to install this app on your {device.name} device.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
