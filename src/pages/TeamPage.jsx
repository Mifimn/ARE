// src/pages/TeamPage.jsx (UPDATED with New Metrics, Energetic Background, and Logo)

import { Users, Trophy, Calendar, MapPin, Star, Mail, UserPlus, Settings, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

export default function TeamPage() {

    // 🔑 UPDATED: Team data reflecting an energetic new logo and description (post-management update).
    const team = {
        id: 1,
        name: 'Thunder Hawks',
        // Using a new logo URL to simulate the updated team profile
        logo: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=New+Hawk+Logo', 
        game: 'COD Warzone',
        country: 'Nigeria',
        city: 'Lagos',
        founded: '2023-03-15',
        description: 'Elite COD Warzone team from Nigeria. We dominate the African scene and are looking to expand globally. The team is energized and focused after recent strategic changes.',
        wins: 34,
        losses: 8,
        ranking: 3,
        verified: true
    };

    // 🔑 UPDATED: Replaced Kills, Deaths, Assists with more holistic metrics
    const members = [
        {
            id: 1,
            username: 'ThunderStrike',
            fullName: 'Ahmed Okafor',
            role: 'Captain',
            joinDate: '2023-03-15',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
            // 🔑 New stats structure
            stats: { impactScore: 92, winShare: 28.5, accuracy: 24.1 }
        },
        {
            id: 2,
            username: 'HawkEye92',
            fullName: 'David Adebayo',
            role: 'Sniper',
            joinDate: '2023-04-01',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            stats: { impactScore: 88, winShare: 25.0, accuracy: 31.5 }
        },
        {
            id: 3,
            username: 'StormRider',
            fullName: 'Kemi Adegoke',
            role: 'Support',
            joinDate: '2023-04-15',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616c02e02d1?w=80&h=80&fit=crop&crop=face',
            stats: { impactScore: 85, winShare: 21.0, accuracy: 19.8 }
        },
        {
            id: 4,
            username: 'NightFury',
            fullName: 'Chima Okeke',
            role: 'Assault',
            joinDate: '2023-05-01',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
            stats: { impactScore: 90, winShare: 25.5, accuracy: 26.2 }
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
        // 🔑 UPDATED: Energetic background gradient
        <div className="pt-20 min-h-screen text-white 
            bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 
            relative overflow-hidden z-10
        ">
            {/* Background elements for extra energy/cyber look (Tailwind classes for a subtle effect) */}
            <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] z-[-1]"></div>
            <div className="absolute inset-0 bg-radial-gradient-to-tl from-transparent via-primary-900/10 to-transparent animate-pulse-slow"></div>


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                {/* Team Header (Animated 0ms) */}
                <AnimatedSection delay={0} className="card mb-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            {/* 🔑 Updated logo URL is used here */}
                            <img
                                src={team.logo}
                                alt={team.name}
                                className="w-32 h-32 rounded-lg object-cover border-4 border-primary-500 shadow-lg"
                            />
                            {team.verified && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-white">
                                    <Star className="w-5 h-5 text-white fill-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-4xl font-extrabold mb-2 text-primary-400">{team.name}</h1>
                                    <p className="text-xl text-gray-300 mb-2">{team.game}</p>
                                    <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                                        <MapPin size={16} className="mr-1 text-red-500" />
                                        {team.city}, {team.country}
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                                        <Calendar size={16} className="mr-1" />
                                        Founded {new Date(team.founded).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    <Link to="/manage-team" className="btn-primary flex items-center shadow-lg">
                                        <Settings className="mr-2" size={16} />
                                        Manage Team
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-3 bg-dark-700/50 rounded-lg border border-primary-700/30">
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

                            <p className="text-gray-300 italic">{team.description}</p>
                        </div>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Team Members (Animated 200ms) */}
                        <AnimatedSection delay={200} className="card">
                            <h2 className="text-2xl font-bold mb-6 border-b border-dark-700 pb-2">Team Members</h2>
                            <div className="space-y-4">
                                {members.map((member) => (
                                    <div key={member.id} className="bg-dark-800 rounded-lg p-4 transition-all duration-300 hover:bg-primary-900/40 border border-dark-700 hover:border-primary-600">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <img
                                                    src={member.avatar}
                                                    alt={member.fullName}
                                                    className="w-12 h-12 rounded-full mr-4 border border-primary-500"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-lg">{member.username}</h3>
                                                    <p className="text-gray-400 text-sm">{member.fullName}</p>
                                                    <p className="text-primary-400 font-medium text-sm">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-gray-400">
                                                <p>Joined {new Date(member.joinDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {/* 🔑 New Metrics Display */}
                                        <div className="grid grid-cols-3 gap-4 text-sm mt-3 pt-3 border-t border-dark-700">
                                            <div className="text-center">
                                                <div className="font-semibold text-3xl text-green-400">{member.stats.impactScore}</div>
                                                <div className="text-gray-400 uppercase tracking-widest text-xs">Impact Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-3xl text-blue-400">{member.stats.winShare}%</div>
                                                <div className="text-gray-400 uppercase tracking-widest text-xs">Win Share</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold text-3xl text-yellow-400">{member.stats.accuracy}%</div>
                                                <div className="text-gray-400 uppercase tracking-widest text-xs">Accuracy</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* Recent Matches (Animated 300ms) */}
                        <AnimatedSection delay={300} className="card">
                            <h2 className="text-2xl font-bold mb-6 border-b border-dark-700 pb-2">Recent Matches</h2>
                            <div className="space-y-4">
                                {recentMatches.map((match) => (
                                    <div key={match.id} className="bg-dark-800 rounded-lg p-4 border-l-4 border-primary-500/50 transition-colors duration-300 hover:border-primary-500">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold mb-1 text-lg">vs {match.opponent}</h3>
                                                <p className="text-gray-400 text-sm">{match.duration} • {new Date(match.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-bold text-xl mb-1 ${
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
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Quick Stats (Animated 400ms) */}
                        <AnimatedSection delay={400} className="card">
                            <h2 className="text-xl font-bold mb-4 border-b border-dark-700 pb-2">Quick Stats</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-400">Total Matches:</span>
                                    <span className="font-medium text-primary-300">{team.wins + team.losses}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-400">Win Streak:</span>
                                    <span className="text-green-400 font-bold">7</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-400">Best Streak:</span>
                                    <span className="text-primary-400 font-bold">12</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-400">Avg Match Duration:</span>
                                    <span className="font-medium text-primary-300">42 min</span>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Upcoming Tournaments (Animated 500ms) */}
                        <AnimatedSection delay={500} className="card">
                            <h2 className="text-xl font-bold mb-4 border-b border-dark-700 pb-2">Upcoming Tournaments</h2>
                            <div className="space-y-3">
                                <div className="bg-dark-800 rounded-lg p-3 border border-primary-700/20">
                                    <h4 className="font-medium mb-1 text-lg">African Championship</h4>
                                    <p className="text-sm text-gray-400">Starts February 15, 2024</p>
                                    <p className="text-sm text-primary-400 font-semibold">$10,000 Prize Pool</p>
                                </div>
                                <div className="bg-dark-800 rounded-lg p-3 border border-primary-700/20">
                                    <h4 className="font-medium mb-1 text-lg">Regional League</h4>
                                    <p className="text-sm text-gray-400">Starts March 1, 2024</p>
                                    <p className="text-sm text-primary-400 font-semibold">$5,000 Prize Pool</p>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Contact (Animated 600ms) */}
                        <AnimatedSection delay={600} className="card">
                            <h2 className="text-xl font-bold mb-4 border-b border-dark-700 pb-2">Contact Team</h2>
                            <div className="space-y-3">
                                <button className="w-full btn-primary flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
                                    <Mail className="mr-2" size={16} />
                                    Send Message
                                </button>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>

                {/* Achievements (Animated 700ms) */}
                <AnimatedSection delay={700} className="card mt-8">
                    <h2 className="text-2xl font-bold mb-6 border-b border-dark-700 pb-2">Team Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => {
                            const IconComponent = achievement.icon;
                            return (
                                <div key={index} className="bg-dark-800 rounded-lg p-6 text-center border border-dark-700 transition-all duration-300 hover:shadow-primary-lg">
                                    <IconComponent className="w-10 h-10 text-primary-400 mx-auto mb-3" />
                                    <h3 className="font-semibold text-xl mb-2">{achievement.title}</h3>
                                    <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                                    <p className="text-xs text-gray-500 font-mono">{new Date(achievement.date).toLocaleDateString()}</p>
                                </div>
                            );
                        })}
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}