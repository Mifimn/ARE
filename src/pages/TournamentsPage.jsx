// src/pages/TournamentsPage.jsx

import { Link } from 'react-router-dom';
import { Gamepad2, ChevronRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection'; // Import the animation wrapper

// Define the specific games supported and their corresponding hub paths/images
// --- UPDATED with new images ---
const supportedGames = [
  { value: 'Free Fire', label: 'Free Fire', imageSrc: '/images/free_fire.jpeg', description: 'Enter the intense battlegrounds of Free Fire.', hubPath: '/freefire' },
  { value: 'Mobile Legends', label: 'Mobile Legends', imageSrc: '/images/mobile_legend.jpeg', description: 'Battle it out in the popular mobile MOBA arena.', hubPath: '/mobilelegends' },
  { value: 'COD Warzone', label: 'COD Warzone', imageSrc: '/images/cod.jpeg', description: 'Drop into intense battle royale action.', hubPath: '/cod' },
  { value: 'Bloodstrike', label: 'Bloodstrike', imageSrc: '/images/bloodstrike.jpeg', description: 'Experience fast-paced FPS combat.', hubPath: '/bloodstrike' },
  { value: 'Farlight 84', label: 'Farlight 84', imageSrc: '/images/farlight84.jpeg', description: 'High-octane hero shooter battles await.', hubPath: '/farlight84' },
];
// --- End Update ---

// Removed selectedGameFilter prop as it's not used for filtering on this page anymore
export default function TournamentsPage() {

  return (
    // Padding is handled in App.jsx's main wrapper
    <div className="bg-dark-900 text-white">
      {/* Container with padding managed by App.jsx */}
      <div className="space-y-8">

        {/* Header Section */}
        <AnimatedSection tag="div" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
             <Gamepad2 className="w-10 h-10 mr-3 text-primary-400"/> Games Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the supported games and dive into their dedicated hubs for tournaments and leaderboards.
          </p>
        </AnimatedSection>

        {/* Games Grid Section */}
        <AnimatedSection tag="div" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportedGames.map((game, index) => (
            // Wrap each game card for staggered animation
            <AnimatedSection
              key={game.value}
              delay={100 + index * 100} // Start delay after header
              className="group card !p-0 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary-500/30"
            >
              {/* Link now points to the specific hubPath */}
              <Link to={game.hubPath} className="block relative">
                {/* Image */}
                <img
                  src={game.imageSrc}
                  alt={game.label}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Overlay and Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-6">
                   <h3 className="text-2xl font-bold text-white mb-2">{game.label}</h3>
                   <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                   <div className="inline-flex items-center text-primary-400 group-hover:text-primary-300 text-sm font-medium transition-colors">
                     Explore Hub
                     <ChevronRight className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" />
                   </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </AnimatedSection>

        {/* Optional: Add a section if no games are defined */}
        {supportedGames.length === 0 && (
          <AnimatedSection className="text-center py-12">
            <Gamepad2 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Games Available</h3>
            <p className="text-gray-500">Check back soon for supported games and tournaments.</p>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
