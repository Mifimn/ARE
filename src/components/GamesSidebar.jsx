// src/components/GamesSidebar.jsx
import { Layers } from 'lucide-react'; // Using Layers icon for "All Games"

// Define games with names and image paths
// IMPORTANT: Replace placeholder paths with actual paths to your game icons later
const supportedGames = [
  { value: 'all', label: 'All Games', imageSrc: null }, // Use null for the icon component
  { value: 'FIFA 24', label: 'FIFA 24', imageSrc: '/images/action_4.jpg' }, // Placeholder
  { value: 'Mobile Legends', label: 'Mobile Legends', imageSrc: '/images/action_4.jpg' }, // Placeholder
  { value: 'COD Warzone', label: 'COD Warzone', imageSrc: '/images/action_4.jpg' }, // Placeholder
  { value: 'Valorant', label: 'Valorant', imageSrc: '/images/action_4.jpg' }, // Placeholder
  { value: 'Fortnite', label: 'Fortnite', imageSrc: '/images/action_4.jpg' }, // Placeholder
  { value: 'Apex Legends', label: 'Apex Legends', imageSrc: '/images/action_4.jpg' }, // Placeholder
  // Add other games here with their specific image paths later
];

export default function GamesSidebar({ selectedGame, onGameSelect }) {
  return (
    // Reduced padding slightly for image focus
    <div className="card p-3">
      {/* Optional: Add a title if you want */}
      {/* <h3 className="text-sm font-semibold mb-3 text-gray-400 uppercase tracking-wider text-center">Games</h3> */}

      {/* Use flexbox for layout, centered */}
      <nav className="flex flex-col items-center space-y-3">
        {supportedGames.map((game) => {
          // Determine if the current game button is active
          const isActive = selectedGame === game.value;

          return (
            <button
              key={game.value}
              onClick={() => onGameSelect(game.value)}
              // Add tooltip text using title attribute
              title={game.label}
              className={`
                relative w-12 h-12 rounded-lg flex items-center justify-center
                overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800
                transition-all duration-200 ease-in-out transform hover:scale-110
                ${isActive ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-800 shadow-lg' : 'bg-dark-700 hover:bg-dark-600'}
              `}
            >
              {game.imageSrc ? (
                // Game Image
                <img
                  src={game.imageSrc}
                  alt={game.label}
                  className={`
                    w-full h-full object-cover transition-opacity duration-200
                    ${isActive ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'}
                  `}
                />
              ) : (
                // "All Games" Icon (using Lucide)
                <Layers
                  className={`
                    w-6 h-6 transition-colors duration-200
                    ${isActive ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'}
                  `}
                />
              )}
               {/* Optional: Add subtle overlay on hover for images */}
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