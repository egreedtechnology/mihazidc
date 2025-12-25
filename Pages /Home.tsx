import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import WhyChooseUs from '@/components/public/WhyChooseUs';
import TeamSection from '@/components/public/TeamSection';
import GalleryLightbox from '@/components/public/GalleryLightbox';
import TestimonialSection from '@/components/reviews/TestimonialSection';
import CTASection from '@/components/public/CTASection';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import PWAHandler from '@/components/pwa/PWAHandler';
import OfflineCache from '@/components/pwa/OfflineCache';
import NotificationManager from '@/components/notifications/NotificationManager';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import SplashScreen from '@/components/pwa/SplashScreen';

export default function Home() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  return (
    <>
      <SplashScreen />
      <div className="min-h-screen bg-white">
        <Navbar language={language} setLanguage={setLanguage} />
        <HeroSection language={language} />
        <ServicesSection language={language} />
        <WhyChooseUs language={language} />
        <TeamSection language={language} />
        <GalleryLightbox language={language} />
        <TestimonialSection language={language} />
        <CTASection language={language} />
        <Footer language={language} />
        <InstallPrompt />
        <PWAHandler />
        <OfflineCache />
        <NotificationManager />
        <OfflineIndicator />
      </div>
    </>
  );
}
