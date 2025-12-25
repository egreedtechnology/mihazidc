import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Heart, 
  Shield, 
  Zap, 
  Smile, 
  Syringe,
  ArrowRight,
  Star
} from 'lucide-react';

const services = [
  {
    icon: Sparkles,
    name: 'Teeth Whitening',
    name_rw: 'Kweza Amenyo',
    description: 'Professional whitening for a brighter, confident smile',
    description_rw: 'Kweza amenyo by\'abahanga kugira ngo ubone inseko irabagirana',
    color: 'from-amber-400 to-orange-500'
  },
  {
    icon: Heart,
    name: 'General Dentistry',
    name_rw: 'Ubuvuzi Rusange',
    description: 'Comprehensive care including checkups, cleanings, and fillings',
    description_rw: 'Ubuvuzi bwuzuye harimo isuzuma, isukura, no gusiba',
    color: 'from-rose-400 to-pink-500'
  },
  {
    icon: Shield,
    name: 'Dental Implants',
    name_rw: 'Gutera Amenyo',
    description: 'Permanent tooth replacement solutions for missing teeth',
    description_rw: 'Ibisubizo bihoraho byo gusimbuza amenyo yazimiye',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    icon: Zap,
    name: 'Root Canal',
    name_rw: 'Kuvura Imizi',
    description: 'Pain-free treatment to save infected teeth',
    description_rw: 'Ubuvuzi budafite ububabare kugira ngo urokore amenyo yanduye',
    color: 'from-violet-400 to-purple-500'
  },
  {
    icon: Smile,
    name: 'Orthodontics',
    name_rw: 'Gutunganya Amenyo',
    description: 'Braces and aligners for straighter teeth',
    description_rw: 'Ibirimo n\'ibitunganya amenyo kugira ngo agororoke',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    icon: Syringe,
    name: 'Emergency Care',
    name_rw: 'Ubuvuzi bw\'Ubutabazi',
    description: 'Immediate treatment for dental emergencies',
    description_rw: 'Ubuvuzi bwihutirwa ku bibazo by\'amenyo by\'ubutabazi',
    color: 'from-red-400 to-rose-500'
  }
];

export default function ServicesSection({ language }) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-teal-50 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-4"
          >
            <Star className="w-4 h-4" />
            {language === 'en' ? 'Our Services' : 'Serivisi Zacu'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {language === 'en' ? 'Comprehensive Dental Care' : 'Ubuvuzi bw\'Amenyo Bwuzuye'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            {language === 'en' 
              ? 'From routine checkups to advanced procedures, we provide complete dental solutions for patients of all ages.'
              : 'Kuva ku isuzuma risanzwe kugeza ku mavuriro akomeye, dutanga ibisubizo by\'amenyo byuzuye ku barwayi b\'imyaka yose.'}
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl p-8 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl hover:border-teal-200 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === 'en' ? service.name : service.name_rw}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {language === 'en' ? service.description : service.description_rw}
              </p>
              
              <Link 
                to={createPageUrl('BookAppointment')}
                className="inline-flex items-center gap-2 text-teal-600 font-medium group-hover:gap-3 transition-all"
              >
                {language === 'en' ? 'Book Now' : 'Fata Gahunda'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to={createPageUrl('Services')}>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              {language === 'en' ? 'View All Services' : 'Reba Serivisi Zose'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
