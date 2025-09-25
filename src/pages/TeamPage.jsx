
<old_str>import { Users } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Users className="mr-3 text-primary-500" size={32} />
            Team Details
          </h1>
          <p className="text-gray-300">Team information and roster will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}</old_str>
<new_str>import { Users, Trophy, Calendar, MapPin, Star, Mail, Edit3, UserPlus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamPage() {
  const team = {
    id: 1,
    name: 'Thunder Hawks',
    logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop',
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
      username: 'ThunderLeader',
      fullName: 'John Doe',
      role: 'Captain',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinDate: '2023-03-15',
      kd: '2.45',
      status: 'online'
    },
    {
      id: 2,
      username: 'HawkSniper',
      fullName: 'Mike Johnson',
      role: 'Sniper',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      joinDate: '2023-03-20',
      kd: '3.12',
      status: 'online'
    },
    {
      id: 3,
      username: 'StormAssault',
      fullName: 'David Wilson',
      role: 'Assault',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      joinDate: '2023-04-01',
      kd: '1.98',
      status: 'offline'
    },
    {
      id: 4,
      username: 'LightningSupport',
      fullName: 'Alex Brown',
      role: 'Support',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
      joinDate: '2023-04-10',
      kd: '1.76',
      status: 'online'
    }
  ];

  const recentMatches = [
    {
      id: 1,
      tournament: 'African COD Championship',
      opponent: 'Desert Eagles',
      result: 'Win',
      score: '3-1',
      date: '2024-02-10',
      map: 'Verdansk'
    },
    {
      id: 2,
      tournament: 'Regional Qualifiers',
      opponent: 'Storm Riders',
      result: 'Win',
      score: '3-0',
      date: '2024-02-08',
      map: 'Rebirth Island'
    },
    {
      id: 3,
      tournament: 'Weekly Tournament',
      opponent: 'Fire Squad',
      result: 'Loss',
      score: '1-3',
      date: '2024-02-05',
      map: 'Caldera'
    }
  ];

  const achievements = [
    {
      title: 'Regional Champions',
      description: 'Won the West African COD Championship',
      date: '2024-01-15',
      icon: Trophy
    },
    {
      title: 'Tournament Streak',
      description: '10 consecutive tournament wins',
      date: '2023-12-20',
      icon: Star
    },
    {
      title: 'Team Formation',
      description: 'Official team registration',
      date: '2023-03-15',
      icon: Users
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={team.logo}
                alt={team.name}
                className="w-20 h-20 rounded-lg mr-6"
              />
              <div>
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold mr-3">{team.name}</h1>
                  {team.verified && (
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-primary-400 text-lg">{team.game}</p>
                <div className="flex items-center text-gray-400 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{team.city}, {team.country}</span>
                </div>
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

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{team.wins}</div>
              <div className="text-gray-400 text-sm">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{team.losses}</div>
              <div className="text-gray-400 text-sm">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">#{team.ranking}</div>
              <div className="text-gray-400 text-sm">Ranking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{members.length}</div>
              <div className="text-gray-400 text-sm">Members</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-300">{team.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Roster */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Team Roster</h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="bg-dark-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={member.avatar}
                          alt={member.fullName}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div className={`absolute bottom-0 right-4 w-3 h-3 rounded-full border-2 border-dark-800 ${
                          member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.fullName}</h3>
                        <p className="text-gray-400 text-sm">@{member.username}</p>
                        <p className="text-primary-400 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{member.kd}</div>
                      <div className="text-gray-400 text-sm">K/D Ratio</div>
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
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{match.tournament}</h3>
                      <p className="text-gray-400 text-sm">vs {match.opponent}</p>
                      <p className="text-gray-500 text-xs">{match.map}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        match.result === 'Win' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-red-900 text-red-300'
                      }`}>
                        {match.result}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{match.score}</span>
                    <span>{new Date(match.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
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
}</new_str>
