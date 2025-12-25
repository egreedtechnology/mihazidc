import React, { useState, useEffect } from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import OfflineIndicator from '@/components/offline/OfflineIndicator';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Target, CheckCircle, Building } from 'lucide-react';

export default function About() {
  const [language, setLanguage] = useState(() => localStorage.getItem('lang') || 'en');
  useEffect(() => { localStorage.setItem('lang', language); }, [language]);

  const values = [
    { icon: Heart, title: language === 'en' ? 'Compassion' : 'Impuhwe', desc: language === 'en' ? 'We treat every patient with kindness and understanding' : 'Dufata umurwayi wese n\'ubugwaneza n\'ubwumvikane' },
    { icon: Award, title: language === 'en' ? 'Excellence' : 'Ubuhanga', desc: language === 'en' ? 'Committed to the highest standards of dental care' : 'Twiyemeje ibikorwa by\'amenyo by\'urwego rwo hejuru' },
    { icon: Users, title: language === 'en' ? 'Teamwork' : 'Gukorera Hamwe', desc: language === 'en' ? 'Our team works together for your best outcome' : 'Itsinda ryacu rikorera hamwe kugira ngo ugere ku nzozi zawe' },
    { icon: Target, title: language === 'en' ? 'Innovation' : 'Udushya', desc: language === 'en' ? 'Using latest technology for better results' : 'Dukoresha ikoranabuhanga rigezweho kugira ngo ibisubizo bibe byiza' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar language={language} setLanguage={setLanguage} />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'About Muhazi Dental Clinic' : 'Ibyerekeye Muhazi Dental Clinic'}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {language === 'en'
                ? 'Dedicated to providing exceptional dental care to the Rwamagana community and beyond since our establishment.'
                : 'Twiyemeje gutanga ubuvuzi bw\'amenyo budasanzwe ku muryango wa Rwamagana n\'ahandi kuva twatangiye.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
                <Building className="w-4 h-4" />
                {language === 'en' ? 'Our Story' : 'Amateka Yacu'}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'A Legacy of Quality Dental Care' : 'Umurage w\'Ubuvuzi bw\'Amenyo Bwiza'}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {language === 'en'
                    ? 'Muhazi Dental Clinic was founded with a simple mission: to provide world-class dental care accessible to everyone in Rwamagana and the Eastern Province of Rwanda.'
                    : 'Muhazi Dental Clinic yashinzwe afite intego yorohereza: gutanga ubuvuzi bw\'amenyo bw\'isi yose bushobora kuboneka na bose i Rwamagana no mu Ntara y\'Iburasirazuba y\'u Rwanda.'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Located on the 2nd floor above the MTN branch in the heart of Rwamagana, our clinic combines modern technology with personalized care to ensure every patient receives the best possible treatment.'
                    : 'Iri ku gisenge cya 2 hejuru ya MTN mu mutwe wa Rwamagana, ivuriro ryacu rihuza ikoranabuhanga rigezweho n\'ubuvuzi bwihariye kugira ngo umurwayi wese abone ubuvuzi bwiza bushoboka.'}
                </p>
                <p>
                  {language === 'en'
                    ? 'Our team of experienced dentists and friendly staff are committed to making your dental experience comfortable, efficient, and effective.'
                    : 'Itsinda ryacu ry\'abaganga b\'amenyo bafite uburambe n\'abakozi bakundana biyemeje kugira ngo ubunararibonye bwawe bw\'amenyo bube bwiza, bwihutirwa, kandi bugendeye ku ntego.'}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80"
                alt="Dental clinic interior"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-6">
                <p className="text-4xl font-bold text-teal-600">10+</p>
                <p className="text-gray-600">{language === 'en' ? 'Years of Excellence' : 'Imyaka y\'Ubuhanga'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Our Core Values' : 'Indangagaciro Zacu'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === 'en'
                ? 'These principles guide everything we do at Muhazi Dental Clinic'
                : 'Izi ngingo nshinga ziyobora ibyo dukora byose kuri Muhazi Dental Clinic'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-10 text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Our Mission' : 'Intego Yacu'}
              </h3>
              <p className="text-teal-100 leading-relaxed">
                {language === 'en'
                  ? 'To deliver exceptional dental care through advanced technology, continuous education, and a patient-centered approach that builds lasting relationships and transforms smiles.'
                  : 'Gutanga ubuvuzi bw\'amenyo budasanzwe binyuze mu ikoranabuhanga rigezweho, kwiga guhoraho, n\'uburyo bushingiye ku murwayi bushyiraho ubucuti burambye kandi buhinduye inseko.'}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900 rounded-3xl p-10 text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Our Vision' : 'Icyo Tubona'}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {language === 'en'
                  ? 'To be the leading dental care provider in Eastern Rwanda, recognized for excellence, innovation, and our commitment to improving the oral health of our community.'
                  : 'Kuba abatanga ubuvuzi bw\'amenyo ba mbere mu Burasirazuba bw\'u Rwanda, bazwi kubera ubuhanga, udushya, n\'ubwiyemeje guteza imbere ubuzima bw\'amenyo bw\'abatuye iki gihugu.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer language={language} />
      <OfflineIndicator />
    </div>
  );
}
