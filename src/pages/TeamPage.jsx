
import { Users, Trophy, Calendar, MapPin, Star, Mail, Edit3, UserPlus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamPage() {
  const team = {
    id: 1,
    name: 'Thunder Hawks',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop',
    game: 'COD Warzone',
    country: 'Nigeria',
    city: 'Lagos',
    founded: '2023-03-15',
    description: 'Elite COD Warzone team from Nigeria. We dominate the African scene and are looking to expand globally.',
    wins: 34,
    losses: 8,
    ranking: 3,
    verified: true
  };

  const members = [
    {
      id: 1,
      username: 'ThunderStrike',
      fullName: 'Ahmed Okafor',
      role: 'Captain',
      joinDate: '2023-03-15',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      stats: { kills: 1250, deaths: 890, assists: 340 }
    },
    {
      id: 2,
      username: 'HawkEye92',
      fullName: 'David Adebayo',
      role: 'Sniper',
      joinDate: '2023-04-01',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      stats: { kills: 980, deaths: 720, assists: 210 }
    },
    {
      id: 3,
      username: 'StormRider',
      fullName: 'Kemi Adegoke',
      role: 'Support',
      joinDate: '2023-04-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c02e02d1?w=80&h=80&fit=crop&crop=face',
      stats: { kills: 750, deaths: 650, assists: 520 }
    },
    {
      id: 4,
      username: 'NightFury',
      fullName: 'Chima Okeke',
      role: 'Assault',
      joinDate: '2023-05-01',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
      stats: { kills: 1100, deaths: 800, assists: 280 }
    }
  ];

  const recentMatches = [
    {
      id: 1,
      opponent: 'Desert Eagles',
      result: 'Win',
      score: '16-12',
      date: '2024-01-14',
      duration: '45 min'
    },
    {
      id: 2,
      opponent: 'Lion Pride',
      result: 'Win',
      score: '16-8',
      date: '2024-01-12',
      duration: '38 min'
    },
    {
      id: 3,
      opponent: 'Atlas Warriors',
      result: 'Loss',
      score: '12-16',
      date: '2024-01-10',
      duration: '52 min'
    }
  ];

  const achievements = [
    {
      title: 'African Champions',
      description: 'Won COD Warzone African Championship 2023',
      icon: Trophy,
      date: '2023-12-15'
    },
    {
      title: 'Regional Dominators',
      description: 'Won West African Regional League',
      icon: Star,
      date: '2023-10-20'
    },
    {
      title: 'Team of the Year',
      description: 'Awarded Best COD Team in Nigeria 2023',
      icon: Users,
      date: '2023-11-30'
    }
  ];

  const winRate = Math.round((team.wins / (team.wins + team.losses)) * 100);

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <img
                src={team.logo}
                alt={team.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              {team.verified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
                  <p className="text-xl text-primary-400 mb-2">{team.game}</p>
                  <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                    <MapPin size={16} className="mr-1" />
                    {team.city}, {team.country}
                  </div>
                  <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                    <Calendar size={16} className="mr-1" />
                    Founded {new Date(team.founded).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary flex items-center">
                    <UserPlus className="mr-2" size={16} />
                    Join Team
                  </button>
                  <button className="btn-secondary flex items-center">
                    <Settings className="mr-2" size={16} />
                    Manage
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-400">#{team.ranking}</div>
                  <div className="text-gray-400 text-sm">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{team.wins}</div>
                  <div className="text-gray-400 text-sm">Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{team.losses}</div>
                  <div className="text-gray-400 text-sm">Losses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{winRate}%</div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
              </div>
              
              <p className="text-gray-300">{team.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Team Members */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Team Members</h2>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="bg-dark-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img
                          src={member.avatar}
                          alt={member.fullName}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h3 className="font-semibold">{member.username}</h3>
                          <p className="text-gray-400 text-sm">{member.fullName}</p>
                          <p className="text-primary-400 text-sm">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p>Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-green-400">{member.stats.kills}</div>
                        <div className="text-gray-400">Kills</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-400">{member.stats.deaths}</div>
                        <div className="text-gray-400">Deaths</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-400">{member.stats.assists}</div>
                        <div className="text-gray-400">Assists</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Matches */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Recent Matches</h2>
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="bg-dark-800 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold mb-1">vs {match.opponent}</h3>
                        <p className="text-gray-400 text-sm">{match.duration} • {new Date(match.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold mb-1 ${
                          match.result === 'Win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.result}
                        </div>
                        <div className="text-gray-400 text-sm">{match.score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Matches:</span>
                  <span>{team.wins + team.losses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Streak:</span>
                  <span className="text-green-400">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Streak:</span>
                  <span className="text-primary-400">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Match Duration:</span>
                  <span>42 min</span>
                </div>
              </div>
            </div>

            {/* Upcoming Tournaments */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Upcoming Tournaments</h2>
              <div className="space-y-3">
                <div className="bg-dark-800 rounded-lg p-3">
                  <h4 className="font-medium mb-1">African Championship</h4>
                  <p className="text-sm text-gray-400">Starts February 15, 2024</p>
                  <p className="text-sm text-primary-400">$10,000 Prize Pool</p>
                </div>
                <div className="bg-dark-800 rounded-lg p-3">
                  <h4 className="font-medium mb-1">Regional League</h4>
                  <p className="text-sm text-gray-400">Starts March 1, 2024</p>
                  <p className="text-sm text-primary-400">$5,000 Prize Pool</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Contact Team</h2>
              <div className="space-y-3">
                <button className="w-full btn-secondary flex items-center justify-center">
                  <Mail className="mr-2" size={16} />
                  Send Message
                </button>
                <button className="w-full btn-primary flex items-center justify-center">
                  <UserPlus className="mr-2" size={16} />
                  Request to Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card mt-8">
          <h2 className="text-2xl font-bold mb-6">Team Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="bg-dark-800 rounded-lg p-4 text-center">
                  <IconComponent className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                  <p className="text-xs text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
