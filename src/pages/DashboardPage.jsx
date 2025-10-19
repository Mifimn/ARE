// src/pages/DashboardPage.jsx

import { Calendar, Trophy, Users, Bell, TrendingUp, Clock, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection'; // Import the animation wrapper

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
    { id: 1, tournament: 'FIFA 24 Championship', opponent: 'TeamAlpha', date: '2024-02-15', time: '18:00', game: 'FIFA 24' },
    { id: 2, tournament: 'Mobile Legends Cup', opponent: 'Lightning Squad', date: '2024-02-16', time: '20:00', game: 'Mobile Legends' },
    { id: 3, tournament: 'COD Warzone Battle', opponent: 'Desert Hawks', date: '2024-02-18', time: '19:30', game: 'COD Warzone' },
  ];

  const recentNews = [
    { id: 1, title: 'New FIFA 24 Tournament Announced', summary: 'Join the biggest FIFA tournament...', date: '2024-02-10', category: 'Tournament' },
    { id: 2, title: 'Platform Update: New Features', summary: 'We\'ve added new team management tools...', date: '2024-02-08', category: 'Update' },
    { id: 3, title: 'Spotlight: Rising Stars', summary: 'Meet the top 10 players making waves...', date: '2024-02-05', category: 'Feature' },
  ];

  const notifications = [
    { id: 1, message: 'Your team "Thunder Bolts" has a match in 2 hours', type: 'match', time: '2 hours ago' },
    { id: 2, message: 'Tournament registration for "Valorant Champions" is open', type: 'tournament', time: '4 hours ago' },
    { id: 3, message: 'You received a team invitation from "Elite Gamers"', type: 'invitation', time: '1 day ago' },
  ];

  return (
    // Removed pt-20 and min-h-screen. Padding is handled in App.jsx's main section
    <div className="bg-dark-900 text-white">
      {/* Container with padding managed by App.jsx, but we might add some vertical space */}
      <div className="space-y-8"> {/* Add spacing between sections */}

        {/* Welcome Header */}
        <AnimatedSection tag="div" className="mb-8" delay={100}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.username}!
          </h1>
          <p className="text-gray-400">
            Ready to dominate the competition today?
          </p>
        </AnimatedSection>

        {/* Stats Cards */}
        {/* Animate the grid container */}
        <AnimatedSection tag="div" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" delay={200}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              // Animate each card individually
              <AnimatedSection key={index} tag="div" className="card" delay={index * 100}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color}`} size={32} />
                </div>
              </AnimatedSection>
            );
          })}
        </AnimatedSection>

        {/* Matches and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <AnimatedSection tag="div" className="card" direction="left" delay={300}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Clock className="mr-2 text-primary-500" size={24} />
                Upcoming Matches
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingMatches.map((match, index) => (
                // Animate each match item
                <AnimatedSection key={match.id} tag="div" className="bg-dark-700 rounded-lg p-4" delay={index * 100}>
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
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>

          {/* Recent News */}
          <AnimatedSection tag="div" className="card" direction="right" delay={400}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Bell className="mr-2 text-primary-500" size={24} />
                Recent News
              </h2>
            </div>
            <div className="space-y-4">
              {recentNews.map((news, index) => (
                // Animate each news item
                <AnimatedSection key={news.id} tag="div" className="bg-dark-700 rounded-lg p-4" delay={index * 100}>
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
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Notifications */}
        <AnimatedSection tag="div" className="card mt-8" delay={500}>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Bell className="mr-2 text-primary-500" size={24} />
            Recent Notifications
          </h2>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              // Animate each notification item
              <AnimatedSection key={notification.id} tag="div" className="flex items-start justify-between bg-dark-700 rounded-lg p-4" delay={index * 100}>
                <div className="flex-1">
                  <p className="text-gray-300">{notification.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{notification.time}</p>
                </div>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View
                </button>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

      </div> {/* End spacing container */}
    </div>
  );
}

