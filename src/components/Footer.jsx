// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  // Added new icons
  Instagram, Twitch, Youtube, MessageSquare, MessageCircle, Video 
} from 'lucide-react'; 
// import AnimatedSection from './AnimatedSection'; // Removed broken component

export default function Footer() {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'News', href: '/news' },
    { name: 'Players', href: '/players' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Rules', href: '/rules' },
    { name: 'Guidance', href: '/guidance' }, // <-- ADDED THIS LINK
  ];

  // --- *** UPDATED SOCIAL LINKS *** ---
  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/africa_rise9?igsh=Z29vZ3ZwaXU3YmVk', icon: Instagram },
    { name: 'TikTok', href: 'https://www.tiktok.com/@african_rise9?_t=8nFDKxc7nb4&_r=1', icon: Video },
    { name: 'Twitch', href: 'https://www.twitch.tv/africariseesports?sr=a', icon: Twitch },
    { name: 'YouTube', href: 'https://youtube.com/@africarise_esports?si=mE0hbMDvxHLphv-g', icon: Youtube },
    { name: 'Discord', href: 'https://discord.gg/QdkA5WCawH', icon: MessageSquare },
    { name: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VatZW2RKQuJRhYnUlL3I', icon: MessageCircle },
  ];
  // --- *** END UPDATE *** ---

  return (
    <footer className="bg-dark-800 text-gray-400 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">

          {/* About Section */}
          <div className="lg:col-span-2 md:col-span-4">
            <Link to="/" className="flex items-center mb-4">
              <img
                className="h-10 w-auto"
                src="/images/logo.png" // Use logo.png
                alt="Africa Rise Esports Logo"
              />
              <span className="text-white font-bold text-xl ml-3">Africa Rise Esports</span>
            </Link>
            <p className="text-sm max-w-md">
              The central hub for competitive gaming in Africa. Join tournaments, find teammates, 
              and build your legacy.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social Media Section */}
          <div className="md:col-span-4 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={link.name}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-dark-700 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Africa Rise Esports. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Designed by Nexus Studio Tech
          </p>
        </div>
      </div>
    </footer>
  );
}