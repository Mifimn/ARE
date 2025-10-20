// src/pages/CupPage.jsx

import { useState } from 'react';
import { Trophy, Calendar, Clock, Users, Crown, ListChecks, BarChart, Hash, Info, DollarSign } from 'lucide-react'; // Added Info, DollarSign
import AnimatedSection from '../components/AnimatedSection';

export default function CupPage() {
    const [activeTab, setActiveTab] = useState('rundown');

    // --- Placeholder Data ---
    const cup = {
        name: 'African Mobile Legends Cup',
        game: 'Mobile Legends',
        totalTeams: 16,
        prizePool: 3000,
        startDate: '2024-02-20',
        status: 'Group Stage',
        image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=400&fit=crop'
    };

    const bracket = { // Keep this for the Matches tab
        quarterFinals: [
          { match: 1, team1: { name: 'Thunder Hawks', score: 2, logo: 'https://via.placeholder.com/40x40/FF8C00/ffffff?text=TH' }, team2: { name: 'Storm Riders', score: 1, logo: 'https://via.placeholder.com/40x40/1E90FF/ffffff?text=SR' }, winner: 'Thunder Hawks', date: '2025-10-21', time: '18:00' },
          { match: 2, team1: { name: 'Desert Eagles', score: 3, logo: 'https://via.placeholder.com/40x40/FFD700/000000?text=DE' }, team2: { name: 'Lion Pride', score: 1, logo: 'https://via.placeholder.com/40x40/8B4513/ffffff?text=LP' }, winner: 'Desert Eagles', date: '2025-10-21', time: '19:00' },
          { match: 3, team1: { name: 'Atlas Warriors', score: 2, logo: 'https://via.placeholder.com/40x40/4682B4/ffffff?text=AW' }, team2: { name: 'Pharaoh Force', score: 0, logo: 'https://via.placeholder.com/40x40/008080/ffffff?text=PF' }, winner: 'Atlas Warriors', date: '2025-10-22', time: '18:00' },
          { match: 4, team1: { name: 'Savanna Kings', score: 1, logo: 'https://via.placeholder.com/40x40/228B22/ffffff?text=SK' }, team2: { name: 'Nile Sharks', score: 2, logo: 'https://via.placeholder.com/40x40/00008B/ffffff?text=NS' }, winner: 'Nile Sharks', date: '2025-10-22', time: '19:00' }
        ],
        semiFinals: [
          { match: 1, team1: { name: 'Thunder Hawks', score: null }, team2: { name: 'Desert Eagles', score: null }, winner: null, date: '2025-10-24', time: '18:00' },
          { match: 2, team1: { name: 'Atlas Warriors', score: null }, team2: { name: 'Nile Sharks', score: null }, winner: null, date: '2025-10-24', time: '20:00' }
        ],
        final: { match: 1, team1: { name: 'TBD', score: null }, team2: { name: 'TBD', score: null }, winner: null, date: '2025-10-26', time: '20:00' }
      };

    const prizeDistribution = [
        { position: 'Winner', prize: '$1,500', icon: Crown, color: 'text-yellow-400' },
        { position: 'Runner-up', prize: '$750', icon: Trophy, color: 'text-gray-300' },
        { position: 'Semi-finalists', prize: '$375', icon: Trophy, color: 'text-amber-600' },
    ];

    const teamRankingsByGroup = {
        groupA: [
            { rank: 1, name: 'Desert Eagles', logo: 'https://via.placeholder.com/40x40/FFD700/000000?text=DE', wins: 3, losses: 0, points: 9 },
            { rank: 2, name: 'Lion Pride', logo: 'https://via.placeholder.com/40x40/8B4513/ffffff?text=LP', wins: 2, losses: 1, points: 6 },
            { rank: 3, name: 'Pharaoh Force', logo: 'https://via.placeholder.com/40x40/008080/ffffff?text=PF', wins: 1, losses: 2, points: 3 },
            { rank: 4, name: 'Savanna Kings', logo: 'https://via.placeholder.com/40x40/228B22/ffffff?text=SK', wins: 0, losses: 3, points: 0 },
        ].sort((a, b) => a.rank - b.rank),
        groupB: [
            { rank: 1, name: 'Thunder Hawks', logo: 'https://via.placeholder.com/40x40/FF8C00/ffffff?text=TH', wins: 3, losses: 0, points: 9 },
            { rank: 2, name: 'Atlas Warriors', logo: 'https://via.placeholder.com/40x40/4682B4/ffffff?text=AW', wins: 2, losses: 1, points: 6 },
            { rank: 3, name: 'Nile Sharks', logo: 'https://via.placeholder.com/40x40/00008B/ffffff?text=NS', wins: 1, losses: 2, points: 3 },
            { rank: 4, name: 'Storm Riders', logo: 'https://via.placeholder.com/40x40/1E90FF/ffffff?text=SR', wins: 0, losses: 3, points: 0 },
        ].sort((a, b) => a.rank - b.rank),
    };

    const navTabs = [
        { name: 'RUNDOWN', path: 'rundown', icon: Hash },
        { name: 'MATCHES', path: 'matches', icon: ListChecks },
        { name: 'RANK', path: 'rank', icon: BarChart },
    ];

    // --- Match Card Component ---
    const MatchCard = ({ match, round, delay = 0 }) => (
        <AnimatedSection delay={delay} className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500/50 transition-colors duration-200">
             <div className="text-center mb-3">
                 <div className="text-sm font-medium text-primary-400">{round} {match.match ? `- Match ${match.match}` : ''}</div>
                <div className="text-xs text-gray-400">{match.date} • {match.time}</div>
             </div>
             <div className="space-y-2">
                 {/* Team 1 */}
                 <div className={`flex items-center justify-between p-2 rounded ${match.winner === match.team1.name ? 'bg-green-900/30' : 'bg-dark-700/50'}`}>
                    <div className="flex items-center space-x-2">
                         {match.team1.logo && <img src={match.team1.logo} alt={match.team1.name} className="w-6 h-6 rounded" />}
                         <span className={`text-sm font-medium ${match.winner === match.team1.name ? 'text-green-300' : 'text-gray-200'}`}>{match.team1.name}</span>
                     </div>
                     <div className={`text-lg font-bold ${match.winner === match.team1.name ? 'text-green-300' : 'text-gray-200'}`}>
                         {match.team1.score !== null ? match.team1.score : '-'}
                     </div>
                 </div>
                 {/* Team 2 */}
                  <div className={`flex items-center justify-between p-2 rounded ${match.winner === match.team2.name ? 'bg-green-900/30' : 'bg-dark-700/50'}`}>
                    <div className="flex items-center space-x-2">
                         {match.team2.logo && <img src={match.team2.logo} alt={match.team2.name} className="w-6 h-6 rounded" />}
                          <span className={`text-sm font-medium ${match.winner === match.team2.name ? 'text-green-300' : 'text-gray-200'}`}>{match.team2.name}</span>
                     </div>
                      <div className={`text-lg font-bold ${match.winner === match.team2.name ? 'text-green-300' : 'text-gray-200'}`}>
                         {match.team2.score !== null ? match.team2.score : '-'}
                     </div>
                 </div>
             </div>
             {match.winner && (
                 <div className="mt-3 text-center">
                     <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                         Winner: {match.winner}
                     </span>
                 </div>
             )}
         </AnimatedSection>
     );


    // --- Content Components for Tabs ---

    // ** FIXED: Added the actual component implementation back **
    const RundownContent = () => (
        <AnimatedSection delay={0} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prize Pool */}
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2"/> Prize Distribution</h2>
                <div className="space-y-3">
                    {prizeDistribution.map((prize, index) => {
                    const IconComponent = prize.icon;
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <IconComponent className={`w-5 h-5 mr-2 ${prize.color}`} />
                                <span className="text-sm">{prize.position}</span>
                            </div>
                            <span className="font-semibold">{prize.prize}</span>
                        </div>
                    );
                    })}
                </div>
            </div>

             {/* Key Info */}
             <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Info className="mr-2 text-primary-400"/> Key Info</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span>Single Elimination</span> {/* TODO: Make dynamic later */}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Teams:</span>
                        <span>{cup.totalTeams}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Current Round:</span>
                        <span className="text-primary-400">{cup.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Platform:</span>
                        <span>Mobile</span> {/* TODO: Make dynamic later */}
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span>{new Date(cup.startDate).toLocaleDateString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Total Prize:</span>
                        <span className="text-yellow-400">${cup.prizePool}</span>
                    </div>
                </div>
            </div>

             {/* Next Match Highlight */}
             <div className="md:col-span-2 card bg-gradient-to-r from-primary-700/30 to-dark-800/50 p-6 rounded-xl border border-primary-500/50 shadow-xl">
                 <h2 className="text-2xl font-bold text-white mb-3 flex items-center"><Clock className="mr-2"/> Next Up</h2>
                 {/* Find the next TBD match */}
                 {(() => { // IIFE to find next match
                     const nextQF = bracket.quarterFinals.find(m => m.winner === null);
                     const nextSF = bracket.semiFinals.find(m => m.winner === null);
                     const nextFinal = bracket.final.winner === null ? bracket.final : null;
                     const nextMatch = nextQF || nextSF || nextFinal;
                     const roundName = nextQF ? 'Quarter Final' : nextSF ? 'Semi Final' : nextFinal ? 'Final' : null;

                     return nextMatch ? (
                        <MatchCard match={nextMatch} round={roundName || 'Upcoming'} />
                     ) : (
                        <p className="text-primary-200">Final match details coming soon!</p>
                     );
                 })()}

            </div>
        </AnimatedSection>
    );

    // ** FIXED: Added the actual component implementation back **
    const MatchesContent = () => {
         const allMatches = [
            ...bracket.quarterFinals.map(m => ({ ...m, round: 'Quarter Final' })),
            ...bracket.semiFinals.map(m => ({ ...m, round: 'Semi Final' })),
            { ...bracket.final, round: 'Final' }
        ].sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)); // Sort by date/time more reliably

        const now = new Date();
        const upcoming = allMatches.filter(m => m.winner === null && new Date(m.date + 'T' + m.time) >= now);
        const completed = allMatches.filter(m => m.winner !== null || new Date(m.date + 'T' + m.time) < now);


        return (
            <AnimatedSection delay={0} className="space-y-10">
                 {/* Upcoming Matches */}
                <div>
                     <h3 className="text-2xl font-semibold mb-4 text-green-400 flex items-center"><Clock size={20} className="mr-2"/> Upcoming</h3>
                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Changed to 3 cols */}
                            {upcoming.map((match, index) => (
                                <MatchCard key={`upcoming-${match.round}-${match.match || 'final'}`} match={match} round={match.round} delay={index * 100} />
                            ))}
                        </div>
                    ) : (
                         <p className="text-gray-500 card bg-dark-800 p-4 text-center">No upcoming matches scheduled.</p>
                    )}
                 </div>

                 {/* Completed Matches */}
                <div>
                     <h3 className="text-2xl font-semibold mb-4 text-gray-400 flex items-center"><Calendar size={20} className="mr-2"/> Completed</h3>
                    {completed.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Changed to 3 cols */}
                            {completed.map((match, index) => (
                                <MatchCard key={`completed-${match.round}-${match.match || 'final'}`} match={match} round={match.round} delay={index * 100} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 card bg-dark-800 p-4 text-center">No matches completed yet.</p>
                    )}
                 </div>
            </AnimatedSection>
        );
    };

    // --- UPDATED: Rank Content Component ---
    const RankContent = () => {
        const [selectedGroup, setSelectedGroup] = useState('groupA'); // Default to Group A
        const currentGroupRankings = teamRankingsByGroup[selectedGroup] || [];

        return (
            <AnimatedSection delay={0} className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-primary-500/30 pb-3">
                     <h2 className="text-3xl font-bold text-primary-400 flex items-center mb-4 sm:mb-0">
                        <BarChart size={28} className="mr-3" /> Group Rankings
                    </h2>
                    {/* Group Selector Buttons */}
                    <div className="flex space-x-2 bg-dark-700 p-1 rounded-lg">
                        {Object.keys(teamRankingsByGroup).map((groupKey) => (
                            <button
                                key={groupKey}
                                onClick={() => setSelectedGroup(groupKey)}
                                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                                    selectedGroup === groupKey
                                        ? 'bg-primary-600 text-white shadow'
                                        : 'text-gray-300 hover:bg-dark-600'
                                }`}
                            >
                                Group {groupKey.replace('group', '').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-gray-300 text-lg">
                    Current standings for <span className="font-semibold text-primary-300">Group {selectedGroup.replace('group', '').toUpperCase()}</span>.
                </p>

                <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
                    {/* Updated Header Row */}
                    <div className="hidden sm:flex justify-between items-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-dark-700">
                        <span className="w-1/12 text-center">Rank</span>
                        <span className="w-5/12 pl-4">Team</span>
                        <span className="w-2/12 text-center">Wins</span>
                        <span className="w-2/12 text-center">Losses</span>
                        <span className="w-2/12 text-center">Points</span>
                    </div>
                    <div className="space-y-3">
                        {currentGroupRankings.length > 0 ? currentGroupRankings.map((team, index) => (
                            <AnimatedSection key={team.rank} delay={100 + index * 50} className={`flex flex-wrap sm:flex-nowrap items-center p-3 rounded-lg transition-all duration-300 border-l-4 ${ index === 0 ? 'bg-primary-600/10 border-primary-500' : 'bg-dark-700/50 border-transparent hover:bg-dark-600 hover:border-primary-500/30' }`} >
                                {/* Rank & Team Name */}
                                <div className="flex items-center space-x-3 w-full sm:w-6/12 pb-2 sm:pb-0">
                                    <span className={`text-center font-extrabold text-xl w-8 flex-shrink-0 ${index === 0 ? 'text-primary-400' : 'text-gray-400'}`}>{team.rank}</span>
                                    <img src={team.logo || '/images/team_placeholder.png'} alt={team.name} className="w-8 h-8 rounded-full object-cover border border-dark-600 flex-shrink-0" />
                                    <p className={`font-semibold text-base leading-tight ${index === 0 ? 'text-white' : 'text-gray-200'}`}>{team.name}</p>
                                </div>
                                {/* Wins, Losses & Points */}
                                <div className="flex justify-between sm:justify-end space-x-2 w-full sm:w-6/12 text-sm pl-12 sm:pl-0 mt-2 sm:mt-0">
                                    <span className="w-1/3 sm:w-2/12 text-center font-medium text-green-400">{team.wins}</span>
                                    <span className="w-1/3 sm:w-2/12 text-center font-medium text-red-400">{team.losses}</span>
                                    <span className="w-1/3 sm:w-2/12 text-center font-bold text-lg text-primary-300">{team.points}</span>
                                </div>
                            </AnimatedSection>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No ranking data available for this group yet.</p>
                        )}
                    </div>
                </div>
            </AnimatedSection>
        );
    };
    // --- End Updated Rank Component ---


    const renderContent = () => {
        switch (activeTab) {
            case 'matches': return <MatchesContent />;
            case 'rank': return <RankContent />;
            case 'rundown': default: return <RundownContent />;
        }
    };


    return (
        <div className="bg-dark-900 text-white min-h-screen">
             <div className="max-w-full mx-auto space-y-10 pb-10">
                {/* Header / Banner */}
                 <AnimatedSection delay={0} className="relative h-64 sm:h-72 w-full overflow-hidden shadow-xl">
                    <img src={cup.image || '/images/lan_6.jpg'} alt={`${cup.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Trophy className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" /><h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{cup.name}</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300">{cup.game} - {cup.status}</p>
                    </div>
                </AnimatedSection>

                 {/* Tab Navigation */}
                <AnimatedSection delay={50} className="sticky top-16 bg-dark-900 z-30 shadow-md border-b border-dark-700">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 sm:space-x-8 text-base sm:text-lg font-semibold text-gray-400 overflow-x-auto">
                        {navTabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.path)}
                                className={`flex items-center py-4 px-1 whitespace-nowrap border-b-2 transition-all duration-200 ${
                                    activeTab === tab.path
                                        ? 'text-primary-400 border-primary-400'
                                        : 'border-transparent hover:text-white hover:border-gray-500'
                                }`}
                            >
                                <tab.icon size={18} className="mr-2 hidden sm:inline-block"/> {tab.name}
                            </button>
                        ))}
                    </nav>
                </AnimatedSection>

                {/* Dynamic Content Area */}
                <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}