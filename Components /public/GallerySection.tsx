import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    title: 'Modern Clinic',
  },
  {
    url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80',
    title: 'Treatment Room',
  },
  {
    url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80',
    title: 'Reception Area',
  },
  {
    url: 'https://images.unsplash.com/photo-1588776813963-28acda73d3c8?w=800&q=80',
    title: 'Dental Equipment',
  },
  {
    url: 'https://images.unsplash.com/photo-1609088339697-2a10e0e10fff?w=800&q=80',
    title: 'Sterilization',
  },
  {
    url: 'https://images.unsplash.com/photo-1629909615957-be38f83e8b0f?w=800&q=80',
    title: 'Waiting Area',
  },
];

export default function GallerySection({ language }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-6">
            <Camera className="w-4 h-4" />
            {language === 'en' ? 'Our Facility' : 'Ibikoresho Byacu'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Tour Our Modern Clinic' : 'Uruzinduko mu Kliniki Yacu Igezweho'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Take a look at our state-of-the-art facility designed for your comfort'
              : 'Reba ibikoresho byacu bigezweho byateguwe kugira ngo uhumurizwe'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">{image.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
