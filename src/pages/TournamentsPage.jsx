// src/pages/TournamentsPage.jsx

import { Link } from 'react-router-dom';
import { Gamepad2, ChevronRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection'; // Import the animation wrapper

// Define games data (mirroring GamesSidebar, but with images and links)
// IMPORTANT: Replace placeholder image paths with actual paths to your game icons/banners
const supportedGames = [
  // Excluding "All Games" from this main display page, assuming sidebar handles that
  { value: 'FIFA 24', label: 'FIFA 24', imageSrc: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=400&fit=crop', description: 'Compete in the premier virtual football league.' },
  { value: 'Mobile Legends', label: 'Mobile Legends', imageSrc: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=300&h=400&fit=crop', description: 'Battle it out in the popular mobile MOBA arena.' },
  { value: 'COD Warzone', label: 'COD Warzone', imageSrc: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop', description: 'Drop into intense battle royale action.' },
  { value: 'Valorant', label: 'Valorant', imageSrc: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=400&fit=crop', description: 'Strategic 5v5 tactical shooter competitions.' },
  { value: 'Fortnite', label: 'Fortnite', imageSrc: '/images/action_2.jpg', description: 'Build, battle, and claim Victory Royale.' }, // Using an action image
  { value: 'Apex Legends', label: 'Apex Legends', imageSrc: '/images/action_4.jpg', description: 'Squad up in the fast-paced hero shooter.' }, // Using an action image
  // Add other games here
];

// Note: Removed selectedGameFilter prop, as this page now shows all games.
// Filtering logic would happen on a *different* page/view or be handled by the sidebar state if staying on this page.
export default function TournamentsPage() {

  return (
    // Removed pt-20. Padding is handled in App.jsx's main section wrapper
    <div className="bg-dark-900 text-white">
      {/* Container with padding managed by App.jsx */}
      <div className="space-y-8">

        {/* Header Section */}
        <AnimatedSection tag="div" className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Games & Tournaments</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find competitions for your favorite esports titles across Africa.
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
              // Using !p-0 to override default card padding for image fit
            >
              <Link to={`/tournaments?game=${encodeURIComponent(game.value)}`} className="block relative">
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
                     View Tournaments
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
