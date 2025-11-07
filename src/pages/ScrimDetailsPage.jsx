import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Clock, Users, ListChecks, BarChart, Hash, Info, DollarSign, Eye, X, Loader2, AlertCircle, Swords, Shuffle, UserCheck } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient';

// --- SCORING ENGINE (BR - Free Fire Standard) ---
const calculatePlacementPoints = (placement) => {
    // Assuming max 12 teams for simplicity, points decrease by 3 per rank
    if (placement < 1 || placement > 12) return 0;
    return 39 - (3 * (placement - 1));
};
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// --- Helper function to get game-specific banner (reused) ---
const getGameBanner = (tournament) => {
    if (!tournament) return '/images/lan_6.jpg';

    const gameName = tournament.game;
    if (gameName.startsWith('Mobile Legends')) {
        return '/images/ml_ban.jpeg';
    }
    if (gameName === 'Free Fire') {
        return '/images/FF_ban.jpg';
    }
    if (gameName === 'Farlight 84') {
        return '/images/far_ban.jpeg';
    }
    return tournament.image || '/images/lan_6.jpg';
};

// --- Custom Modal (for errors/alerts) (reused) ---
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

// --- Match Results Modal (Re-usable for BR) ---
const MatchResultsModal = ({ isOpen, onClose, match, results, participants }) => {
    if (!isOpen || !match) return null;

    // Filter results for the specific match and calculate points
    const resultsWithPoints = results
        .filter(r => r.match_id === match.id)
        .map(r => {
            const pPoints = calculatePlacementPoints(r.placement);
            const kPoints = calculateKillPoints(r.kills);
            const tPoints = pPoints + kPoints;
            const team = participants.find(p => p.id === r.participant_id);
            return { ...r, pPoints, kPoints, tPoints, teamName: team?.team_name || 'Unknown' };
        }).sort((a, b) => a.placement - b.placement); // Sort by placement

    const isMatchCompleted = match.status === 'Completed';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-lg font-semibold text-white">Match Results: Round {match.match_number}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                    <div className="overflow-x-auto">
                        {resultsWithPoints.length > 0 ? (
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
                        ) : (
                            <div className="text-center py-6 px-4">
                                {isMatchCompleted ? (
                                    <div className="bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 p-4 rounded-lg space-y-2">
                                        <AlertCircle className="w-6 h-6 mx-auto" />
                                        <h4 className="font-semibold text-lg">Results Access Blocked or Missing</h4>
                                        <div className="text-sm">
                                            <span className="block mb-2">
                                                This match is marked **COMPLETED**, but results cannot be retrieved. This often means:
                                            </span>
                                            <ul className="list-disc list-inside text-left mx-auto max-w-xs mt-2 text-yellow-200">
                                                <li>The results were not saved correctly by the organizer.</li>
                                                <li>**The Edge Function failed to execute or return data.**</li>
                                            </ul>
                                            <p className="mt-3 text-xs text-yellow-400">
                                                If you are the organizer, check the Supabase Edge Function logs for `fetch-scrim-results`.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 py-6">Results are not yet final. Check back after the match status is updated to 'Completed'.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    <button onClick={onClose} className="btn-secondary text-sm">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- Re-usable Match Card Component (for BR) (reused) ---
const MatchCard = ({ match, delay = 0, onViewResults }) => (
    <AnimatedSection delay={delay} className={`bg-dark-800 rounded-lg p-4 border border-dark-700 ${match.status === 'Completed' ? 'opacity-80' : 'hover:border-primary-500/50'}`}>
         <div className="flex justify-between items-center mb-2">
             <div className="text-sm font-medium text-primary-400">Round {match.match_number}</div>
             <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600/20 text-green-300' : 'bg-yellow-600/20 text-yellow-300'}`}>
                 {match.status}
             </span>
         </div>
         <h4 className="text-lg font-semibold text-white">
             {match.group_name}
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

// --- ParticipantList component (reused) ---
const ParticipantList = ({ participants, maxParticipants }) => (
    <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-primary-300 mb-4 flex items-center justify-between">
            <span><Users className="mr-2 inline" size={20} /> Registered Teams</span>
            <span className="text-lg font-bold text-white">{participants.length} / {maxParticipants}</span>
        </h3>
        {participants.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                {participants.map(team => (
                    <Link
                        to={`/team/${team.team_id}`}
                        key={team.id}
                        className="flex items-center bg-dark-700 p-3 rounded-lg hover:bg-dark-600 hover:border-primary-500/50 border border-dark-600 transition-all"
                        target="_blank"
                    >
                        <img
                            src={team.team_logo_url || `https://via.placeholder.com/30x30/FFA500/000000?text=${team.team_name.charAt(0)}`}
                            alt={team.team_name}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <span className="text-white font-medium truncate">{team.team_name}</span>
                        {team.is_seeded && (
                            <span className="ml-2 bg-yellow-600 text-yellow-100 text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                Seeded
                            </span>
                        )}
                        <Eye className="w-4 h-4 text-gray-500 ml-auto flex-shrink-0" />
                    </Link>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">No teams have joined this scrim yet.</p>
        )}
    </div>
);

// --- Content Components for Tabs (Rundown, Matches, Rank) ---
const RundownContent = ({ scrim, participants, totalRounds }) => {
    return (
        <AnimatedSection delay={0} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-primary-400"><Info className="mr-2"/> Scrim Details</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Game:</span>
                        <span className="font-semibold text-white">{scrim.game}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 flex items-center"><Users size={14} className="mr-1.5"/> Max Teams:</span>
                        <span className="font-semibold text-white">{scrim.max_participants}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Rounds:</span>
                        <span className="text-primary-400 font-semibold">{totalRounds} Matches</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="font-semibold text-white">{scrim.status}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Start Time:</span>
                        <span className="font-semibold text-white">{new Date(scrim.start_date).toLocaleString()}</span>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-dark-700">
                    <h3 className="font-semibold text-gray-300 mb-2">Rules Summary</h3>
                    <p className="text-xs text-gray-400 whitespace-pre-wrap">{scrim.rules || 'No specific rules provided.'}</p>
                </div>
            </div>
             <div className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center text-green-400"><DollarSign className="mr-2"/> Prizes/Fees</h2>
                 <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                        <span className="text-gray-400">Entry Fee:</span>
                        <span className="font-semibold text-green-400">${scrim.entry_fee || 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Prize Pool:</span>
                        <span className="font-semibold text-yellow-400">{scrim.prize_pool_amount || 0} {scrim.prize_currency || 'Coins'}</span>
                    </div>
                    <p className="text-xs text-gray-500 pt-3 border-t border-dark-700">
                        This is a casual scrim. Prizes are typically minor or zero.
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
};

const MatchesContent = ({ matches, onViewResults }) => {
    const upcoming = matches.filter(m => m.status !== 'Completed').sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
    const completed = matches.filter(m => m.status === 'Completed').sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time));

    return (
        <AnimatedSection delay={0} className="space-y-10">
             <div>
                 <h3 className="text-2xl font-semibold mb-4 text-green-400 flex items-center"><Clock size={20} className="mr-2"/> Upcoming Rounds ({upcoming.length})</h3>
                 {upcoming.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {upcoming.map((match, index) => (
                             <MatchCard key={match.id} match={match} delay={index * 100} onViewResults={onViewResults} />
                         ))}
                     </div>
                 ) : (
                     <p className="text-gray-500 card bg-dark-800 p-4 text-center">No upcoming rounds scheduled.</p>
                 )}
             </div>

             <div>
                 <h3 className="text-2xl font-semibold mb-4 text-gray-400 flex items-center"><Calendar size={20} className="mr-2"/> Completed Rounds ({completed.length})</h3>
                 {completed.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {completed.map((match, index) => (
                             <MatchCard key={match.id} match={match} delay={index * 100} onViewResults={onViewResults} />
                         ))}
                     </div>
                 ) : (
                     <p className="text-gray-500 card bg-dark-800 p-4 text-center">No rounds completed yet.</p>
                 )}
             </div>
        </AnimatedSection>
    );
};

const RankContent = ({ participants, results, scrim, matches }) => {
    // --- Overall Standings Logic for Scrims (Single Stage) ---
    const overallStandings = useMemo(() => {
        const standingsMap = new Map();

        participants.forEach(team => {
            standingsMap.set(team.id, {
                team: team, totalPoints: 0, placementPoints: 0, killPoints: 0, mapsPlayed: 0
            });
        });

        const completedMatchIds = matches.filter(m => m.status === 'Completed').map(m => m.id);

        results
            .filter(result => completedMatchIds.includes(result.match_id))
            .forEach(result => {
                const stats = standingsMap.get(result.participant_id);
                if (stats) {
                    const pPoints = calculatePlacementPoints(result.placement);
                    const kPoints = calculateKillPoints(result.kills);
                    const tPoints = pPoints + kPoints;

                    stats.mapsPlayed += 1;
                    stats.placementPoints += pPoints;
                    stats.killPoints += kPoints;
                    stats.totalPoints += tPoints;
                }
            });

        return Array.from(standingsMap.values())
            .filter(s => s.mapsPlayed > 0) // Only show teams that played at least one map
            .sort((a, b) => b.totalPoints - a.totalPoints || b.killPoints - a.killPoints);
    }, [results, participants, matches]);

    const roundsPlayed = matches.filter(m => m.status === 'Completed').length;
    const totalRounds = scrim.max_rounds || 4;

    return (
        <AnimatedSection delay={0} className="space-y-8">
            <h2 className="text-3xl font-bold text-primary-400 flex items-center border-b-2 border-primary-500/30 pb-3">
                <BarChart size={28} className="mr-3" /> Overall Scrim Standings
            </h2>
            <p className="text-gray-300 text-lg">
                Points accumulated over **{roundsPlayed} of {totalRounds}** rounds.
            </p>

            <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-dark-700">
                        <thead className="bg-dark-700/70">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">Rank</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Maps</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">P. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-red-400 uppercase tracking-wider">K. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">Total Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {overallStandings.length > 0 ? overallStandings.map((stat, index) => {
                                return (
                                    <tr key={stat.team.id} className={`transition-colors hover:bg-dark-700 ${index === 0 ? 'bg-yellow-900/20' : ''}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                                            <Link to={`/team/${stat.team.team_id}`} className="flex items-center hover:text-primary-300 transition-colors">
                                                <img src={stat.team.team_logo_url || `https://via.placeholder.com/30x30/FFA500/000000?text=${stat.team.team_name.charAt(0)}`} alt={stat.team.team_name} className="w-6 h-6 rounded-full mr-2" />
                                                {stat.team.team_name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{stat.mapsPlayed}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-yellow-300">{stat.placementPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-red-300">{stat.killPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-extrabold text-primary-300">{stat.totalPoints}</td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-gray-500">No results recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AnimatedSection>
    );
};


// --- *** (Main Page Component) *** ---
export default function ScrimDetailsPage() {
    const { scrimId } = useParams();
    const navigate = useNavigate();

    // --- Data States ---
    const [tournament, setTournament] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]); // Populated via Edge Function
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

    const [activeTab, setActiveTab] = useState('rundown');

    // --- Data Fetching (Scrim Specific) - NOW USING EDGE FUNCTION FOR RESULTS ---
    useEffect(() => {
        const fetchAllScrimData = async () => {
            if (!scrimId) {
                setError("No scrim ID provided.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // 1. Fetch main tournament record (RLS is usually simpler here)
                const { data: tournamentData, error: tournamentError } = await supabase
                    .from('tournaments')
                    .select('*, max_rounds')
                    .eq('id', scrimId)
                    .eq('type', 'scrim')
                    .single();

                if (tournamentError) throw new Error(`Scrim not found: ${tournamentError.message}`);
                if (!tournamentData) throw new Error("Scrim not found.");

                setTournament(tournamentData);
                setActiveTab('rundown');

                // 2. Fetch all participants and matches in parallel
                const [partRes, matchRes] = await Promise.all([
                    supabase.from('tournament_participants').select('*').eq('tournament_id', scrimId),
                    supabase.from('tournament_matches').select('*').eq('tournament_id', scrimId).order('match_number', { ascending: true })
                ]);

                if (partRes.error) throw new Error(`Failed to fetch participants: ${partRes.error.message}`);
                if (matchRes.error) throw new Error(`Failed to fetch matches: ${matchRes.error.message}`);

                setParticipants(partRes.data || []);
                const matchData = matchRes.data || [];
                setMatches(matchData);

                // 3. 🚨 NEW: Fetch results via Edge Function (Bypassing RLS)
                // This ensures results are visible even if RLS is strict on public read.
                const { data: resultsFnData, error: resultsFnError } = await supabase.functions.invoke(
                    'fetch-scrim-results', // MUST match deployed function name
                    { 
                        method: 'POST', 
                        body: { scrimId } // Pass the scrim ID
                    }
                );

                if (resultsFnError) {
                    // Log the function error but try to proceed gracefully
                    console.error("Supabase Function Invocation Error:", resultsFnError);
                    // The error message here is simplified since the RLS logic is complex.
                    setError("Failed to fetch results securely. Check server logs.");
                    setResults([]);
                } else {
                    // Assuming Edge Function returns { data: [...] }
                    setResults(resultsFnData?.data || []);
                }


            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllScrimData();
    }, [scrimId]);


    // --- Modal Handlers (Reused) ---
    const handleViewResults = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    // --- Scrim Nav Tabs ---
    const navTabs = useMemo(() => {
        if (!tournament) return [];

        return [
            { name: 'RUNDOWN', path: 'rundown', icon: Hash },
            { name: 'MATCHES', path: 'matches', icon: ListChecks },
            { name: 'STANDINGS', path: 'rank', icon: BarChart },
        ];
    }, [tournament]);

    // --- Dynamic Content Renderer (Scrim Logic) ---
    const renderContent = () => {
        if (!tournament) return null;

        switch (activeTab) {
            case 'matches':
                return <MatchesContent matches={matches} onViewResults={handleViewResults} />;
            case 'rank':
                return <RankContent scrim={tournament} participants={participants} results={results} matches={matches} />;
            case 'rundown':
            default:
                return <RundownContent
                            scrim={tournament}
                            participants={participants}
                            totalRounds={tournament.max_rounds || 4}
                       />;
        }
    };

    if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="w-16 h-16 text-primary-500 animate-spin" /><p className="ml-4 text-xl">Loading Scrim Details...</p></div> );
    }

    if (error && !tournament) { // Only show fatal error if no tournament data could be loaded
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4 pt-16"><AlertCircle className="w-16 h-16 text-red-500 mb-4" /><h2 className="text-2xl font-semibold text-red-400 mb-2">Error</h2><p className="text-gray-400">{error}</p><Link to="/tournaments" className="mt-6 btn-secondary"> Back to Tournaments </Link></div> );
    }

    if (!tournament) return null;

    const bannerUrl = getGameBanner(tournament);

    return (
        <div className="bg-dark-900 text-white min-h-screen">
             <div className="max-w-full mx-auto space-y-10 pb-10">
                {/* Header / Banner */}
                   <AnimatedSection delay={0} className="relative h-64 sm:h-72 w-full overflow-hidden shadow-xl">
                       <img src={bannerUrl} alt={`${tournament.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-80"/>
                       <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                       <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                           <div className="flex items-center mb-4"><Users className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-green-400 bg-dark-800/50 p-2 rounded-lg border border-green-500/30" /><h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-md">{tournament.name}</h1></div>
                           <p className="text-lg sm:text-xl text-gray-300">SCRIM - {tournament.game} ({tournament.max_rounds || 4} Rounds)</p>
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

                {/* --- Content Area --- */}
                <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="lg:col-span-2 space-y-6">
                             {renderContent()}
                         </div>
                         <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-36 self-start">
                             <ParticipantList participants={participants} maxParticipants={tournament.max_participants} />
                         </div>
                     </div>
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