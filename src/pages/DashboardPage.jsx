
import { Calendar, Trophy, Users, Bell, TrendingUp, Clock, Star } from 'lucide-react';

export default function DashboardPage() {
  const user = {
    username: 'GamerPro123',
    fullName: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rank: 'Gold III',
    level: 25
  };

  const stats = [
    { label: 'Current Rank', value: user.rank, icon: Star, color: 'text-yellow-400' },
    { label: 'Tournaments Played', value: '12', icon: Trophy, color: 'text-green-400' },
    { label: 'Win Rate', value: '67%', icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Active Teams', value: '2', icon: Users, color: 'text-purple-400' },
  ];

  const upcomingMatches = [
    {
      id: 1,
      tournament: 'FIFA 24 Championship',
      opponent: 'TeamAlpha',
      date: '2024-02-15',
      time: '18:00',
      game: 'FIFA 24'
    },
    {
      id: 2,
      tournament: 'Mobile Legends Cup',
      opponent: 'Lightning Squad',
      date: '2024-02-16',
      time: '20:00',
      game: 'Mobile Legends'
    },
    {
      id: 3,
      tournament: 'COD Warzone Battle',
      opponent: 'Desert Hawks',
      date: '2024-02-18',
      time: '19:30',
      game: 'COD Warzone'
    },
  ];

  const recentNews = [
    {
      id: 1,
      title: 'New FIFA 24 Tournament Announced',
      summary: 'Join the biggest FIFA tournament in African esports history...',
      date: '2024-02-10',
      category: 'Tournament'
    },
    {
      id: 2,
      title: 'Platform Update: New Features Released',
      summary: 'We\'ve added new team management tools and improved the tournament...',
      date: '2024-02-08',
      category: 'Update'
    },
    {
      id: 3,
      title: 'Spotlight: Rising Stars of African Esports',
      summary: 'Meet the top 10 players making waves in the competitive scene...',
      date: '2024-02-05',
      category: 'Feature'
    },
  ];

  const notifications = [
    { id: 1, message: 'Your team "Thunder Bolts" has a match in 2 hours', type: 'match', time: '2 hours ago' },
    { id: 2, message: 'Tournament registration for "Valorant Champions" is now open', type: 'tournament', time: '4 hours ago' },
    { id: 3, message: 'You received a team invitation from "Elite Gamers"', type: 'invitation', time: '1 day ago' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-400">
            Ready to dominate the competition today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color}`} size={32} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Clock className="mr-2 text-primary-500" size={24} />
                Upcoming Matches
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map(match => (
                <div key={match.id} className="bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{match.tournament}</h3>
                      <p className="text-primary-400 text-sm">{match.game}</p>
                    </div>
                    <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                      {new Date(match.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-300">vs {match.opponent}</p>
                    <p className="text-gray-400 text-sm">{match.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent News */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Bell className="mr-2 text-primary-500" size={24} />
                Recent News
              </h2>
            </div>
            <div className="space-y-4">
              {recentNews.map(news => (
                <div key={news.id} className="bg-dark-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{news.title}</h3>
                    <span className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded">
                      {news.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{news.summary}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(news.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card mt-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Bell className="mr-2 text-primary-500" size={24} />
            Recent Notifications
          </h2>
          <div className="space-y-3">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-start justify-between bg-dark-700 rounded-lg p-4">
                <div className="flex-1">
                  <p className="text-gray-300">{notification.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
