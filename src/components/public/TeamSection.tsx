import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";

const dentists = [
  { id: '1', full_name: 'Dr. Jean Baptiste', specialization: 'General Dentistry', bio: 'Experienced dentist with over 10 years of practice in comprehensive dental care.' },
  { id: '2', full_name: 'Dr. Marie Claire', specialization: 'Orthodontics', bio: 'Specialist in teeth alignment and corrective dental procedures.' },
  { id: '3', full_name: 'Dr. Patrick', specialization: 'Pediatric Dentistry', bio: 'Dedicated to providing gentle dental care for children of all ages.' },
];

interface TeamSectionProps {
  language: string;
}

export default function TeamSection({ language }: TeamSectionProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
            <Users className="w-4 h-4" />
            {language === 'en' ? 'Our Team' : 'Itsinda Ryacu'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Meet Our Expert Dentists' : 'Menya Abaganga b\'Amenyo'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Our experienced dental professionals are here to care for your smile'
              : 'Abaganga bacu b\'inzobere bari hano kwita ku mitwe yawe'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {dentists.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&size=400&background=0D9488&color=fff`}
                  alt={member.full_name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{member.full_name}</h3>
                  <p className="text-teal-300 font-medium">
                    {member.specialization || (language === 'en' ? 'General Dentist' : 'Umuganga w\'Amenyo Rusange')}
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 line-clamp-2">
                  {member.bio || (language === 'en'
                    ? 'Dedicated to providing excellent dental care with a gentle approach.'
                    : 'Yiyemeje gutanga ubuvuzi bw\'amenyo bwiza n\'uburyo bworoshye.')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to={createPageUrl('Team')}>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-teal-500/25">
              {language === 'en' ? 'Meet Our Full Team' : 'Menya Itsinda Ryose'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
