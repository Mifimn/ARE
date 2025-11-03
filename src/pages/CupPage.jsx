// src/pages/CupPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Clock, Users, Crown, ListChecks, BarChart, Hash, Info, DollarSign, TrendingUp, CheckCircle, Loader2, AlertCircle, Eye, X, Swords, Shuffle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---

// --- SCORING ENGINE (BR - Free Fire Standard) ---
const calculatePlacementPoints = (placement) => {
    if (placement < 1 || placement > 12) return 0;
    return 39 - (3 * (placement - 1)); 
};
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// --- *** NEW: Helper function to get game-specific banner *** ---
const getGameBanner = (tournament) => {
    if (!tournament) return '/images/lan_6.jpg'; // Default
    
    const gameName = tournament.game;
    if (gameName === 'Free Fire') {
        return '/images/FF_ban.jpg';
    }
    if (gameName === 'Mobile Legends') {
        return '/images/ml_ban.jpeg';
    }
    if (gameName === 'Farlight 84') {
        return '/images/far_ban.jpeg';
    }
    // Default banner if no match or if `tournament.image` is null
    return tournament.image || '/images/lan_6.jpg'; 
};
// --- *** END NEW FUNCTION *** ---


// --- Custom Modal (for errors) ---
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    const Icon = (title && title.toLowerCase().includes('error')) ? AlertCircle : Info;
    const iconColor = (title && title.toLowerCase().includes('error')) ? 'text-red-400' : 'text-primary-400';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-md border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${iconColor}`} /> <h3 className="text-lg font-semibold text-white">{title}</h3> </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors"> <X size={20} /> </button>
                </div>
                <div className="p-6"><div className="text-gray-300 text-sm">{children}</div></div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    <button onClick={onClose} className="btn-primary text-sm">OK</button>
                </div>
            </div>
        </div>
    );
};

// --- Match Results Modal (Re-usable) ---
const MatchResultsModal = ({ isOpen, onClose, match, results, participants }) => {
    if (!isOpen || !match) return null;

    const resultsWithPoints = results
        .filter(r => r.match_id === match.id)
        .map(r => {
            const pPoints = calculatePlacementPoints(r.placement);
            const kPoints = calculateKillPoints(r.kills);
            const tPoints = pPoints + kPoints;
            const team = participants.find(p => p.id === r.participant_id);
            return { ...r, pPoints, kPoints, tPoints, teamName: team?.team_name || 'Unknown' };
        }).sort((a, b) => a.placement - b.placement); // Sort by placement

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-lg font-semibold text-white">Match Results: {match.group_name} - Match {match.match_number}</h3>
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
                                    <tr key={r.id} className="hover:bg-dark-700/50 transition-colors">
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

// --- Re-usable Match Card Component ---
const MatchCard = ({ match, delay = 0, onViewResults }) => (
    <AnimatedSection delay={delay} className={`bg-dark-800 rounded-lg p-4 border border-dark-700 ${match.status === 'Completed' ? 'opacity-80' : 'hover:border-primary-500/50'}`}>
         <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-primary-400">{match.group_name} - Match {match.match_number}</div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'}`}>
                {match.status}
            </span>
         </div>
         <h4 className="text-lg font-semibold text-white">
            {match.stage_name}
         </h4>
         <p className="text-xs text-gray-400 mb-2">ID: {match.id.slice(0,8)}...</p>
         <div className="text-sm text-gray-300 flex items-center mb-3">
            <Clock size={14} className="mr-1.5"/>
            {new Date(match.scheduled_time).toLocaleString()}
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

// --- UPDATED RUNDOWN CONTENT ---
const RundownContent = ({ tournament, currentStageDetails, participants }) => {
    const prize = tournament.prize_type === 'Cash (USD)'
        ? `$${tournament.prize_pool_amount.toLocaleString()}`
        : `${tournament.prize_pool_amount.toLocaleString()} ${tournament.prize_currency || 'Coins'}`;

    return (
        <AnimatedSection delay={0} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2"/> Prize Distribution</h2>
                <div className="text-center mb-4"><div className="text-3xl font-extrabold text-yellow-300">{prize}</div><div className="text-gray-400 text-sm">{tournament.prize_type === 'Cash (USD)' ? 'Total Cash Prize' : 'In-Game Currency'}</div></div>
                {/* Prize distribution placeholder */}
            </div>
             <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Info className="mr-2 text-primary-400"/> Key Info</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span className="font-semibold text-white capitalize">{tournament.format.replace(/-/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Users size={14} className="mr-1.5"/> Max Participants:</span>
                        <span className="font-semibold text-white">{tournament.max_participants} Teams</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Current Stage:</span>
                        <span className="text-primary-400 font-semibold">{currentStageDetails.name}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="font-semibold text-white">{new Date(tournament.start_date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* --- UPDATED PARTICIPANTS CARD --- */}
            <div className="md:col-span-2 card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-primary-400">
                    <Users className="mr-2"/> 
                    Registered Teams ({participants.length} / {tournament.max_participants})
                </h2>
                {participants.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {participants.map(team => (
                            <Link 
                                to={`/team/${team.team_id}`} // --- LINK TO TEAM PAGE ---
                                key={team.id} 
                                className="flex items-center bg-dark-700/50 p-2 rounded-lg hover:bg-dark-700 transition-colors"
                            >
                                <img 
                                    src={team.team_logo_url || `https://via.placeholder.com/30x30/FFA500/000000?text=${team.team_name.charAt(0)}`} 
                                    alt={team.team_name}
                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                />
                                <span className="text-white font-medium truncate">{team.team_name}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No teams have joined this tournament yet.</p>
                )}
            </div>
        </AnimatedSection>
    );
};
// --- END UPDATED RUNDOWN CONTENT ---

const MatchesContent = ({ matches, onViewResults }) => {
    const upcoming = matches.filter(m => m.status !== 'Completed').sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
    const completed = matches.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time));

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

// --- UPDATED RANK CONTENT ---
const RankContent = ({ participants, results, currentStageDetails }) => {

    // --- Live Grouped Standings Logic ---
    const groupedStandings = useMemo(() => {
        const standings = {};
        const allTeamsInStage = participants.filter(p => p.current_group); // Only teams that are grouped

        allTeamsInStage.forEach(team => {
            const groupName = team.current_group;
            if (!standings[groupName]) { standings[groupName] = []; }
            standings[groupName].push({
                team: team, mapsPlayed: 0, placementPoints: 0, killPoints: 0, totalPoints: 0, wins: 0,
            });
        });

        results.forEach(result => {
            const teamInfo = allTeamsInStage.find(t => t.id === result.participant_id);
            const groupName = teamInfo?.current_group;
            if (groupName) {
                const teamStatIndex = standings[groupName]?.findIndex(s => s.team.id === result.participant_id);
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

        Object.keys(standings).forEach(groupName => {
            standings[groupName].sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                if (b.killPoints !== a.killPoints) return b.killPoints - a.killPoints;
                return b.wins - a.wins;
            });
        });
        return standings;
    }, [results, participants]);

    const groupNames = useMemo(() => Object.keys(groupedStandings).sort(), [groupedStandings]);
    const [selectedGroup, setSelectedGroup] = useState(groupNames[0] || null);

    useEffect(() => {
        if (!selectedGroup && groupNames.length > 0) {
            setSelectedGroup(groupNames[0]);
        }
    }, [groupNames, selectedGroup]);

    const currentGroupRankings = groupedStandings[selectedGroup] || [];
    const advancingCutoff = currentStageDetails?.advanceRule?.match(/Top (\d+)/)?.[1] || 0;
    const isFinalStage = currentStageDetails.id === 3; // Example

    return (
        <AnimatedSection delay={0} className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-primary-500/30 pb-3">
                 <h2 className="text-3xl font-bold text-primary-400 flex items-center mb-4 sm:mb-0">
                    <BarChart size={28} className="mr-3" /> {currentStageDetails.name} Rankings
                </h2>
                <div className="flex flex-wrap gap-2 bg-dark-700 p-1 rounded-lg">
                    {groupNames.map((groupKey) => (
                        <button key={groupKey} onClick={() => setSelectedGroup(groupKey)}
                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${ selectedGroup === groupKey ? 'bg-primary-600 text-white shadow' : 'text-gray-300 hover:bg-dark-600' }`}>
                            {groupKey}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-gray-300 text-lg">
                Live standings for <span className="font-semibold text-primary-300">{selectedGroup}</span>.
                {!isFinalStage && ` The top ${advancingCutoff} teams from this group will advance.`}
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
                                let statusClass = 'hover:bg-dark-700';
                                if (isAdvancing) statusClass = 'bg-green-900/20 hover:bg-green-900/30 border-l-4 border-green-500';

                                return (
                                    <tr key={stat.team.id} className={`transition-colors ${statusClass}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                            {/* --- LINK TO TEAM PAGE --- */}
                                            <Link to={`/team/${stat.team.team_id}`} className="flex items-center hover:text-primary-300 transition-colors">
                                                <img src={stat.team.team_logo_url || `https://via.placeholder.com/30x30/FFA500/000000?text=${stat.team.team_name.charAt(0)}`} alt={stat.team.team_name} className="w-6 h-6 rounded-full mr-2" />
                                                {stat.team.team_name}
                                            </Link>
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
// --- END UPDATED RANK CONTENT ---


export default function CupPage() {
    const { cupId } = useParams();
    const navigate = useNavigate();

    // --- NEW: Data States ---
    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('rundown');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

    // --- NEW: Data Fetching ---
    useEffect(() => {
        const fetchAllTournamentData = async () => {
            if (!cupId) {
                setError("No tournament ID provided.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 1. Fetch main tournament record
                const { data: tournamentData, error: tournamentError } = await supabase
                    .from('tournaments')
                    .select('*')
                    .eq('id', cupId)
                    .single();

                if (tournamentError) throw new Error(`Tournament not found: ${tournamentError.message}`);
                setTournament(tournamentData);

                // 2. Fetch participants and matches in parallel
                // --- UPDATED to select * to get team_id ---
                const [partRes, matchRes] = await Promise.all([
                    supabase.from('tournament_participants').select('*').eq('tournament_id', cupId),
                    supabase.from('tournament_matches').select('*').eq('tournament_id', cupId).order('scheduled_time', { ascending: true })
                ]);

                if (partRes.error) throw new Error(`Failed to fetch participants: ${partRes.error.message}`);
                if (matchRes.error) throw new Error(`Failed to fetch matches: ${matchRes.error.message}`);

                const partData = partRes.data || [];
                const matchData = matchRes.data || [];
                setParticipants(partData);
                setMatches(matchData);

                // 3. Fetch results based on the matches
                let resultsData = [];
                const matchIds = matchData.map(m => m.id);
                if (matchIds.length > 0) {
                    const { data: resData, error: resError } = await supabase
                        .from('match_results')
                        .select('*')
                        .in('match_id', matchIds);

                    if (resError) throw new Error(`Failed to fetch results: ${resError.message}`);
                    resultsData = resData || [];
                }
                setResults(resultsData);

            } catch (err) {
                console.error(err);
                setError(err.message);
                setAlertModal({ isOpen: true, title: "Error Loading Data", message: err.message });
            } finally {
                setLoading(false);
            }
        };

        fetchAllTournamentData();
    }, [cupId]);


    // --- Modal Handlers ---
    const handleViewResults = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    // --- Dynamic Nav Tabs ---
    const navTabs = useMemo(() => {
        if (!tournament) return [];

        const tabs = [{ name: 'RUNDOWN', path: 'rundown', icon: Hash }];

        if (tournament.format === 'grouped-multi-stage-br' || tournament.format === 'multi-stage-br') {
            tabs.push({ name: 'MATCHES', path: 'matches', icon: ListChecks });
            tabs.push({ name: 'RANK', path: 'rank', icon: BarChart });
        }

        if (tournament.format === 'round-robin-to-bracket') {
            tabs.push({ name: 'MATCHES', path: 'matches', icon: ListChecks });
            tabs.push({ name: 'RANK', path: 'rank', icon: BarChart });
            tabs.push({ name: 'BRACKET', path: 'bracket', icon: Shuffle });
        }

        return tabs;
    }, [tournament]);

    const renderContent = () => {
        if (!tournament) return null; // Handled by loading/error

        const currentStageDetails = tournament.stages.find(s => s.id === tournament.current_stage);
        const matchesForStage = matches.filter(m => m.stage_id === tournament.current_stage);

        switch (activeTab) {
            case 'matches': 
                return <MatchesContent matches={matchesForStage} onViewResults={handleViewResults} />;
            case 'rank': 
                if (tournament.format === 'grouped-multi-stage-br' || tournament.format === 'multi-stage-br') {
                    return <RankContent participants={participants} results={results} currentStageDetails={currentStageDetails} />;
                }
                return <AnimatedSection><h2 className="text-2xl font-bold text-white">Ranking for this format coming soon...</h2></AnimatedSection>;
            case 'bracket':
                return <AnimatedSection><h2 className="text-2xl font-bold text-white">Bracket view coming soon...</h2></AnimatedSection>;
            case 'rundown': 
            default: 
                return <RundownContent 
                            tournament={tournament} 
                            currentStageDetails={currentStageDetails} 
                            participants={participants}
                       />;
        }
    };

    if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="w-16 h-16 text-primary-500 animate-spin" /><p className="ml-4 text-xl">Loading Cup Details...</p></div> );
    }

    if (error) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"><AlertCircle className="w-16 h-16 text-red-500 mb-4" /><h2 className="text-2xl font-semibold text-red-400 mb-2">Error</h2><p className="text-gray-400">{error}</p><Link to="/tournaments" className="mt-6 btn-secondary"> Back to Tournaments </Link></div> );
    }

    if (!tournament) return null; // Should be covered by error state

    // --- *** NEW: Get banner URL *** ---
    const bannerUrl = getGameBanner(tournament);
    // ---

    // --- Format Prize ---
    const prize = tournament.prize_type === 'Cash (USD)'
        ? `$${tournament.prize_pool_amount.toLocaleString()}`
        : `${tournament.prize_pool_amount.toLocaleString()} ${tournament.prize_currency || 'Coins'}`;

    return (
        <div className="bg-dark-900 text-white min-h-screen">
             <div className="max-w-full mx-auto space-y-10 pb-10">
                {/* Header / Banner */}
                 <AnimatedSection delay={0} className="relative h-64 sm:h-72 w-full overflow-hidden shadow-xl">
                    {/* --- *** UPDATED SRC *** --- */}
                    <img src={bannerUrl} alt={`${tournament.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Trophy className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" /><h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{tournament.name}</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300">{tournament.game} - {tournament.status}</p>
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

                {/* --- Modals --- */}
                <CustomModal
                    isOpen={alertModal.isOpen}
                    onClose={() => setAlertModal({ isOpen: false })}
                    title={alertModal.title}
                >
                    {alertModal.message}
                </CustomModal>

                <MatchResultsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    match={selectedMatch}
                    results={results}
                    participants={participants}
                />
            </div>
        </div>
    );
} 