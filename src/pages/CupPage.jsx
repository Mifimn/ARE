// src/pages/CupPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Calendar, Clock, Users, Crown, ListChecks, BarChart, Hash, Info, DollarSign, TrendingUp, CheckCircle, Loader2, AlertCircle, Eye, X } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- SCORING ENGINE (Copied from UpdateTournamentPage) ---
const calculatePlacementPoints = (placement) => {
    if (placement < 1 || placement > 12) return 0;
    return 39 - (3 * (placement - 1)); // 1st=39, 2nd=36, 3rd=33...
};
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// --- DEMO DATA SETUP (Based on UpdateTournamentPage) ---
const teamTemplate = (id, name, logo) => ({ 
    id, name, logo, 
    score: 0, kills: 0, placement: 0, 
    group: null, advanced: false 
});

const freeFireTeams = Array.from({ length: 60 }, (_, i) => teamTemplate(2000 + i, `FF Team ${i + 1}`, `https://via.placeholder.com/30x30/FFA500/000000?text=F${i+1}`));

// --- SIMULATED GROUP DRAW & SCHEDULE ---
// Manually create groups for the demo
const simulatedGroups = Array.from({ length: 5 }, (_, i) => 
    freeFireTeams.slice(i * 12, (i + 1) * 12)
        .map(t => ({...t, group: `Group ${String.fromCharCode(65 + i)}`}))
);
// Manually create schedule for the demo
const simulatedSchedule = [];
simulatedGroups.forEach((group, gIndex) => {
    const groupId = String.fromCharCode(65 + gIndex);
    for (let i = 0; i < 3; i++) { // 3 maps per group
        simulatedSchedule.push({
            id: `1_M${i + 1}_G${groupId}`,
            stage: 'Qualifiers',
            mapNumber: i + 1,
            groupId: groupId,
            teams: group.map(t => ({ id: t.id, name: t.name })),
            status: (i === 0) ? 'Completed' : 'Scheduled', // Mark Map 1 as Completed
            dateTime: `2025-10-2${i + 1}T18:00`,
            results: [] // This will be populated by simulatedResults
        });
    }
});

// --- SIMULATED RESULTS (for Map 1 of each group) ---
const simulatedResults = [];
simulatedGroups.forEach((group, gIndex) => {
    const groupId = String.fromCharCode(65 + gIndex);
    const matchId = `1_M1_G${groupId}`;
    // Find the corresponding schedule entry and update its results
    const scheduleMatch = simulatedSchedule.find(m => m.id === matchId);
    if (scheduleMatch) {
        const shuffledTeams = [...group].sort(() => 0.5 - Math.random());
        const matchResults = shuffledTeams.map((team, index) => ({
            teamId: team.id,
            teamName: team.name,
            placement: index + 1,
            kills: Math.floor(Math.random() * 10)
        }));
        scheduleMatch.results = matchResults; // Add results to schedule
        // Add to main results list for standings
        simulatedResults.push({
            id: matchId,
            matchResults: matchResults.map(r => ({
                teamId: r.teamId, placement: r.placement, kills: r.kills
            }))
        });
    }
});
// --- END SIMULATED DATA ---


const allTournamentsData = [
    {
        id: 1, name: "Free Fire Clash Squads - MYTHIC'25", game: 'Free Fire', 
        prizePool: 5000,
        startDate: '2025-10-20', status: 'In Progress - Qualifiers',
        image: '/images/FF_ban.jpg',
        format: 'grouped-multi-stage-br',
        participantsList: freeFireTeams,
        stages: [
            { id: 1, name: 'Qualifiers', status: 'In Progress', totalTeams: 60, groups: 5, groupSize: 12, mapsPerGroup: 3, advanceRule: 'Top 9 per group + 3 Wildcard' },
            { id: 2, name: 'Playoff to 48', status: 'Pending', totalTeams: 48, groups: 4, groupSize: 12, mapsPerGroup: 6, advanceRule: 'Top 3 per group' },
            { id: 3, name: 'Grand Final', status: 'Pending', totalTeams: 12, groups: 1, groupSize: 12, mapsPerGroup: 8, advanceRule: 'Crown Champion' },
        ],
        currentStage: 1,
        stageData: {
            1: { groups: simulatedGroups, schedule: simulatedSchedule, results: simulatedResults, teamsAdvanced: [], status: 'Schedule Set' },
            2: { groups: [], schedule: [], results: [], teamsAdvanced: [], status: 'Pending' },
            3: { groups: [], schedule: [], results: [], teamsAdvanced: [], status: 'Pending' },
        }
    },
    // Add other tournament objects here if needed for testing different IDs
];
// --- END DEMO DATA SETUP ---


// --- Match Results Modal Component ---
const MatchResultsModal = ({ isOpen, onClose, match }) => {
    if (!isOpen || !match) return null;

    const resultsWithPoints = match.results.map(r => {
        const pPoints = calculatePlacementPoints(r.placement);
        const kPoints = calculateKillPoints(r.kills);
        const tPoints = pPoints + kPoints;
        return { ...r, pPoints, kPoints, tPoints };
    }).sort((a, b) => a.placement - b.placement); // Sort by placement

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-lg font-semibold text-white">Match Results: {match.id}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-700">
                            <thead className="bg-dark-700/70">
                                <tr>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Kills</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">P. Pts</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-red-400 uppercase tracking-wider">K. Pts</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700 text-sm">
                                {resultsWithPoints.map((r, index) => (
                                    <tr key={r.teamId} className="hover:bg-dark-700/50 transition-colors">
                                        <td className="px-3 py-2 text-center font-bold text-white">{r.placement}</td>
                                        <td className="px-3 py-2 font-medium text-white">{r.teamName}</td>
                                        <td className="px-3 py-2 text-center text-gray-300">{r.kills}</td>
                                        <td className="px-3 py-2 text-center font-bold text-yellow-300">{r.pPoints}</td>
                                        <td className="px-3 py-2 text-center font-bold text-red-300">{r.kPoints}</td>
                                        <td className="px-3 py-2 text-center font-extrabold text-primary-300">{r.tPoints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    <button onClick={onClose} className="btn-secondary text-sm">Close</button>
                </div>
            </div>
        </div>
    );
};


// --- Match Card Component (Adapted for BR) ---
const MatchCard = ({ match, delay = 0, onViewResults }) => (
    <AnimatedSection delay={delay} className={`bg-dark-800 rounded-lg p-4 border border-dark-700 ${match.status === 'Completed' ? 'opacity-80' : 'hover:border-primary-500/50'}`}>
         <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-primary-400">{match.id}</div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'}`}>
                {match.status}
            </span>
         </div>
         <h4 className="text-lg font-semibold text-white">
            Group {match.groupId} - Map {match.mapNumber}
         </h4>
         <p className="text-xs text-gray-400 mb-2">{match.teams.length} Teams</p>
         <div className="text-sm text-gray-300 flex items-center mb-3">
            <Clock size={14} className="mr-1.5"/>
            {new Date(match.dateTime).toLocaleString()}
         </div>
         {match.status === 'Completed' && (
             <button onClick={() => onViewResults(match)} className="btn-secondary btn-xs w-full flex items-center justify-center">
                <Eye size={14} className="mr-1.5" />
                 View Results
             </button>
         )}
     </AnimatedSection>
 );


// --- Content Components for Tabs ---

const RundownContent = ({ cup, currentStageDetails }) => {
    // Re-create a simple prize distribution for this demo
    const prizeDistribution = [
        { position: 'Winner', prize: '$2,500', icon: Crown, color: 'text-yellow-400' },
        { position: 'Runner-up', prize: '$1,000', icon: Trophy, color: 'text-gray-300' },
        { position: '3rd Place', prize: '$500', icon: Trophy, color: 'text-amber-600' },
        { position: '4th - 12th', prize: '$100', icon: DollarSign, color: 'text-gray-500' },
    ];

    return (
        <AnimatedSection delay={0} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prize Pool */}
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2"/> Prize Distribution</h2>
                <div className="text-center mb-4"><div className="text-3xl font-extrabold text-yellow-300">${cup.prizePool.toLocaleString()}</div><div className="text-gray-400 text-sm">Total Prize Pool</div></div>
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
                        <span className="font-semibold text-white">Grouped Multi-Stage BR</span>
                    </div>
                    {/* --- MODIFIED LINE --- */}
                    <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Users size={14} className="mr-1.5"/> Participants:</span>
                        <span className="font-semibold text-white">{cup.participantsList.length} Teams</span>
                    </div>
                    {/* --- END MODIFICATION --- */}
                    <div className="flex justify-between">
                        <span className="text-gray-400">Current Stage:</span>
                        <span className="text-primary-400 font-semibold">{currentStageDetails.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Platform:</span>
                        <span className="font-semibold text-white">Mobile</span> {/* Placeholder */}
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="font-semibold text-white">{new Date(cup.startDate).toLocaleDateString()}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Total Prize:</span>
                        <span className="text-yellow-400 font-semibold">${cup.prizePool.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

const MatchesContent = ({ currentStageState, onViewResults }) => {
    const allMatches = currentStageState.schedule.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    const upcoming = allMatches.filter(m => m.status !== 'Completed');
    const completed = allMatches.filter(m => m.status === 'Completed');

    return (
        <AnimatedSection delay={0} className="space-y-10">
             {/* Upcoming Matches */}
            <div>
                 <h3 className="text-2xl font-semibold mb-4 text-green-400 flex items-center"><Clock size={20} className="mr-2"/> Upcoming Matches</h3>
                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcoming.map((match, index) => (
                            <MatchCard key={match.id} match={match} delay={index * 100} onViewResults={onViewResults} />
                        ))}
                    </div>
                ) : (
                     <p className="text-gray-500 card bg-dark-800 p-4 text-center">No upcoming matches scheduled for this stage.</p>
                )}
             </div>

             {/* Completed Matches */}
            <div>
                 <h3 className="text-2xl font-semibold mb-4 text-gray-400 flex items-center"><Calendar size={20} className="mr-2"/> Completed Matches</h3>
                {completed.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completed.map((match, index) => (
                            <MatchCard key={match.id} match={match} delay={index * 100} onViewResults={onViewResults} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 card bg-dark-800 p-4 text-center">No matches completed yet for this stage.</p>
                )}
             </div>
        </AnimatedSection>
    );
};

// --- Updated Rank Content Component ---
const RankContent = ({ currentStageState, currentStageDetails }) => {

    // --- Logic copied from GroupedBRStageView ---
    const groupedStandings = useMemo(() => {
        if (!currentStageState.results || currentStageState.groups.length === 0) return {};

        const standings = {};
        const allTeamsInStage = currentStageState.groups.flat();

        allTeamsInStage.forEach(team => {
            const groupName = team.group;
            if (!standings[groupName]) { standings[groupName] = []; }
            standings[groupName].push({
                team: team, mapsPlayed: 0, placementPoints: 0, killPoints: 0, totalPoints: 0, wins: 0,
            });
        });

        currentStageState.results.forEach(match => {
            match.matchResults.forEach(result => {
                const teamInfo = allTeamsInStage.find(t => t.id === result.teamId);
                const groupName = teamInfo?.group;
                if (groupName) {
                    const teamStatIndex = standings[groupName]?.findIndex(s => s.team.id === result.teamId);
                    if (teamStatIndex !== -1) {
                        const stats = standings[groupName][teamStatIndex];
                        stats.mapsPlayed += 1;
                        const pPoints = calculatePlacementPoints(result.placement);
                        const kPoints = calculateKillPoints(result.kills);
                        const tPoints = pPoints + kPoints;
                        stats.placementPoints += pPoints;
                        stats.killPoints += kPoints;
                        stats.totalPoints += tPoints;
                        if (result.placement === 1) stats.wins += 1;
                    }
                }
            });
        });

        Object.keys(standings).forEach(groupName => {
            standings[groupName].sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                if (b.killPoints !== a.killPoints) return b.killPoints - a.killPoints;
                return b.wins - a.wins;
            });
        });
        return standings;
    }, [currentStageState.results, currentStageState.groups]);
    // --- End copied logic ---

    const groupNames = useMemo(() => Object.keys(groupedStandings).sort(), [groupedStandings]);
    const [selectedGroup, setSelectedGroup] = useState(groupNames[0] || null);

    useEffect(() => {
        // Set default selected group when group names load
        if (!selectedGroup && groupNames.length > 0) {
            setSelectedGroup(groupNames[0]);
        }
    }, [groupNames, selectedGroup]);

    const currentGroupRankings = groupedStandings[selectedGroup] || [];

    // Determine advancement cutoff based on stage
    const getAdvancementCutoff = () => {
        if (currentStageDetails.id === 1) return 9; // Top 9 from Qualifiers
        if (currentStageDetails.id === 2) return 3; // Top 3 from Playoff
        return 0; // No cutoff for final stage
    };
    const advancingCutoff = getAdvancementCutoff();
    const isFinalStage = currentStageDetails.id === 3;


    return (
        <AnimatedSection delay={0} className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-primary-500/30 pb-3">
                 <h2 className="text-3xl font-bold text-primary-400 flex items-center mb-4 sm:mb-0">
                    <BarChart size={28} className="mr-3" /> {currentStageDetails.name} Rankings
                </h2>
                {/* Group Selector Buttons */}
                <div className="flex flex-wrap gap-2 bg-dark-700 p-1 rounded-lg">
                    {groupNames.map((groupKey) => (
                        <button
                            key={groupKey}
                            onClick={() => setSelectedGroup(groupKey)}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                                selectedGroup === groupKey
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'text-gray-300 hover:bg-dark-600'
                            }`}
                        >
                            {groupKey}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-gray-300 text-lg">
                Live standings for <span className="font-semibold text-primary-300">{selectedGroup}</span>.
                {!isFinalStage && ` The top ${advancingCutoff} teams from this group will advance.`}
                {currentStageDetails.id === 1 && " An additional 3 Wildcard teams advance."}
            </p>

            <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-dark-700">
                        <thead className="bg-dark-700/70">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Maps</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">P. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-red-400 uppercase tracking-wider">K. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">Total Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-green-400 uppercase tracking-wider">Wins</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {currentGroupRankings.length > 0 ? currentGroupRankings.map((stat, index) => {
                                const isAdvancing = index < advancingCutoff && !isFinalStage;
                                const isWildcard = currentStageDetails.id === 1 && index >= 9 && index < 12; // For Stage 1

                                let statusClass = 'hover:bg-dark-700';
                                if (isAdvancing) statusClass = 'bg-green-900/20 hover:bg-green-900/30 border-l-4 border-green-500';
                                else if (isWildcard) statusClass = 'bg-blue-900/20 hover:bg-blue-900/30 border-l-4 border-blue-500';

                                return (
                                    <tr key={stat.team.id} className={`transition-colors ${statusClass}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white flex items-center">
                                            <img src={stat.team.logo} alt={stat.team.name} className="w-6 h-6 rounded-full mr-2" />
                                            {stat.team.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{stat.mapsPlayed}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-yellow-300">{stat.placementPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-red-300">{stat.killPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-extrabold text-primary-300">{stat.totalPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-green-400">{stat.wins}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">No results recorded for this group yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AnimatedSection>
    );
};
// --- End Updated Rank Component ---


export default function CupPage() {
    const { cupId } = useParams();
    const [cup, setCup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('rundown');

    // --- NEW MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatchResults, setSelectedMatchResults] = useState(null);

    // --- NEW MODAL HANDLERS ---
    const handleViewResults = (match) => {
        setSelectedMatchResults(match);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMatchResults(null);
    };
    // --- END NEW MODAL HANDLERS ---

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Simulate fetching the specific cup
        const numericId = parseInt(cupId, 10);
        // Find the FF tournament (ID 1)
        const data = allTournamentsData.find(t => t.id === 1); 

        setTimeout(() => {
            if (data) {
                setCup(data);
            } else {
                setError("Tournament not found. This demo only supports the Free Fire Cup (ID 1).");
            }
            setLoading(false);
        }, 300); // Simulate network delay
    }, [cupId]);


    const navTabs = [
        { name: 'RUNDOWN', path: 'rundown', icon: Hash },
        { name: 'MATCHES', path: 'matches', icon: ListChecks },
        { name: 'RANK', path: 'rank', icon: BarChart },
    ];

    const renderContent = () => {
        if (!cup) return null;

        const currentStageDetails = cup.stages.find(s => s.id === cup.currentStage);
        const currentStageState = cup.stageData[cup.currentStage];

        switch (activeTab) {
            case 'matches': return <MatchesContent currentStageState={currentStageState} onViewResults={handleViewResults} />;
            case 'rank': return <RankContent currentStageState={currentStageState} currentStageDetails={currentStageDetails} />;
            case 'rundown': default: return <RundownContent cup={cup} currentStageDetails={currentStageDetails} />;
        }
    };

    if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl">Loading Cup Details...</p> </div> );
    }

    if (error) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">Error</h2> <p className="text-gray-400">{error}</p> <Link to="/tournaments" className="mt-6 btn-secondary"> Back to Tournaments </Link> </div> );
    }

    if (!cup) return null; // Should be covered by error state

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

                {/* --- RENDER THE MODAL --- */}
                <MatchResultsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    match={selectedMatchResults}
                />
            </div>
        </div>
    );
}