
import { User, Edit3, Trophy, Users, Calendar, MapPin, Star, Mail, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true,
    rank: 'Diamond I',
    totalWins: 145,
    totalLosses: 32,
    favoriteGames: ['FIFA 24', 'COD Warzone', 'Mobile Legends'],
    socialLinks: {
      twitch: 'https://twitch.tv/progamer2024',
      youtube: 'https://youtube.com/progamer2024',
      instagram: 'https://instagram.com/progamer2024'
    }
  };

  const achievements = [
    {
      id: 1,
      title: 'FIFA Champion',
      description: 'Won the African FIFA Championship 2023',
      icon: Trophy,
      date: '2023-12-15'
    },
    {
      id: 2,
      title: 'Tournament Organizer',
      description: 'Successfully organized 5+ tournaments',
      icon: Users,
      date: '2023-11-20'
    },
    {
      id: 3,
      title: 'Community Leader',
      description: 'Reached 1000+ followers on the platform',
      icon: Star,
      date: '2023-10-10'
    },
    {
      id: 4,
      title: 'Consistent Player',
      description: 'Played 100+ matches this season',
      icon: Calendar,
      date: '2023-09-05'
    }
  ];

  const recentMatches = [
    {
      id: 1,
      game: 'FIFA 24',
      opponent: 'DesertStorm',
      result: 'Win',
      score: '3-1',
      date: '2024-01-14'
    },
    {
      id: 2,
      game: 'COD Warzone',
      opponent: 'LionHeart',
      result: 'Loss',
      score: '12-15',
      date: '2024-01-13'
    },
    {
      id: 3,
      game: 'FIFA 24',
      opponent: 'AtlasWarrior',
      result: 'Win',
      score: '2-0',
      date: '2024-01-12'
    }
  ];

  const winRate = Math.round((user.totalWins / (user.totalWins + user.totalLosses)) * 100);

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-32 h-32 rounded-full object-cover"
              />
              {user.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                  <p className="text-xl text-gray-300 mb-2">{user.fullName}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                    <MapPin size={16} className="mr-1" />
                    {user.city}, {user.country}
                  </div>
                </div>
                <Link to="/edit-profile" className="btn-primary flex items-center">
                  <Edit3 className="mr-2" size={16} />
                  Edit Profile
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{user.rank}</div>
                  <div className="text-gray-400 text-sm">Current Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{user.totalWins}</div>
                  <div className="text-gray-400 text-sm">Total Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{user.totalLosses}</div>
                  <div className="text-gray-400 text-sm">Total Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{user.bio}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {user.favoriteGames.map((game) => (
                  <span key={game} className="bg-primary-900 text-primary-200 px-3 py-1 rounded-full text-sm">
                    {game}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Matches */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="bg-dark-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold mb-1">{match.game}</h3>
                        <p className="text-gray-400 text-sm">vs {match.opponent}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold mb-1 ${
                          match.result === 'Win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.result}
                        </div>
                        <div className="text-gray-400 text-sm">{match.score}</div>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="bg-dark-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <IconComponent className="w-6 h-6 text-primary-400 mr-3 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{achievement.title}</h3>
                          <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                          <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">{user.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">
                    Last active {new Date(user.lastActive).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Social Links</h2>
              <div className="space-y-3">
                {Object.entries(user.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                  >
                    <div className="w-6 h-6 bg-primary-600 rounded mr-3"></div>
                    <span className="text-gray-300 capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Game Stats */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Game Statistics</h2>
              <div className="space-y-4">
                {user.favoriteGames.map((game, index) => {
                  const gameWins = Math.floor(user.totalWins / user.favoriteGames.length) + (index * 5);
                  const gameLosses = Math.floor(user.totalLosses / user.favoriteGames.length) + (index * 2);
                  const gameWinRate = Math.round((gameWins / (gameWins + gameLosses)) * 100);
                  
                  return (
                    <div key={game} className="bg-dark-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{game}</span>
                        <span className="text-sm text-primary-400">{gameWinRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{gameWins}W</span>
                        <span>{gameLosses}L</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
