// src/pages/ProfilePage.jsx

// CORRECTED: Only one import from lucide-react
import { User, Edit3, Trophy, Users, Calendar, MapPin, Star, Mail, Phone, Clock, Shield, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection'; // Import animation wrapper

export default function ProfilePage() {
  // Updated user object
  const user = {
    id: 1,
    username: 'ProGamer2024',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+234 801 234 5678',
    bio: 'Professional esports athlete from Nigeria. Specialized in FIFA and COD Warzone. Always looking for new challenges and opportunities to grow.',
    country: 'Nigeria',
    city: 'Lagos',
    joinDate: '2023-01-15',
    lastActive: '2024-01-15T10:30:00Z',
    avatar: '/images/avatars/ava_m_1.jpg', // Assuming using the selected avatar path
    verified: true,
    credits: 1250, // Replaced rank with credits
    totalWins: 145,
    totalLosses: 32,
    favoriteGames: ['FIFA 24', 'COD Warzone', 'Mobile Legends'],
    gameDetails: {
      'FIFA 24': { ign: 'ProFIFA', uid: '12345FIFA' },
      'COD Warzone': { ign: 'WarzonePro', uid: '67890COD' },
      'Mobile Legends': { ign: 'MLMaster', uid: '98765MLBB'},
    },
    socialLinks: {
      twitch: 'https://twitch.tv/progamer2024',
      youtube: 'https://youtube.com/progamer2024',
      instagram: 'https://instagram.com/progamer2024'
    }
  };

  // Placeholder Teams data
  const teams = [
    { id: 1, name: 'Thunder Hawks', logo: 'https://via.placeholder.com/40x40?text=TH', game: 'COD Warzone', role: 'Captain' },
    { id: 2, name: 'Lagos Lions', logo: 'https://via.placeholder.com/40x40?text=LL', game: 'FIFA 24', role: 'Member' },
  ];

  const recentMatches = [
    { id: 1, game: 'FIFA 24', opponent: 'DesertStorm', result: 'Win', score: '3-1', date: '2024-01-14' },
    { id: 2, game: 'COD Warzone', opponent: 'LionHeart', result: 'Loss', score: '12-15', date: '2024-01-13' },
    { id: 3, game: 'FIFA 24', opponent: 'AtlasWarrior', result: 'Win', score: '2-0', date: '2024-01-12' }
  ];

  // Calculate win rate, handle division by zero
  const winRate = user.totalWins + user.totalLosses > 0
    ? Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100)
    : 0;

  return (
    <div className="bg-dark-900 text-white">
      <div className="space-y-8">

        {/* Profile Header */}
        <AnimatedSection tag="div" className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-32 h-32 rounded-full object-cover border-2 border-dark-600"
              />
              {user.verified && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-dark-800">
                  <Star className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                  <p className="text-xl text-gray-300 mb-2">{user.fullName}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm mb-2">
                    <MapPin size={14} className="mr-1" />
                    {user.city}, {user.country}
                  </div>
                </div>
                <Link to="/edit-profile" className="btn-primary flex items-center self-center md:self-start mt-4 md:mt-0 flex-shrink-0">
                  <Edit3 className="mr-2" size={16} />
                  Edit Profile
                </Link>
              </div>

              <AnimatedSection tag="div" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center" delay={50}>
                 <div>
                   <div className="text-2xl font-bold text-primary-400 flex items-center justify-center">
                     <Coins className="w-5 h-5 mr-1"/> {user.credits}
                   </div>
                   <div className="text-gray-400 text-sm">Credits</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-green-400">{user.totalWins}</div>
                   <div className="text-gray-400 text-sm">Wins</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-red-400">{user.totalLosses}</div>
                   <div className="text-gray-400 text-sm">Losses</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
                   <div className="text-gray-400 text-sm">Win Rate</div>
                 </div>
              </AnimatedSection>

              <AnimatedSection tag="p" className="text-gray-300 mb-4" delay={100}>{user.bio}</AnimatedSection>

              <AnimatedSection tag="div" className="flex flex-wrap gap-2 justify-center md:justify-start" delay={150}>
                {user.favoriteGames.map((game) => (
                  <span key={game} className="bg-primary-900 text-primary-200 px-3 py-1 rounded-full text-sm">
                    {game}
                  </span>
                ))}
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Matches */}
            <AnimatedSection tag="div" className="card" delay={200}>
              <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <AnimatedSection key={match.id} tag="div" className="bg-dark-800 rounded-lg p-4" delay={index * 50}>
                     <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex-1 min-w-[150px]">
                        <h3 className="font-semibold mb-1 truncate">{match.game}</h3>
                        <p className="text-gray-400 text-sm">vs {match.opponent}</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold mb-1 text-sm ${match.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>
                          {match.result} ({match.score})
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm text-right min-w-[80px]">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
                 {recentMatches.length > 0 && (
                    <div className="text-center mt-4">
                        <Link to="/profile/matches" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                            View All Matches
                        </Link>
                    </div>
                 )}
                  {recentMatches.length === 0 && (
                    <p className="text-gray-400">No recent match history.</p>
                 )}
              </div>
            </AnimatedSection>

            {/* REPLACED: My Teams Section */}
            <AnimatedSection tag="div" className="card" delay={300}>
              <h2 className="text-2xl font-bold mb-6">My Teams</h2>
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team, index) => (
                    <AnimatedSection key={team.id} tag="div" className="bg-dark-800 rounded-lg p-4" delay={index * 50}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={team.logo} alt={`${team.name} logo`} className="w-10 h-10 rounded-md mr-4"/>
                          <div>
                            <Link to={`/team/${team.id}`} className="font-semibold hover:text-primary-400 transition-colors">{team.name}</Link>
                            <p className="text-sm text-gray-400">{team.game}</p>
                          </div>
                        </div>
                        <span className="text-sm bg-primary-700 text-primary-100 px-2 py-1 rounded">{team.role}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You are not currently part of any teams.</p>
              )}
               <div className="text-center mt-6">
                   <Link to="/players?view=teams" className="btn-secondary">
                       Find or Create Teams
                   </Link>
               </div>
            </AnimatedSection>

            {/* Optional: Display In-Game Names/UIDs for Favorite Games */}
            <AnimatedSection tag="div" className="card" delay={400}>
                <h2 className="text-2xl font-bold mb-6">Game Profiles</h2>
                {user.favoriteGames.length > 0 ? (
                    <div className="space-y-4">
                        {user.favoriteGames.map((game, index) => (
                            user.gameDetails[game] && (user.gameDetails[game].ign || user.gameDetails[game].uid) ? (
                                <AnimatedSection key={game} tag="div" className="bg-dark-800 rounded-lg p-4" delay={index * 50}>
                                    <p className="font-semibold text-primary-400 mb-2">{game}</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                        {user.gameDetails[game].ign && (
                                            <p><span className="text-gray-400">IGN:</span> {user.gameDetails[game].ign}</p>
                                        )}
                                        {user.gameDetails[game].uid && (
                                            <p><span className="text-gray-400">UID:</span> {user.gameDetails[game].uid}</p>
                                        )}
                                    </div>
                                </AnimatedSection>
                            ) : null
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Add favorite games and details in Edit Profile.</p>
                )}
            </AnimatedSection>

          </div> {/* End Main Content Column */}

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <AnimatedSection tag="div" className="card" delay={500}>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300 truncate">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{user.phone || 'Not Provided'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">
                    Last active {new Date(user.lastActive).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </AnimatedSection>

            {/* Social Links */}
            <AnimatedSection tag="div" className="card" delay={600}>
              <h2 className="text-xl font-bold mb-4">Social Links</h2>
              <div className="space-y-3">
                {Object.entries(user.socialLinks)
                  .filter(([_, url]) => url)
                  .map(([platform, url], index) => (
                  <AnimatedSection key={platform} tag="a" href={url} target="_blank" rel="noopener noreferrer" delay={index*50}
                    className="flex items-center p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group">
                    <div className="w-6 h-6 bg-primary-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                       {platform.substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-gray-300 capitalize group-hover:text-primary-400">{platform}</span>
                  </AnimatedSection>
                ))}
                 {Object.values(user.socialLinks).filter(url => url).length === 0 && (
                    <p className="text-gray-400 text-sm">No social links added yet.</p>
                 )}
              </div>
            </AnimatedSection>

             {/* Game Stats (Placeholder) */}
             <AnimatedSection tag="div" className="card" delay={700}>
               <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
               <p className="text-gray-400 text-sm">Detailed game stats coming soon!</p>
             </AnimatedSection>
          </div> {/* End Sidebar */}
        </div> {/* End Grid */}
      </div> {/* End Page Container */}
    </div>
  );
}