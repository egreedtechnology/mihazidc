import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Shield, Star, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Expert Dentists',
    title_rw: 'Abaganga b\'Inzobere',
    description: 'Our team consists of highly qualified and experienced dental professionals',
    description_rw: 'Itsinda ryacu rigizwe n\'abahanga mu buvuzi bw\'amenyo bafite uburambe'
  },
  {
    icon: Shield,
    title: 'Modern Technology',
    title_rw: 'Ikoranabuhanga Rigezweho',
    description: 'State-of-the-art equipment for accurate diagnosis and comfortable treatment',
    description_rw: 'Ibikoresho bigezweho kugira ngo habeho isuzuma ryiza n\'ubuvuzi bworoshye'
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    title_rw: 'Amasaha Yoroshye',
    description: 'Open 7 days a week from 8 AM to 8 PM for your convenience',
    description_rw: 'Dufunguka iminsi 7 mu cyumweru kuva saa 2 kugeza saa 2 z\'ijoro'
  },
  {
    icon: Users,
    title: 'Family Friendly',
    title_rw: 'Ukwakira Imiryango',
    description: 'Caring environment suitable for patients of all ages',
    description_rw: 'Aho hakomeye hahuje n\'abarwayi b\'imyaka yose'
  }
];

const stats = [
  { value: '5000+', label: 'Happy Patients', label_rw: 'Abarwayi Bahirwe' },
  { value: '10+', label: 'Years Experience', label_rw: 'Imyaka y\'Uburambe' },
  { value: '15+', label: 'Expert Dentists', label_rw: 'Abaganga b\'Inzobere' },
  { value: '98%', label: 'Satisfaction Rate', label_rw: 'Urugero rw\'Ubushishozi' }
];

export default function WhyChooseUs({ language }) {
  return (
    <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-teal-100 font-medium text-sm mb-6">
              <Star className="w-4 h-4" />
              {language === 'en' ? 'Why Choose Us' : 'Kuki Waduhitamo'}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {language === 'en' 
                ? 'Trusted Dental Care You Deserve'
                : 'Ubuvuzi bw\'Amenyo Bwizerwa Ukwiriye'}
            </h2>
            
            <p className="text-teal-100 text-lg leading-relaxed mb-10">
              {language === 'en'
                ? 'At Muhazi Dental Clinic, we combine expertise with compassion to deliver exceptional dental care. Your comfort and health are our top priorities.'
                : 'Kuri Muhazi Dental Clinic, duhuza ubuhanga n\'impuhwe kugira ngo dutange ubuvuzi bw\'amenyo budasanzwe. Ubunyarwanda bwawe n\'ubuzima bwawe ni intego zacu z\'ibanze.'}
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">
                      {language === 'en' ? feature.title : feature.title_rw}
                    </h3>
                    <p className="text-teal-200 text-sm leading-relaxed">
                      {language === 'en' ? feature.description : feature.description_rw}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-gray-50"
                >
                  <p className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 font-medium">
                    {language === 'en' ? stat.label : stat.label_rw}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-6 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                {language === 'en'
                  ? '"The best dental experience I\'ve ever had. Professional staff, modern facilities, and painless procedures. Highly recommended!"'
                  : '"Ubunararibonye bwo kuvuza amenyo bwiza kuruta cyane. Abakozi b\'abahanga, ibibanza bigezweho, kandi ubuvuzi budafite ububabare. Ndabashishikariza!"'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-bold">JM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Jean Marie</p>
                  <p className="text-sm text-gray-500">Rwamagana</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
