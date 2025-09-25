
<old_str>import { User, Edit3, Trophy, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <User className="mr-3 text-primary-500" size={32} />
              Profile
            </h1>
            <Link to="/edit-profile" className="btn-primary flex items-center">
              <Edit3 className="mr-2" size={16} />
              Edit Profile
            </Link>
          </div>
          <p className="text-gray-300">Your profile information and stats will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}</old_str>
<new_str>import { User, Edit3, Trophy, Users, Calendar, MapPin, Star, Mail, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const user = {
    username: 'GamerPro123',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    country: 'Nigeria',
    city: 'Lagos',
    joinDate: '2023-06-15',
    rank: 'Gold III',
    level: 25,
    bio: 'Passionate FIFA player from Nigeria. Been competing in esports for 3 years. Always looking for new challenges and teammates!'
  };

  const stats = [
    { label: 'Current Rank', value: user.rank, icon: Star, color: 'text-yellow-400' },
    { label: 'Level', value: user.level, icon: Trophy, color: 'text-green-400' },
    { label: 'Tournaments Played', value: '23', icon: Calendar, color: 'text-blue-400' },
    { label: 'Win Rate', value: '67%', icon: Trophy, color: 'text-purple-400' },
  ];

  const recentMatches = [
    {
      id: 1,
      tournament: 'FIFA 24 Championship',
      opponent: 'TeamAlpha',
      result: 'Win',
      score: '3-1',
      date: '2024-02-10',
      game: 'FIFA 24'
    },
    {
      id: 2,
      tournament: 'Mobile Legends Cup',
      opponent: 'Lightning Squad',
      result: 'Loss',
      score: '1-2',
      date: '2024-02-08',
      game: 'Mobile Legends'
    },
    {
      id: 3,
      tournament: 'COD Warzone Battle',
      opponent: 'Desert Hawks',
      result: 'Win',
      score: '15-8',
      date: '2024-02-05',
      game: 'COD Warzone'
    },
  ];

  const achievements = [
    {
      title: 'FIFA Champion',
      description: 'Won the African FIFA Championship',
      date: '2024-01-15',
      icon: Trophy
    },
    {
      title: 'Tournament Veteran',
      description: 'Participated in 20+ tournaments',
      date: '2024-01-10',
      icon: Calendar
    },
    {
      title: 'Team Player',
      description: 'Member of 3 successful teams',
      date: '2023-12-20',
      icon: Users
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-20 h-20 rounded-full mr-6"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
                <p className="text-primary-400 text-lg">@{user.username}</p>
                <div className="flex items-center text-gray-400 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{user.city}, {user.country}</span>
                </div>
              </div>
            </div>
            <Link to="/edit-profile" className="btn-primary flex items-center">
              <Edit3 className="mr-2" size={16} />
              Edit Profile
            </Link>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-300">{user.bio}</p>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-300">
              <Mail size={16} className="mr-2 text-primary-400" />
              {user.email}
            </div>
            <div className="flex items-center text-gray-300">
              <Phone size={16} className="mr-2 text-primary-400" />
              {user.phone}
            </div>
            <div className="flex items-center text-gray-300">
              <Clock size={16} className="mr-2 text-primary-400" />
              Joined {new Date(user.joinDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="card text-center">
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <span>{match.game}</span>
                    <span>{match.score}</span>
                    <span>{new Date(match.date).toLocaleDateString()}</span>
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
      </div>
    </div>
  );
}</new_str>
