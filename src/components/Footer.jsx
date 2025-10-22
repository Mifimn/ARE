// src/components/Footer.jsx

import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube, Mail, Twitch, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            {/* --- Updated Logo --- */}
            <div className="flex items-center mb-4">
              <img
                className="h-11 w-auto mr-3" // Use provided logo name
                src="/images/logo.png"
                alt="Africa Rise Esports Logo"
              />
            </div>
            {/* --- End Updated Logo --- */}
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering African gamers and building the future of esports across the continent.
              Where legends are born and dreams become reality.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
               {/* ... Social icons ... */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
                <li><Link to="/tournaments" className="text-gray-400 hover:text-white transition-colors">Games</Link></li>
                <li><Link to="/players" className="text-gray-400 hover:text-white transition-colors">Players</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/rules" className="text-gray-400 hover:text-white transition-colors">Rules</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4 text-sm"> Get the latest news and tournament updates. </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter signup simulated!'); }}>
              <div className="flex">
                <input type="email" placeholder="Enter your email" required className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                 <button type="submit" className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md transition-colors"> <Mail size={16} /> </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Africa Rise Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

