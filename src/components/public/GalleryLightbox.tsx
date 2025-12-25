import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

const galleryItems = [
  { id: '1', title: 'Modern Treatment Room', category: 'facilities', media_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80' },
  { id: '2', title: 'Dental Equipment', category: 'equipment', media_url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80' },
  { id: '3', title: 'Reception Area', category: 'clinic_tour', media_url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80' },
  { id: '4', title: 'Sterilization Room', category: 'facilities', media_url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80' },
];

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'clinic_tour', label: 'Clinic Tour' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'equipment', label: 'Equipment' },
];

interface GalleryLightboxProps {
  language: string;
}

export default function GalleryLightbox({ language }: GalleryLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredGallery = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  const currentItem = filteredGallery[currentIndex];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-4">
            <Camera className="w-4 h-4" />
            {language === 'en' ? 'Our Gallery' : 'Ifoto Zacu'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Explore Our Clinic' : 'Shakisha Kliniki Yacu'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Take a virtual tour of our modern facilities'
              : 'Reba ibikoresho byacu bigezweho'}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                selectedCategory === cat.value
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-gray-100"
            >
              <img
                src={item.media_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {lightboxOpen && currentItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <img
            src={currentItem.media_url}
            alt={currentItem.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-6 left-6 right-20">
            <h3 className="text-white text-xl font-bold">{currentItem.title}</h3>
          </div>
        </div>
      )}
    </section>
  );
}
