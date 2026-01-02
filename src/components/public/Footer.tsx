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
  Twitter
} from 'lucide-react';

export default function Footer({ language = 'en' }) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Muhazi Dental Clinic</h3>
            <p className="text-gray-400 leading-relaxed">
              Providing quality dental care to the Rwamagana community with modern
              equipment and compassionate service.
            </p>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://web.facebook.com/profile.php?id=61583306890085"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/muhazi_dental/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://x.com/muhazidc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to={createPageUrl('Home')}>Home</Link></li>
              <li><Link to={createPageUrl('About')}>About Us</Link></li>
              <li><Link to={createPageUrl('Services')}>Our Services</Link></li>
              <li><Link to={createPageUrl('Team')}>Our Doctors</Link></li>
              <li><Link to={createPageUrl('BookAppointment')}>Book Appointment</Link></li>
              <li><Link to={createPageUrl('Contact')}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>General Dentistry</li>
              <li>Teeth Cleaning</li>
              <li>Dental Fillings</li>
              <li>Root Canal</li>
              <li>Teeth Whitening</li>
              <li>Dental Implants</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>

            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>
                  2nd Floor, Above MTN Branch<br />
                  Rwamagana, Rwanda
                </span>
              </li>

              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-teal-400" />
                <a href="tel:+250787630399">+250 787 630 399</a>
              </li>

              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-teal-400" />
                <a href="mailto:muhazidentalclinic@gmail.com">
                  muhazidentalclinic@gmail.com
                </a>
              </li>

              <li className="flex gap-3">
                <Clock className="w-5 h-5 text-teal-400" />
                <span>Mon – Sun: 8:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Muhazi Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
