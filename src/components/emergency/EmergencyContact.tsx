import React from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertCircle, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function EmergencyContact({ language = 'en' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl"
    >
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-8 h-8 animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3">
            {language === 'en' ? 'Dental Emergency?' : 'Ikibazo cy\'Ubutabazi?'}
          </h3>
          <p className="text-red-100 mb-6 text-lg">
            {language === 'en'
              ? 'We provide immediate care for dental emergencies. Call us now for urgent assistance.'
              : 'Dutanga ubuvuzi bwihutirwa ku bibazo by\'amenyo by\'ubutabazi. Duhamagare ubu kugira ngo ubafashe vuba.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+250787630399">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 h-14 rounded-full px-8">
                <Phone className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Call Emergency Line' : 'Hamagara Umurongo w\'Ubutabazi'}
              </Button>
            </a>
            <a href="https://wa.me/250787630399?text=Emergency" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-14 rounded-full px-8">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </Button>
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-red-100">
            <MapPin className="w-5 h-5" />
            <span>2nd Floor, Above MTN Branch, Rwamagana</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
