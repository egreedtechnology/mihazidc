import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'clinic_tour', label: 'Clinic Tour' },
  { value: 'procedures', label: 'Procedures' },
  { value: 'team_action', label: 'Team in Action' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'before_after', label: 'Before/After' },
];

export default function GalleryLightbox({ language }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: gallery = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => base44.entities.GalleryItem.filter({ status: 'active' }, '-order'),
  });

  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  const openLightbox = (index) => {
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

        {/* Category Filter */}
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

        {/* Gallery Grid */}
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
              {item.media_type === 'video' ? (
                <>
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </>
              ) : (
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
              {/* Watermark */}
              <div className="absolute top-3 left-3 opacity-50">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg"
                  alt="Logo"
                  className="h-8 w-auto brightness-0 invert"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {currentItem && (
              <>
                {currentItem.media_type === 'video' ? (
                  <video
                    src={currentItem.media_url}
                    controls
                    className="max-w-full max-h-full"
                    autoPlay
                  />
                ) : (
                  <img
                    src={currentItem.media_url}
                    alt={currentItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                
                {/* Watermark in lightbox */}
                <div className="absolute bottom-6 right-6 opacity-40">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg"
                    alt="Logo"
                    className="h-12 w-auto brightness-0 invert"
                  />
                </div>

                {/* Navigation */}
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

                {/* Title */}
                <div className="absolute bottom-6 left-6 right-20">
                  <h3 className="text-white text-xl font-bold">{currentItem.title}</h3>
                  {currentItem.description && (
                    <p className="text-white/80 mt-1">{currentItem.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
