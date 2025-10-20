// src/pages/Farlight84Page.jsx

import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight, PlusCircle, Calendar, Gamepad2, Hash, Clock, BarChart, ListChecks } from 'lucide-react'; // Added ListChecks
import { useState } from 'react';
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Data & Components for Farlight 84 ---

const upcomingCups = [
    { id: 401, title: 'Farlight 84 Sunset City Showdown', format: 'Squads BR', entries: 32, date: '01 Nov', prize: '$800+', image: '/images/action_2.jpg' }, // Placeholder image
    { id: 402, title: 'Lampton Hunt Tournament - Nov', format: 'Hunt Mode', entries: 50, date: '05 Nov', prize: '$400', image: '/images/action_4.jpg' }, // Placeholder image
];

const pastCups = [
    { id: 501, title: 'Farlight Africa Launch Cup', format: 'Squads BR', entries: 64, date: '15 Sep', prize: '$1000', image: '/images/lan_7.jpg', winner: 'Apex Predators'}, // Placeholder image
];

const topTeams = [
    { rank: 1, name: 'Apex Predators', points: 1200, members: 4, logo: '/images/team_a.png' }, // Placeholder logos
    { rank: 2, name: 'Sunset Raiders', points: 1150, members: 4, logo: '/images/team_s.png' },
    { rank: 3, name: 'Lampton Legends', points: 1090, members: 4, logo: '/images/team_l.png' },
    { rank: 4, name: 'Cyber Squad', points: 980, members: 4, logo: '/images/team_c.png' },
];

const allTeams = [
    { name: 'Future Fighters', members: 4, logo: '/images/team_d.png' },
    { name: 'Tech Titans', members: 4, logo: '/images/team_r.png' },
    { name: 'Quantum Force', members: 4, logo: '/images/team_o.png' },
];

// --- Placeholder Data for User's Joined Farlight 84 Tournaments ---
const myJoinedFarlightTournaments = [
    { id: 401, title: 'Farlight 84 Sunset City Showdown', date: '01 Nov', status: 'Upcoming', nextMatch: 'Match 1 - Group Stage - 17:00' },
    // Add more joined Farlight 84 tournaments here
];
// -----------------------------------------------------------------

// --- Enhanced Cup List Item (Reused) ---
const CupListItem = ({ cup, isPast = false }) => (
    // Link to dynamic tournament route
    <Link
        to={`/tournament/${cup.id}`}
        className="block relative group overflow-hidden rounded-xl shadow-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
    >
        <img
            src={cup.image || '/images/fl_cup_thumb.jpg'} // Placeholder thumbnail
            alt="Cup Background"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isPast ? 'opacity-20 group-hover:opacity-30' : 'opacity-30 group-hover:opacity-40'}`}
        />
        <div className="relative z-10 p-5 bg-gradient-to-r from-dark-800/90 via-dark-800/80 to-transparent flex items-center justify-between">
            <div className="flex-grow pr-4">
                <h4 className={`text-lg font-bold mb-1 transition-colors ${isPast ? 'text-gray-400 group-hover:text-gray-300' : 'text-white group-hover:text-primary-300'}`}>
                    {cup.title}
                </h4>
                <p className="text-sm text-gray-400">{cup.format} &bull; {cup.entries} Entries</p>
                {isPast && cup.winner && <p className="text-xs text-yellow-500 mt-1">Winner: {cup.winner}</p>}
            </div>
            <div className="text-right flex-shrink-0">
                <p className={`text-2xl font-extrabold leading-none mb-1 ${isPast ? 'text-yellow-600' :'text-yellow-400'}`}>{cup.prize}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{cup.date}</p>
            </div>
        </div>
         <div className="absolute top-4 right-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ArrowRight size={20} />
         </div>
    </Link>
);


// --- Content Components (Adapted for Farlight 84) ---

const CupsContent = () => (
    <AnimatedSection delay={0} className="space-y-10">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center">
            <Trophy size={28} className="mr-3" /> Farlight 84 Cups
        </h2>
        <p className="text-gray-300 text-lg">Upcoming official cups and tournament history for Farlight 84.</p>
        {/* Upcoming */}
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white flex items-center"><Clock size={20} className="mr-3 text-green-400" /> Upcoming Cups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingCups.map((cup, index) => (
                    <AnimatedSection key={cup.id} delay={100 + index * 100}><CupListItem cup={cup} /></AnimatedSection>
                ))}
                {upcomingCups.length === 0 && <p className="text-gray-500 md:col-span-2">No upcoming Farlight 84 cups scheduled.</p>}
            </div>
        </div>
        {/* Past */}
        <div className="space-y-6 pt-8 border-t border-dark-700">
            <h3 className="text-2xl font-semibold text-white flex items-center"><Calendar size={20} className="mr-3 text-yellow-400" /> Past Events Archive</h3>
            {pastCups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pastCups.map((cup, index) => (
                        <AnimatedSection key={cup.id} delay={300 + index * 100}><CupListItem cup={cup} isPast={true} /></AnimatedSection>
                    ))}
                </div>
            ) : ( <div className="p-8 bg-dark-800 rounded-xl text-center text-gray-500 border border-dark-700"><Trophy size={40} className="mx-auto mb-4 opacity-50"/><p>No past tournament data available yet.</p></div> )}
        </div>
    </AnimatedSection>
);

const LeaderboardContent = () => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center">
            <BarChart size={28} className="mr-3" /> Farlight 84 Leaderboard
        </h2>
        <p className="text-gray-300 text-lg">Top Farlight 84 teams competing on Africa Rise Esports.</p>
        <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
            <div className="hidden sm:flex justify-between items-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-dark-700"><span className="w-1/12 text-center">Rank</span><span className="w-5/12 pl-4">Team</span><span className="w-3/12 text-center">Members</span><span className="w-3/12 text-right pr-4">Points</span></div>
            <div className="space-y-3">
                {topTeams.map((team, index) => (
                     <AnimatedSection key={team.rank} delay={100 + index * 50} className={`flex flex-wrap sm:flex-nowrap items-center p-3 rounded-lg transition-all duration-300 border-l-4 ${ index === 0 ? 'bg-yellow-500/10 border-yellow-400 hover:bg-yellow-500/20' : index === 1 ? 'bg-gray-500/10 border-gray-400 hover:bg-gray-500/20' : index === 2 ? 'bg-amber-600/10 border-amber-500 hover:bg-amber-600/20' : 'bg-dark-700 hover:bg-dark-600 border-transparent hover:border-primary-500/50' }`} >
                        <div className="flex items-center space-x-3 w-full sm:w-6/12 pb-2 sm:pb-0"><span className={`text-center font-extrabold text-xl w-8 flex-shrink-0 ${index < 3 ? 'text-white' : 'text-gray-400'}`}>{team.rank}</span><img src={team.logo || '/images/team_placeholder.png'} alt={team.name} className="w-10 h-10 rounded-full object-cover border-2 border-dark-600 flex-shrink-0" /><div className="flex-grow"><p className={`font-semibold text-base leading-tight ${index < 3 ? 'text-white' : 'text-gray-200'}`}>{team.name}</p><Link to={`/team/${team.name.toLowerCase().replace(/\s/g, '-')}`} className="text-xs text-primary-400 hover:text-primary-300">View Team</Link></div></div>
                        <div className="flex justify-between sm:justify-end space-x-4 sm:space-x-0 w-full sm:w-6/12 text-sm pl-12 sm:pl-0"><div className="w-auto sm:w-3/12 text-left sm:text-center text-gray-400 flex items-center justify-start sm:justify-center"><Users size={16} className="mr-1 sm:mr-2" /> <span>{team.members}</span></div><span className={`w-auto sm:w-3/12 text-right font-bold text-base sm:text-lg ${index < 3 ? 'text-white' : 'text-yellow-400'}`}>{team.points.toLocaleString()}</span></div>
                    </AnimatedSection>
                ))}
                <p className="text-center text-sm text-gray-500 pt-4">... View Full Leaderboard</p>
            </div>
        </div>
    </AnimatedSection>
);

const TeamsContent = () => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center"><Users size={28} className="mr-3" /> Farlight 84 Team Directory</h2>
        <p className="text-gray-300 text-lg">Find Farlight 84 teams or form your own crew.</p>
        <AnimatedSection delay={100} className="bg-gradient-to-r from-green-600/30 to-dark-800/50 p-6 rounded-xl border border-green-500/50 shadow-lg flex items-center justify-between">
            <div><h3 className="text-2xl font-bold text-white mb-2">Form Your Squad</h3><p className="text-green-200">Create your Farlight 84 team and enter the fray.</p></div>
            <Link to="/my-teams" className="btn-primary bg-green-600 hover:bg-green-700 flex items-center flex-shrink-0"><PlusCircle size={18} className="mr-2"/> Create Team</Link>
        </AnimatedSection>
        <AnimatedSection delay={200} className="space-y-6 pt-6">
            <h3 className="text-2xl font-semibold text-white">Registered Teams ({allTeams.length})</h3>
            <div className="p-4 bg-dark-700 rounded-lg flex items-center border border-dark-600"><input type="text" placeholder="Search teams..." className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"/></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allTeams.map((team, index) => (
                    <AnimatedSection key={index} delay={250 + index * 50} className="flex items-center p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors shadow-lg border border-dark-700 hover:border-primary-500/50">
                         <img src={team.logo || '/images/team_placeholder.png'} alt={team.name} className="w-12 h-12 rounded-full object-cover border-2 border-dark-600 mr-4" />
                         <div className="flex-grow"><p className="font-bold text-white text-lg">{team.name}</p><span className="text-gray-400 text-sm flex items-center"><Users size={14} className="mr-1"/> {team.members} Members</span></div>
                         <Link to={`/team/${team.name.toLowerCase().replace(/\s/g, '-')}`} className="btn-secondary text-sm px-3 py-1.5 transition-transform hover:scale-105"> View </Link>
                    </AnimatedSection>
                ))}
            </div>
        </AnimatedSection>
    </AnimatedSection>
);

// --- Main Page Component ---
export default function Farlight84Page() {
    const [activeTab, setActiveTab] = useState('rundown');
    const navTabs = [ { name: 'RUNDOWN', path: 'rundown', icon: Hash }, { name: 'CUPS', path: 'cups', icon: Trophy }, { name: 'LEADERBOARD', path: 'leaderboard', icon: BarChart }, { name: 'TEAMS', path: 'teams', icon: Users }, ];
    // Placeholder Rundown data for Farlight 84
    const recentMatchesRundown = [
        { winner: 'Jetstream', loser: 'Blaze', winnerScore: 1, loserScore: 0, winnerLogo: '/images/ava_m_4.png', loserLogo: '/images/ava_f_4.png' }, // Example player match
        { teams: ['/images/team_a.png', '/images/team_s.png', '/images/team_c.png', '/images/team_l.png'] }, // Example team logos from a Quads match
        { teams: ['/images/team_d.png', '/images/team_r.png', '/images/team_o.png'] }, // Example other match
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'cups': return <CupsContent />;
            case 'leaderboard': return <LeaderboardContent />;
            case 'teams': return <TeamsContent />;
            case 'rundown': default: return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
                    {/* Left Column */}
                    <div className="lg:w-2/3 space-y-10">
                        <AnimatedSection delay={100} className="relative group overflow-hidden bg-gradient-to-br from-orange-600 via-red-700 to-orange-800 p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-orange-500/50">
                             <div className="absolute inset-0 bg-[url('/images/lan_7.jpg')] bg-cover opacity-[0.05] mix-blend-overlay"></div>
                             <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between"><h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">ISLE EXPLOSION SERIES</h2><p className="text-orange-200 text-base sm:text-lg mb-4 sm:mb-0">High-Octane Farlight 84 Action</p><Link to="/event/isle-explosion" className="btn-primary bg-white text-orange-800 hover:bg-orange-100 font-bold py-3 px-6 rounded-xl flex items-center transition-colors text-base shadow-lg mt-4 sm:mt-0 transform hover:scale-105">EVENT DETAILS <ArrowRight size={20} className="ml-2" /></Link></div>
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-primary-400 flex items-center"><Clock size={20} className="mr-2"/> UPCOMING CUPS</h3><button onClick={() => setActiveTab('cups')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">View All <ArrowRight size={16} className="ml-1" /></button></div>
                            <div className="space-y-4">{upcomingCups.slice(0, 3).map((cup, index) => (<AnimatedSection key={cup.id} delay={250 + index * 50}><CupListItem cup={cup} /></AnimatedSection>))}</div>
                        </AnimatedSection>
                    </div>
                    {/* Right Column */}
                    <div className="lg:w-1/3 space-y-10">
                         {/* --- NEW: My Tournaments Section --- */}
                        <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                             <h3 className="text-2xl font-bold text-primary-400 mb-6 flex items-center"><ListChecks size={20} className="mr-2"/> My Tournaments</h3>
                             {myJoinedFarlightTournaments.length > 0 ? (
                                <div className="space-y-4">
                                    {myJoinedFarlightTournaments.map((tournament, index) => (
                                         <AnimatedSection key={tournament.id} delay={350 + index * 50} className="bg-dark-700/50 rounded-lg p-4 border-l-4 border-primary-500/60">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link to={`/tournament/${tournament.id}`} className="font-semibold text-white hover:text-primary-300 text-base leading-tight">{tournament.title}</Link>
                                                <span className={`text-xs px-2 py-0.5 rounded ${tournament.status === 'Upcoming' ? 'bg-blue-600/70 text-blue-100' : 'bg-gray-600/70 text-gray-200'}`}>{tournament.status}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2"><Calendar size={12} className="inline mr-1"/> Starts: {tournament.date}</p>
                                            <p className="text-sm text-gray-300"><Clock size={12} className="inline mr-1"/> Next: {tournament.nextMatch}</p>
                                        </AnimatedSection>
                                    ))}
                                </div>
                             ) : (
                                <p className="text-gray-500 text-center py-4">You haven't joined any Farlight 84 tournaments yet.</p>
                             )}
                              <button className="w-full mt-6 text-center text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium" onClick={() => setActiveTab('cups')}>
                                Find Tournaments to Join
                             </button>
                        </AnimatedSection>
                        {/* ---------------------------------- */}

                        <AnimatedSection delay={400} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                             <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-green-400">FIND SQUAD</h3><button className="bg-green-600/30 text-green-300 hover:bg-green-600/50 font-semibold py-1.5 px-4 rounded-lg text-sm flex items-center transition-colors"><PlusCircle size={16} className="mr-1" /> Look For Group</button></div>
                            <div className="bg-dark-900 p-4 rounded-lg flex justify-between items-center border border-dark-600 hover:border-green-500/50 transition-colors"><div><p className="text-base font-semibold text-white">Sunset City Grind</p><p className="text-sm text-gray-400 flex items-center"><Calendar size={14} className="mr-1" /> BR Squads - Platinum+</p></div><div className="text-right"><p className="text-xl font-bold text-green-400 leading-none">3/4</p><p className="text-sm text-gray-500 leading-none">Players</p></div></div>
                        </AnimatedSection>

                        <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                            <h3 className="text-2xl font-bold text-primary-400 mb-6">RECENT RESULTS</h3><div className="space-y-4"><div className="border border-dark-700 p-3 rounded-lg bg-dark-900"><div className="flex items-center justify-between mb-1 text-sm"><div className="flex items-center"><img src={recentMatchesRundown[0].loserLogo} alt="loser" className="w-6 h-6 rounded-full mr-2 opacity-70"/> <span className="text-gray-400 line-through">{recentMatchesRundown[0].loser}</span></div><span className="font-semibold text-red-500">{recentMatchesRundown[0].loserScore}</span></div><div className="flex items-center justify-between text-sm"><div className="flex items-center"><img src={recentMatchesRundown[0].winnerLogo} alt="winner" className="w-6 h-6 rounded-full mr-2 border-2 border-green-500"/> <span className="font-bold text-white">{recentMatchesRundown[0].winner}</span></div><span className="font-bold text-green-400">{recentMatchesRundown[0].winnerScore}</span></div></div>{[recentMatchesRundown[1], recentMatchesRundown[2]].map((match, idx) => (<div key={idx} className="flex flex-wrap gap-2 p-3 bg-dark-700 rounded-lg border border-dark-600">{match.teams.map((logo, index) => (<img key={index} src={logo} alt={`Team ${index}`} className="w-6 h-6 rounded-full object-cover border border-dark-900" title={`Team ${index+1}`} />))}</div>))}</div><button className="w-full mt-6 text-center text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">View Match History</button>
                        </AnimatedSection>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-full mx-auto space-y-10 pb-10">
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl">
                    <img src="/images/lan_7.jpg" alt="Farlight 84 Banner" className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-orange-400 bg-dark-800/50 p-2 rounded-lg border border-orange-500/30" /><h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">FARLIGHT 84 HUB</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">Enter the vibrant world of Farlight 84 competitions. Find tournaments, teams, and rankings.</p>
                    </div>
                </AnimatedSection>
                <AnimatedSection delay={50} className="sticky top-16 bg-dark-900 z-30 shadow-md border-b border-dark-700">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 sm:space-x-8 text-base sm:text-lg font-semibold text-gray-400 overflow-x-auto">
                        {navTabs.map((tab) => (<button key={tab.name} onClick={() => setActiveTab(tab.path)} className={`flex items-center py-4 px-1 whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab.path ? 'text-primary-400 border-primary-400' : 'border-transparent hover:text-white hover:border-gray-500'}`}><tab.icon size={18} className="mr-2 hidden sm:inline-block"/> {tab.name}</button>))}
                    </nav>
                </AnimatedSection>
                <div className="max-w-7xl mx-auto mt-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}