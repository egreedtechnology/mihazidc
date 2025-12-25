import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { motion } from 'framer-motion';
import { Star, Phone, Mail, Award, Calendar, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function Team() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en');
  useEffect(() => { localStorage.setItem('lang', language); }, [language]);

  const { data: staff = [] } = useQuery({
    queryKey: ['staff'],
    queryFn: () => base44.entities.Staff.filter({ status: 'active' }),
  });

  const dentists = staff.filter(s => s.role === 'dentist');
  const otherStaff = staff.filter(s => s.role !== 'dentist');

  return (
    <div className="min-h-screen bg-white">
      <Navbar language={language} setLanguage={setLanguage} />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
              <Users className="w-4 h-4" />
              {language === 'en' ? 'Our Team' : 'Itsinda Ryacu'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Meet Our Expert Team' : 'Menya Itsinda ry\'Inzobere Zacu'}
            </h1>
            <p className="text-xl text-gray-600">
              {language === 'en'
                ? 'Our dedicated team of dental professionals is committed to providing you with the best care possible.'
                : 'Itsinda ryacu ryiyemeje ry\'abahanga mu buvuzi bw\'amenyo ryiyemeje kukugezaho ubuvuzi bwiza bushoboka.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dentists */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Dentists' : 'Abaganga b\'Amenyo'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Experienced professionals dedicated to your oral health'
                : 'Abahanga bafite uburambe biyemeje ubuzima bw\'amenyo yawe'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dentists.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&size=400&background=0D9488&color=fff`}
                    alt={member.full_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{member.full_name}</h3>
                    <Badge className="bg-teal-500 text-white">
                      {member.specialization || (language === 'en' ? 'General Dentist' : 'Umuganga w\'Amenyo Rusange')}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {member.bio || (language === 'en' 
                      ? 'Dedicated to providing excellent dental care with a gentle approach.'
                      : 'Yiyemeje gutanga ubuvuzi bw\'amenyo bwiza n\'uburyo bworoshye.')}
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-gray-500 hover:text-teal-600 text-sm">
                        <Phone className="w-4 h-4" />
                        <span className="hidden sm:inline">Call</span>
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-gray-500 hover:text-teal-600 text-sm">
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email</span>
                      </a>
                    )}
                  </div>

                  {member.working_days?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{member.working_days.slice(0, 3).join(', ')}{member.working_days.length > 3 && '...'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {dentists.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">
                {language === 'en' ? 'Team information coming soon' : 'Amakuru y\'itsinda araza vuba'}
              </h3>
            </div>
          )}
        </div>
      </section>

      {/* Other Staff */}
      {otherStaff.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {language === 'en' ? 'Support Staff' : 'Abakozi b\'Ubufasha'}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherStaff.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center shadow-md"
                >
                  <img
                    src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&size=200&background=0D9488&color=fff`}
                    alt={member.full_name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-gray-900">{member.full_name}</h3>
                  <p className="text-teal-600 text-sm capitalize">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join Team CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-10 text-center text-white">
            <Award className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' ? 'Join Our Team' : 'Jya mu Itsinda Ryacu'}
            </h2>
            <p className="text-teal-100 mb-8 max-w-xl mx-auto">
              {language === 'en'
                ? 'We\'re always looking for talented dental professionals to join our growing team.'
                : 'Tuhoraho dushaka abahanga mu buvuzi bw\'amenyo bajye mu itsinda ryacu rikura.'}
            </p>
            <a href="mailto:careers@muhazidental.rw" className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              <Mail className="w-5 h-5" />
              {language === 'en' ? 'Contact Us' : 'Twandikire'}
            </a>
          </div>
        </div>
      </section>

      <Footer language={language} />
      <OfflineIndicator />
    </div>
  );
}
