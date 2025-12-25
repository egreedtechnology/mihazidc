import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Calendar, Phone, Shield, Award, Clock, Star } from 'lucide-react';

export default function HeroSection({ language }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-teal-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
              <Star className="w-4 h-4 fill-current" />
              {language === 'en' ? 'Trusted Dental Care in Rwamagana' : 'Ubuvuzi bw\'amenyo bwizerwa i Rwamagana'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {language === 'en' ? (
                <>Your Smile, Our <span className="text-teal-600">Priority</span></>
              ) : (
                <>Inseko Yawe, Ni <span className="text-teal-600">Intego Yacu</span></>
              )}
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              {language === 'en' 
                ? 'Experience world-class dental care with our expert team. Modern technology, gentle approach, and personalized treatment plans for the whole family.'
                : 'Ibona ubuvuzi bw\'amenyo bwiza cyane n\'itsinda ry\'inzobere. Ikoranabuhanga rigezweho, ubuvuzi bworoshye, n\'imigambi y\'ubuvuzi yihariye ku muryango wose.'}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to={createPageUrl('BookAppointment')}>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 shadow-xl shadow-teal-500/25 h-14 text-base">
                  <Calendar className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Book Appointment' : 'Fata Gahunda'}
                </Button>
              </Link>
              <a href="tel:+250787630399">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2 h-14 text-base">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Call Us Now' : 'Duhamagare'}
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: Shield, text: language === 'en' ? 'Licensed Clinic' : 'Ivuriro Ryemewe' },
                { icon: Award, text: language === 'en' ? 'Expert Dentists' : 'Abaganga b\'Inzobere' },
                { icon: Clock, text: language === 'en' ? 'Open 7 Days' : 'Dufunguka Iminsi 7' },
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <badge.icon className="w-5 h-5 text-teal-600" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80"
                alt="Modern dental clinic"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{language === 'en' ? 'Working Hours' : 'Amasaha y\'akazi'}</p>
                  <p className="text-teal-600 font-medium">8:00 AM - 8:00 PM</p>
                  <p className="text-gray-500 text-sm">{language === 'en' ? 'Monday - Sunday' : 'Kuwa Mbere - Ku Cyumweru'}</p>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -top-6 -right-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white"
            >
              <p className="text-4xl font-bold">5000+</p>
              <p className="text-teal-100">{language === 'en' ? 'Happy Patients' : 'Abarwayi Bahirwe'}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/250787630399"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </section>
  );
}
