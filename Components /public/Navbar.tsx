import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: language === 'en' ? 'Home' : 'Ahabanza', href: 'Home' },
    { name: language === 'en' ? 'About' : 'Abo Turi', href: 'About' },
    { name: language === 'en' ? 'Services' : 'Serivisi', href: 'Services' },
    { name: language === 'en' ? 'Our Team' : 'Abakozi', href: 'Team' },
    { name: language === 'en' ? 'Contact' : 'Twandikire', href: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
              alt="Muhazi Dental Clinic" 
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={createPageUrl(item.href)}
                className="text-gray-600 hover:text-teal-600 font-medium transition-colors text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              {language === 'en' ? '🇷🇼 RW' : '🇬🇧 EN'}
            </button>

            {/* Call Button */}
            <a
              href="tel:+250787630399"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+250 787 630 399</span>
            </a>

            {/* Book Appointment */}
            <Link to={createPageUrl('BookAppointment')}>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 shadow-lg shadow-teal-500/25">
                {language === 'en' ? 'Book Now' : 'Fata Gahunda'}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg" 
                        alt="Muhazi Dental Clinic" 
                        className="h-10 w-auto object-contain"
                      />
                    </div>
                  </div>
                  <nav className="flex-1 p-6">
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          to={createPageUrl(item.href)}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </nav>
                  <div className="p-6 border-t space-y-3">
                    <button
                      onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium"
                    >
                      {language === 'en' ? '🇷🇼 Switch to Kinyarwanda' : '🇬🇧 Switch to English'}
                    </button>
                    <a
                      href="tel:+250787630399"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      +250 787 630 399
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
