import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: 'Jean Marie Nkurunziza',
    location: 'Rwamagana',
    rating: 5,
    text: 'The best dental experience I\'ve ever had. Professional staff, modern facilities, and painless procedures. Highly recommended!',
    text_rw: 'Ubunararibonye bwo kuvuza amenyo bwiza kuruta cyane. Abakozi b\'abahanga, ibibanza bigezweho, kandi ubuvuzi budafite ububabare. Ndabashishikariza!',
    date: 'December 2024'
  },
  {
    name: 'Alice Uwera',
    location: 'Kayonza',
    rating: 5,
    text: 'Dr. Jean Baptiste is amazing! He took time to explain everything and made me feel comfortable throughout the procedure.',
    text_rw: 'Dr. Jean Baptiste ni mwiza cyane! Yafashe igihe cyo gusobanura byose kandi yantumye numva neza mu gihe cyose cy\'ubuvuzi.',
    date: 'November 2024'
  },
  {
    name: 'Patrick Mugisha',
    location: 'Rwamagana',
    rating: 5,
    text: 'Clean, modern clinic with friendly staff. The online booking system made it so easy to schedule my appointment.',
    text_rw: 'Ivuriro risukuye, rigezweho rifite abakozi bakundana. Sisitemu yo gufata gahunda kumurongo yabyoroherezaga cyane gushyira gahunda yanjye.',
    date: 'December 2024'
  },
  {
    name: 'Grace Mukamana',
    location: 'Ngoma',
    rating: 5,
    text: 'I was afraid of dentists, but the team here changed my mind. They are gentle, patient, and truly care about you.',
    text_rw: 'Nari ntinya abaganga b\'amenyo, ariko itsinda riri hano ryahinduye ibitekerezo byanjye. Baroroshye, bahangana, kandi bakwita kuri wewe rwose.',
    date: 'October 2024'
  }
];

export default function TestimonialSection({ language }) {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 font-medium text-sm mb-4"
          >
            <Star className="w-4 h-4 fill-current" />
            {language === 'en' ? 'Patient Reviews' : 'Ibitekerezo by\'Abarwayi'}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            {language === 'en' ? 'What Our Patients Say' : 'Icyo Abarwayi Bacu Bavuga'}
          </motion.h2>

          {/* 5 Star Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">5.0</span>
            <span className="text-gray-500">({testimonials.length} reviews)</span>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8">
                  <Quote className="w-10 h-10 text-teal-200 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{language === 'en' ? testimonial.text : testimonial.text_rw}"
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                    <span className="text-sm text-gray-400">{testimonial.date}</span>
                  </div>
                </CardContent>
              </Card>
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
          <p className="text-lg text-gray-600 mb-6">
            {language === 'en' 
              ? 'Join hundreds of satisfied patients who trust us with their smiles'
              : 'Jya mu babarwayi magana bahaje bishimiye badushizeho icyizere mu nseko zabo'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
