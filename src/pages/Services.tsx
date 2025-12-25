import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  Sparkles, Heart, Shield, Zap, Smile, Syringe, Clock, 
  ArrowRight, Star, Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";

const services = [
  { id: '1', name: 'Dental Checkup', name_rw: 'Kwipimisha Amenyo', description: 'Comprehensive oral examination and cleaning', description_rw: 'Isuzuma ryuzuye ry\'akanwa no gusukiranya', duration: 30, category: 'routine', icon: 'sparkles', popular: true },
  { id: '2', name: 'Teeth Whitening', name_rw: 'Gukorora Amenyo', description: 'Professional teeth whitening treatment', description_rw: 'Ubuvuzi bw\'amenyo bwo gukorora', duration: 60, category: 'cosmetic', icon: 'sparkles', popular: true },
  { id: '3', name: 'Tooth Extraction', name_rw: 'Kuvura Iryinyo', description: 'Safe and painless tooth extraction', description_rw: 'Kuvura iryinyo neza kandi bitababaza', duration: 45, category: 'surgical', icon: 'syringe', popular: false },
  { id: '4', name: 'Root Canal', name_rw: 'Kuvura Umugongo w\'Iryinyo', description: 'Treatment for infected tooth pulp', description_rw: 'Ubuvuzi bw\'umugongo w\'iryinyo', duration: 90, category: 'surgical', icon: 'shield', popular: false },
  { id: '5', name: 'Dental Filling', name_rw: 'Kuziba Amenyo', description: 'Restore damaged teeth with fillings', description_rw: 'Gusubiza amenyo yononekaye', duration: 30, category: 'routine', icon: 'heart', popular: true },
  { id: '6', name: 'Dental Crown', name_rw: 'Ikamba ry\'Iryinyo', description: 'Custom-made dental crowns', description_rw: 'Ikamba ry\'iryinyo rikorwa ku buryo bwihariye', duration: 60, category: 'cosmetic', icon: 'smile', popular: false },
];

const iconMap: Record<string, any> = {
  sparkles: Sparkles,
  heart: Heart,
  shield: Shield,
  zap: Zap,
  smile: Smile,
  syringe: Syringe,
};

const categoryColors: Record<string, string> = {
  routine: 'bg-blue-100 text-blue-700',
  cosmetic: 'bg-purple-100 text-purple-700',
  emergency: 'bg-red-100 text-red-700',
  surgical: 'bg-orange-100 text-orange-700',
  preventive: 'bg-green-100 text-green-700',
};

interface NavbarProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Services() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => { localStorage.setItem('lang', language); }, [language]);

  const categories = ['all', 'routine', 'cosmetic', 'emergency', 'surgical', 'preventive'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar language={language} setLanguage={setLanguage} />

      <section className="pt-32 pb-16 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
              <Star className="w-4 h-4" />
              {language === 'en' ? 'Our Services' : 'Serivisi Zacu'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Complete Dental Care Solutions' : 'Ibisubizo Byuzuye by\'Ubuvuzi bw\'Amenyo'}
            </h1>
            <p className="text-xl text-gray-600">
              {language === 'en'
                ? 'Explore our comprehensive range of dental services designed to keep your smile healthy and beautiful.'
                : 'Shakisha urutonde rwuzuye rw\'ubuvuzi bw\'amenyo dukora kugira ngo inseko yawe ikomeze kuba yuzuye ubuzima kandi nziza.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder={language === 'en' ? 'Search services...' : 'Shakisha serivisi...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/25'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat === 'all' ? (language === 'en' ? 'All Services' : 'Serivisi Zose') : 
                   cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Heart;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        {service.popular && (
                          <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded">
                            {language === 'en' ? 'Popular' : 'Ikunzwe'}
                          </span>
                        )}
                      </div>

                      <span className={`${categoryColors[service.category]} text-xs font-medium px-2 py-1 rounded mb-4 inline-block`}>
                        {service.category}
                      </span>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {language === 'en' ? service.name : (service.name_rw || service.name)}
                      </h3>

                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {language === 'en' ? service.description : (service.description_rw || service.description)}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          {service.duration} min
                        </div>
                        <Link to={createPageUrl('BookAppointment') + `?service=${service.id}`}>
                          <Button className="rounded-full bg-teal-600 hover:bg-teal-700">
                            {language === 'en' ? 'Book' : 'Fata'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'No services found' : 'Nta serivisi zabonetse'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Try adjusting your search or filter' : 'Gerageza guhindura gushakisha cyangwa gusonga'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Need a Custom Treatment Plan?' : 'Ukeneye Gahunda y\'Ubuvuzi Idasanzwe?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {language === 'en'
              ? 'Contact us for a personalized consultation and treatment plan tailored to your needs.'
              : 'Twandikire kugira ngo ubone inama zihariye n\'ubuvuzi buhuje n\'ibyo ukeneye.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={createPageUrl('BookAppointment')}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 rounded-full px-8">
                {language === 'en' ? 'Book Consultation' : 'Fata Inama'}
              </Button>
            </Link>
            <a href="tel:+250787630399">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                {language === 'en' ? 'Call Us' : 'Duhamagare'}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer language={language} />
      <OfflineIndicator />
    </div>
  );
}
