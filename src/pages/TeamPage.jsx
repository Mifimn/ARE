// src/pages/TeamPage.jsx

import { Users, Trophy, Calendar, MapPin, Star, Mail, UserPlus, Settings, Edit3, BarChart, Percent, Crosshair } from 'lucide-react'; // Added new icons
import { Link, useParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useState, useEffect } from 'react'; // For potential data fetching

export default function TeamPage() {
    const { teamId } = useParams(); // Get teamId from URL
    // Simulate fetching data - replace with actual Supabase fetch logic
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Placeholder Data & Fetch Simulation ---
    useEffect(() => {
        setLoading(true);
        console.log(`Fetching data for team ID: ${teamId}`);
        // Replace with actual Supabase fetch: supabase.from('teams').select('*, members:team_members(*)').eq('id', teamId).single()
        const fetchedTeam = {
            id: teamId || 'thunder-hawks-123', // Use param or default
            name: 'Thunder Hawks',
            logo: 'https://via.placeholder.com/150/FF4500/FFFFFF?text=New+Hawk+Logo', // Use logo from provided code
            banner: '/images/lan_9.jpg', // Placeholder banner - Fetch or set a default
            game: 'COD Warzone',
            country: 'Nigeria',
            city: 'Lagos',
            founded: '2023-03-15',
            description: 'Elite COD Warzone team from Nigeria. We dominate the African scene and are looking to expand globally. The team is energized and focused after recent strategic changes.', // From provided code
            wins: 34,
            losses: 8,
            ranking: 3,
            verified: true,
            members: [ // From provided code with updated stats
                { id: 1, username: 'ThunderStrike', fullName: 'Ahmed Okafor', role: 'Captain', joinDate: '2023-03-15', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', stats: { impactScore: 92, winShare: 28.5, accuracy: 24.1 } },
                { id: 2, username: 'HawkEye92', fullName: 'David Adebayo', role: 'Sniper', joinDate: '2023-04-01', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', stats: { impactScore: 88, winShare: 25.0, accuracy: 31.5 } },
                { id: 3, username: 'StormRider', fullName: 'Kemi Adegoke', role: 'Support', joinDate: '2023-04-15', avatar: 'https://images.unsplash.com/photo-1494790108755-2616c02e02d1?w=80&h=80&fit=crop&crop=face', stats: { impactScore: 85, winShare: 21.0, accuracy: 19.8 } },
                { id: 4, username: 'NightFury', fullName: 'Chima Okeke', role: 'Assault', joinDate: '2023-05-01', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', stats: { impactScore: 90, winShare: 25.5, accuracy: 26.2 } }
            ],
            recentMatches: [ // From provided code
                { id: 1, opponent: 'Desert Eagles', result: 'Win', score: '16-12', date: '2024-01-14', duration: '45 min' },
                { id: 2, opponent: 'Lion Pride', result: 'Win', score: '16-8', date: '2024-01-12', duration: '38 min' },
                { id: 3, opponent: 'Atlas Warriors', result: 'Loss', score: '12-16', date: '2024-01-10', duration: '52 min' }
            ],
            achievements: [ // From provided code
                { title: 'African Champions', description: 'Won COD Warzone African Championship 2023', icon: Trophy, date: '2023-12-15' },
                { title: 'Regional Dominators', description: 'Won West African Regional League', icon: Star, date: '2023-10-20' },
                { title: 'Team of the Year', description: 'Awarded Best COD Team in Nigeria 2023', icon: Users, date: '2023-11-30' }
            ]
        };

        setTimeout(() => {
            setTeamData(fetchedTeam);
            setLoading(false);
        }, 300);

    }, [teamId]);

     // Loading State
     if (loading || !teamData) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> );
    }

    const winRate = teamData.wins + teamData.losses > 0
        ? Math.round((teamData.wins / (teamData.wins + teamData.losses)) * 100)
        : 0;

    return (
        // Adjusted background from provided code
        <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white min-h-screen relative overflow-hidden z-10">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] z-[-1]"></div>
            <div className="absolute inset-0 bg-radial-gradient-to-tl from-transparent via-primary-900/5 to-transparent animate-pulse-slow"></div>

            <div className="max-w-full mx-auto space-y-8 lg:space-y-10 pb-10 relative z-10">

                {/* --- Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl bg-dark-800">
                    <img src={teamData.banner || '/images/lan_1.jpg'} alt={`${teamData.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-sm scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                         <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                             <div className="relative -mt-16 sm:-mt-12 flex-shrink-0">
                                <img src={teamData.logo} alt={teamData.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary-500 bg-dark-800 shadow-lg"/>
                                {teamData.verified && ( <div className="absolute bottom-1 right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-white"><Star className="w-5 h-5 text-white fill-white" /></div> )}
                             </div>
                             <div className="flex-grow text-center sm:text-left mb-2">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md mb-1">{teamData.name}</h1>
                                <p className="text-lg sm:text-xl text-primary-400 font-semibold mb-2">{teamData.game}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-gray-400 text-sm">
                                    <span className="flex items-center"><MapPin size={14} className="mr-1 text-red-500" /> {teamData.city}, {teamData.country}</span>
                                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> Founded {new Date(teamData.founded).toLocaleDateString()}</span>
                                </div>
                             </div>
                             <div className="flex gap-3 flex-shrink-0 mt-3 sm:mt-0">
                                <Link to={`/manage-team/${teamData.id}`} className="btn-secondary text-sm flex items-center"><Settings className="mr-1.5" size={16} /> Manage</Link>
                                <button className="btn-primary text-sm flex items-center"><UserPlus className="mr-1.5" size={16} /> Join Team</button>
                             </div>
                         </div>
                    </div>
                </AnimatedSection>

                {/* --- Main Content Grid --- */}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                     {/* Left Column (Main Details) */}
                    <div className="lg:col-span-2 space-y-8 lg:space-y-10">

                        {/* Team Stats Overview */}
                        <AnimatedSection delay={100} className="card bg-dark-800 p-5 rounded-xl shadow-lg">
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div><div className="text-3xl font-bold text-primary-400">#{teamData.ranking}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Rank</div></div>
                                <div><div className="text-3xl font-bold text-green-400">{teamData.wins}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Wins</div></div>
                                <div><div className="text-3xl font-bold text-red-400">{teamData.losses}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Losses</div></div>
                                <div><div className="text-3xl font-bold text-blue-400">{winRate}%</div><div className="text-gray-400 text-xs uppercase tracking-wider">Win Rate</div></div>
                             </div>
                        </AnimatedSection>

                        {/* Team Description */}
                        <AnimatedSection delay={150} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-primary-300 mb-3">About {teamData.name}</h2>
                            <p className="text-gray-300 italic leading-relaxed">{teamData.description}</p>
                        </AnimatedSection>


                        {/* Team Members */}
                        <AnimatedSection delay={200} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Active Roster ({teamData.members.length})</h2>
                            <div className="space-y-5">
                                {teamData.members.map((member, index) => (
                                    <AnimatedSection key={member.id} delay={index * 50} className="bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:bg-dark-700/80 border border-dark-600 hover:border-primary-600/50">
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
                                            <div className="flex items-center flex-grow w-full sm:w-auto">
                                                <img src={member.avatar} alt={member.fullName} className="w-12 h-12 rounded-full mr-4 border border-primary-500/50 flex-shrink-0" />
                                                <div>
                                                    <Link to={`/profile/${member.username}`} className="font-semibold text-lg text-white hover:text-primary-300 transition-colors">{member.username}</Link>
                                                    <p className="text-gray-400 text-sm -mt-1">{member.fullName}</p>
                                                    <p className="text-primary-400 font-medium text-sm">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="text-right text-xs text-gray-400 flex-shrink-0 mt-2 sm:mt-0">
                                                <p>Joined: {new Date(member.joinDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        {/* Metrics Display - UPDATED with new metrics */}
                                        <div className="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t border-dark-600/50">
                                            <div className="text-center"><div className="font-semibold text-xl text-green-400">{member.stats.impactScore}</div><div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><BarChart size={12} className="mr-1"/>Impact</div></div>
                                            <div className="text-center"><div className="font-semibold text-xl text-blue-400">{member.stats.winShare}%</div><div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><Percent size={12} className="mr-1"/>Win Share</div></div>
                                            <div className="text-center"><div className="font-semibold text-xl text-yellow-400">{member.stats.accuracy}%</div><div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><Crosshair size={12} className="mr-1"/>Accuracy</div></div>
                                        </div>
                                    </AnimatedSection>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* Recent Matches */}
                        <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Recent Matches</h2>
                            {teamData.recentMatches.length > 0 ? (
                                <div className="space-y-4">
                                    {teamData.recentMatches.map((match, index) => (
                                         <AnimatedSection key={match.id} delay={index * 50} className="bg-dark-700/50 rounded-lg p-4 border-l-4 border-primary-500/60 transition-colors duration-300 hover:border-primary-500">
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-lg text-white mb-1">vs {match.opponent}</h3>
                                                    <p className="text-gray-400 text-sm">{match.duration} • {new Date(match.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-left sm:text-right mt-1 sm:mt-0">
                                                    <div className={`font-bold text-xl mb-0.5 ${ match.result === 'Win' ? 'text-green-400' : 'text-red-400' }`}>{match.result}</div>
                                                    <div className="text-gray-400 text-sm">{match.score}</div>
                                                </div>
                                            </div>
                                        </AnimatedSection>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No recent match history available.</p>
                            )}
                        </AnimatedSection>
                    </div> {/* End Left Column */}

                     {/* Right Column (Sidebar) */}
                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        {/* Quick Stats */}
                        <AnimatedSection delay={400} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Quick Stats</h2>
                            <div className="space-y-3 text-base">
                                <div className="flex justify-between"><span className="text-gray-400">Total Matches:</span><span className="font-medium text-primary-300">{teamData.wins + teamData.losses}</span></div>
                                <div className="flex justify-between"><span className="text-gray-400">Current Streak:</span><span className="text-green-400 font-bold">W7</span></div> {/* Placeholder */}
                                <div className="flex justify-between"><span className="text-gray-400">Best Streak:</span><span className="text-primary-400 font-bold">W12</span></div> {/* Placeholder */}
                                <div className="flex justify-between"><span className="text-gray-400">Avg Duration:</span><span className="font-medium text-primary-300">42 min</span></div> {/* Placeholder */}
                            </div>
                        </AnimatedSection>

                        {/* Upcoming Tournaments */}
                        <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Upcoming Events</h2>
                            <div className="space-y-4">
                                <div className="bg-dark-700/50 rounded-lg p-4 border border-primary-700/30">
                                    <h4 className="font-semibold mb-1 text-lg text-white">African Championship</h4>
                                    <p className="text-sm text-gray-400 mb-1">Starts Feb 15, 2024</p>
                                    <p className="text-sm text-primary-400 font-semibold">$10,000 Prize Pool</p>
                                </div>
                                {/* Add more events */}
                            </div>
                        </AnimatedSection>

                        {/* Contact */}
                        <AnimatedSection delay={600} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Contact Team</h2>
                            <button className="w-full btn-primary flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
                                <Mail className="mr-2" size={16} /> Send Message
                            </button>
                        </AnimatedSection>
                    </div> {/* End Right Column */}
                </div> {/* End Main Grid */}

                 {/* Achievements */}
                <AnimatedSection delay={700} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 card bg-dark-800 mt-8 p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Team Achievements</h2>
                    {teamData.achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {teamData.achievements.map((achievement, index) => {
                                const IconComponent = achievement.icon;
                                return (
                                    <AnimatedSection key={index} delay={index * 100} className="bg-dark-700/50 rounded-lg p-6 text-center border border-dark-600 transition-all duration-300 hover:shadow-primary-lg hover:border-primary-500/50">
                                        <IconComponent className="w-10 h-10 text-primary-400 mx-auto mb-4" />
                                        <h3 className="font-semibold text-xl mb-2 text-white">{achievement.title}</h3>
                                        <p className="text-gray-400 text-sm mb-2">{achievement.description}</p>
                                        <p className="text-xs text-gray-500 font-mono">{new Date(achievement.date).toLocaleDateString()}</p>
                                    </AnimatedSection>
                                );
                            })}
                        </div>
                    ) : (
                         <p className="text-gray-400 text-center py-4">This team has no recorded achievements yet.</p>
                    )}
                </AnimatedSection>

            </div> {/* End Page Container */}
        </div>
    );
}