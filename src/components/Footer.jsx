import { Link } from 'react-router-dom';
// UPDATED: Removed Facebook, added Twitch and MessageSquare (for Discord)
import { Twitter, Instagram, Youtube, Mail, Twitch, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">ARE</span>
              </div>
              <span className="text-white font-bold text-xl">Africa Rise Esports</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering African gamers and building the future of esports across the continent.
              Where legends are born and dreams become reality.
            </p>
            {/* UPDATED: Social Links */}
            <div className="flex space-x-4">
              {/* Removed Facebook */}
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors" title="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://www.instagram.com/africa_rise9?igsh=Z29vZ3ZwaXU3YmVk" className="text-gray-400 hover:text-primary-500 transition-colors" title="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/@africarise_esports?si=mE0hbMDvxHLphv-g" className="text-gray-400 hover:text-primary-500 transition-colors" title="YouTube">
                <Youtube size={20} />
              </a>
              {/* Added Twitch */}
              <a href="https://www.twitch.tv/africariseesports?sr=a" className="text-grayhttps://www.twitch.tv/africariseesports?sr=ae-500 transition-colors" title="Twitch">
                <Twitch size={20} />
              </a>
              {/* Added Discord (using MessageSquare placeholder) */}
              <a href="https://discord.gg/QdkA5WCawH" className="text-gray-400 hover:text-indigo-500 transition-colors" title="Discord">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {/* Updated "Tournaments" to "Games" to match Header */}
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
            <p className="text-gray-400 mb-4 text-sm">
              Get the latest news and tournament updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter signup simulated!'); }}> {/* Added basic form handler */}
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required // Added required attribute
                  className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
           



     <button type="submit" className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-r-md transition-colors">
                  <Mail size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center text-gray-400 text-sm"> {/* Adjusted text size */}
          <p>&copy; {new Date().getFullYear()} Africa Rise Esports. All rights reserved.</p> {/* Dynamic Year */}
        </div>
      </div>
    </footer>
  );
}