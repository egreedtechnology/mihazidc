import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="mb-6">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6949932dbcecdfc6de5732e1/8ce091a17_dc.jpg"
                alt="Muhazi Dental Clinic"
                className="h-16 w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="text-gray-400 leading-relaxed">
              {language === 'en'
                ? 'Your trusted partner for comprehensive dental care in Rwamagana. Modern facilities, experienced team, compassionate care.'
                : "Umufatanyabikorwa wawe wizerwa mu buvuzi bw'amenyo bwuzuye i Rwamagana."}
            </p>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              {/* Facebook */}
              <a
                href="https://web.facebook.com/profile.php?id=61583306890085"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/muhazi_dental/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/muhazidc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="http://www.linkedin.com/in/muhazi-dental-clinic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              {/* TikTok (Custom SVG) */}
              <a
                href="http://www.tiktok.com/@muhazidc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .55.04.81.11V9.4a6.34 6.34 0 0 0-.81-.05A6.34 6.34 0 1 0 15.82 15V8.77a8.27 8.27 0 0 0 4.77 1.53V6.69z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === 'en' ? 'Quick Links' : 'Aho Ujya Vuba'}
            </h4>
            <ul className="space-y-3">
              {[
                { name: language === 'en' ? 'Home' : 'Ahabanza', href: 'Home' },
                { name: language === 'en' ? 'About Us' : 'Abo Turi', href: 'About' },
                { name: language === 'en' ? 'Services' : 'Serivisi', href: 'Services' },
                { name: language === 'en' ? 'Our Team' : 'Abakozi', href: 'Team' },
                { name: language === 'en' ? 'Book Appointment' : 'Fata Gahunda', href: 'BookAppointment' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    to={createPageUrl(link.href)}
                    className="text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === 'en' ? 'Our Services' : 'Serivisi Zacu'}
            </h4>
            <ul className="space-y-3 text-gray-400">
              <li>{language === 'en' ? 'General Dentistry' : 'Ubuvuzi Rusange'}</li>
              <li>{language === 'en' ? 'Teeth Whitening' : 'Kweza Amenyo'}</li>
              <li>{language === 'en' ? 'Dental Implants' : 'Gutera Amenyo'}</li>
              <li>{language === 'en' ? 'Root Canal' : 'Kuvura Imizi'}</li>
              <li>{language === 'en' ? 'Orthodontics' : 'Gutunganya Amenyo'}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">
              {language === 'en' ? 'Contact Us' : 'Twandikire'}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-0.5" />
                <span className="text-gray-400">
                  2nd Floor, Above MTN Branch, Rwamagana, Rwanda
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400" />
                <a href="tel:+250787630399" className="text-gray-400 hover:text-teal-400">
                  +250 787 630 399
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400" />
                <a href="mailto:muhazidentalclinic@gmail.com" className="text-gray-400 hover:text-teal-400">
                  muhazidentalclinic@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-teal-400" />
                <span className="text-gray-400">Mon–Sun: 8:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Muhazi Dental Clinic.{' '}
            {language === 'en' ? 'All rights reserved.' : 'Uburenganzira bwose burabitswe.'}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-teal-400 transition-colors">
              {language === 'en' ? 'Privacy Policy' : "Politiki y'Ibanga"}
            </a>
            <a href="#" className="hover:text-teal-400 transition-colors">
              {language === 'en' ? 'Terms of Service' : 'Amabwiriza'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
