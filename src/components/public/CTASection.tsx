import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Calendar, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function CTASection({ language }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50 to-blue-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12 xl:p-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              >
                {language === 'en'
                  ? 'Ready for a Healthier Smile?'
                  : 'Witeguye Kugira Inseko Yuzuye Ubuzima?'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-300 text-lg mb-8"
              >
                {language === 'en'
                  ? 'Schedule your appointment today and take the first step towards optimal dental health. Our friendly team is ready to welcome you.'
                  : 'Shyira gahunda yawe uyu munsi kandi utere intambwe ya mbere ugana ubuzima bwiza bw\'amenyo. Itsinda ryacu rikundana riteguriye kukwakira.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4 mb-10"
              >
                <Link to={createPageUrl('BookAppointment')}>
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 h-14">
                    <Calendar className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Book Appointment' : 'Fata Gahunda'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+250787630399">
                  <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full px-8 h-14">
                    <Phone className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Call Now' : 'Hamagara'}
                  </Button>
                </a>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Rwamagana</p>
                    <p className="text-sm text-gray-400">{language === 'en' ? 'Above MTN' : 'Hejuru ya MTN'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">+250 787 630 399</p>
                    <p className="text-sm text-gray-400">WhatsApp</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Image */}
            <div className="relative hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80"
                alt="Happy patient"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
