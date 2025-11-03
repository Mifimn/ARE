// src/components/GamesSidebar.jsx
import { Layers } from 'lucide-react';

// Define games with names and image paths
const supportedGames = [
  { value: 'all', label: 'All Games', imageSrc: null, hubPath: '/tournaments' }, // Link "All" to the main tournaments/games page
  { value: 'Free Fire', label: 'Free Fire', imageSrc: '/images/free_fire.jpeg', hubPath: '/freefire' }, // Placeholder image
  { value: 'Mobile Legends', label: 'Mobile Legends', imageSrc: '/images/mobile_legend.jpeg', hubPath: '/mobilelegends' }, // Placeholder - needs route
  { value: 'COD Warzone', label: 'COD Warzone', imageSrc: '/images/cod.jpeg', hubPath: '/cod' }, // Placeholder image
  { value: 'Bloodstrike', label: 'Bloodstrike', imageSrc: '/images/bloodstrike.jpeg', hubPath: '/bloodstrike' }, // Placeholder image
  { value: 'Farlight 84', label: 'Farlight 84', imageSrc: '/images/farlight84.jpeg', hubPath: '/farlight84' }, // Placeholder image
  // Add other games here with their specific image paths and hubPath
];

// Import useNavigate hook from react-router-dom
import { useNavigate } from 'react-router-dom';

export default function GamesSidebar({ selectedGame, onGameSelect }) {
  const navigate = useNavigate(); // Hook for navigation

  const handleSelectAndNavigate = (game) => {
    onGameSelect(game.value); // Update the state in App.jsx
    navigate(game.hubPath); // Navigate to the game's hub page
  };


  return (
    <div className="card !p-3 bg-dark-800 border border-dark-700"> {/* Added border */}
      <nav className="flex flex-col items-center space-y-4"> {/* Increased spacing */}
        {supportedGames.map((game) => {
          const isActive = selectedGame === game.value;

          return (
            <button
              key={game.value}
              onClick={() => handleSelectAndNavigate(game)} // Use updated handler
              title={game.label} // Tooltip
              className={`
                relative w-14 h-14 rounded-xl flex items-center justify-center
                overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800
                transition-all duration-300 ease-in-out transform
                border-2 ${isActive ? 'border-primary-500 scale-110 shadow-lg shadow-primary-500/30' : 'border-transparent hover:border-primary-500/50 hover:scale-115 hover:shadow-md hover:shadow-primary-500/20'}
                ${!isActive && 'bg-dark-700 hover:bg-dark-600'}
              `}
            >
              {game.imageSrc ? (
                // Game Image
                <img
                  src={game.imageSrc}
                  alt={game.label}
                  className={`
                    w-full h-full object-cover transition-opacity duration-300
                    ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}
                  `}
                />
              ) : (
                // "All Games" Icon (using Lucide)
                <Layers
                  className={`
                    w-7 h-7 transition-colors duration-300
                    ${isActive ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'}
                  `}
                />
              )}
               {/* Inner glow/border effect on hover/active */}
              <div className={`absolute inset-0 border-2 rounded-xl transition-all duration-300 pointer-events-none ${isActive ? 'border-primary-500/70' : 'border-transparent group-hover:border-primary-500/30'}`}></div>
               {/* Subtle overlay on hover for images */}
               {game.imageSrc && (
                 <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
               )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}