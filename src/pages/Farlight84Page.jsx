// src/pages/Farlight84Page.jsx

import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight, PlusCircle, Calendar, Gamepad2, Hash, Clock, BarChart, ListChecks, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---
import { useAuth } from '../contexts/AuthContext.jsx'; // --- IMPORT AUTH ---

// --- Game-specific config ---
const GAME_NAME = "Farlight 84";
const GAME_BANNER_URL = "/images/lan_1.jpg"; // Using a generic action banner
const GAME_CUP_THUMBNAIL = "/images/far_ban.jpeg"; // <-- YOUR REQUESTED IMAGE
// ---

// --- Enhanced Cup List Item (Uses Supabase data) ---
const CupListItem = ({ cup, isPast = false }) => {
    // Format the prize
    const prize = cup.prize_type === 'Cash (USD)'
        ? `$${cup.prize_pool_amount.toLocaleString()}`
        : `${cup.prize_pool_amount.toLocaleString()} ${cup.prize_currency || 'Coins'}`;

    // Format the date
    const date = cup.start_date ? new Date(cup.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD';

    return (
        <Link
            to={`/tournament/${cup.id}`} // This is the correct link
            className="block relative group overflow-hidden rounded-xl shadow-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
        >
            {/* --- *** UPDATED THIS IMAGE SRC *** --- */}
            <img
                src={GAME_CUP_THUMBNAIL} // Use the constant Farlight 84 banner
                alt="Farlight 84 Cup Background"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isPast ? 'opacity-20 group-hover:opacity-30' : 'opacity-30 group-hover:opacity-40'}`}
            />
            {/* --- *** END UPDATE *** --- */}

            <div className="relative z-10 p-5 bg-gradient-to-r from-dark-800/90 via-dark-800/80 to-transparent flex items-center justify-between">
                <div className="flex-grow pr-4">
                    <h4 className={`text-lg font-bold mb-1 transition-colors ${isPast ? 'text-gray-400 group-hover:text-gray-300' : 'text-white group-hover:text-primary-300'}`}>
                        {cup.name} {/* Use name from DB */}
                    </h4>
                    <p className="text-sm text-gray-400 capitalize">{cup.format.replace(/-/g, ' ')} &bull; {cup.max_participants} Entries</p>
                    {isPast && cup.winner && <p className="text-xs text-yellow-500 mt-1">Winner: {cup.winner}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                    <p className={`text-2xl font-extrabold leading-none mb-1 ${isPast ? 'text-yellow-600' :'text-yellow-400'}`}>{prize}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{date}</p>
                </div>
            </div>
            <div className="absolute top-4 right-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight size={20} />
            </div>
        </Link>
    );
};


// --- Content Components ---

const CupsContent = ({ cups, loading, error, isPast = false }) => (
    <AnimatedSection delay={0} className="space-y-6">
        {loading && (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )}
        {error && (
            <div className="flex flex-col items-center justify-center h-40 bg-dark-800 p-4 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-400">Failed to load {isPast ? 'past' : 'upcoming'} cups.</p>
                <p className="text-xs text-gray-500">{error}</p>
            </div>
        )}
        {!loading && !error && (
            <>
                {cups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cups.map((cup, index) => (
                            <AnimatedSection key={cup.id} delay={100 + index * 100}>
                                <CupListItem cup={cup} isPast={isPast} />
                            </AnimatedSection>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 md:col-span-2 text-center py-10">
                        No {isPast ? 'past' : 'upcoming'} cups found.
                    </p>
                )}
            </>
        )}
    </AnimatedSection>
);

const LeaderboardContent = ({ leaderboard, loading, error }) => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center">
            <BarChart size={28} className="mr-3" /> Team Leaderboard
        </h2>
        <p className="text-gray-300 text-lg">
            Top {GAME_NAME} teams competing on Africa Rise Esports, ranked by win rate.
        </p>

        <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
            {/* --- LEADERBOARD COLUMNS --- */}
            <div className="hidden sm:flex justify-between items-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-dark-700">
                <span className="w-1/12 text-center">Rank</span> 
                <span className="w-5/12 pl-4">Team</span> 
                <span className="w-2/12 text-center">Wins</span> 
                <span className="w-2/12 text-center">Matches</span> 
                <span className="w-2/12 text-right pr-4">Win Rate</span>
            </div>
            <div className="space-y-3">
                {loading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center py-10">
                        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                        <p className="text-red-400">Failed to load leaderboard.</p>
                        <p className="text-xs text-gray-500">{error}</p>
                    </div>
                )}
                {!loading && !error && leaderboard.length > 0 && (
                    leaderboard.map((item, index) => {
                        const team = item.team;
                        if (!team) return null; 
                        return (
                            <AnimatedSection key={team.id || index} delay={100 + index * 50} className={`flex flex-wrap sm:flex-nowrap items-center p-3 rounded-lg transition-all duration-300 border-l-4 ${ index === 0 ? 'bg-yellow-500/10 border-yellow-400 hover:bg-yellow-500/20' : index === 1 ? 'bg-gray-500/10 border-gray-400 hover:bg-gray-500/20' : index === 2 ? 'bg-amber-600/10 border-amber-500 hover:bg-amber-600/20' : 'bg-dark-700 hover:bg-dark-600 border-transparent hover:border-primary-500/50' }`} >
                                <div className="flex items-center space-x-3 w-full sm:w-6/12 pb-2 sm:pb-0">
                                    <span className={`text-center font-extrabold text-xl w-8 flex-shrink-0 ${index < 3 ? 'text-white' : 'text-gray-400'}`}>{index + 1}</span>
                                    <img src={team.logo_url || '/images/team_placeholder.png'} alt={team.name} className="w-10 h-10 rounded-full object-cover border-2 border-dark-600 flex-shrink-0" />
                                    <div className="flex-grow">
                                        <p className={`font-semibold text-base leading-tight ${index < 3 ? 'text-white' : 'text-gray-200'}`}>{team.name}</p>
                                        <Link to={`/team/${team.id}`} className="text-xs text-primary-400 hover:text-primary-300">View Team</Link>
                                    </div>
                                </div>
                                {/* --- STATS --- */}
                                <div className="flex justify-between sm:justify-end space-x-4 sm:space-x-0 w-full sm:w-6/12 text-sm pl-12 sm:pl-0">
                                    <div className="w-auto sm:w-1/3 text-left sm:text-center text-gray-300 font-bold">{item.totalWins}</div>
                                    <div className="w-auto sm:w-1/3 text-left sm:text-center text-gray-400">{item.totalMatches}</div>
                                    <span className={`w-auto sm:w-1/3 text-right font-bold text-base sm:text-lg ${index < 3 ? 'text-white' : 'text-primary-400'}`}>{item.winRate.toFixed(0)}%</span>
                                </div>
                            </AnimatedSection>
                        )
                    })
                )}
                {!loading && !error && leaderboard.length === 0 && (
                     <p className="text-center text-sm text-gray-500 py-10">No ranked teams found for {GAME_NAME}.</p>
                )}
            </div>
        </div>
    </AnimatedSection>
);

const TeamsContent = ({ teams, loading, error }) => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center"><Users size={28} className="mr-3" /> Team Directory</h2>
        <p className="text-gray-300 text-lg">Find registered {GAME_NAME} teams or create your own squad.</p>
        <AnimatedSection delay={100} className="bg-gradient-to-r from-green-600/30 to-dark-800/50 p-6 rounded-xl border border-green-500/50 shadow-lg flex items-center justify-between">
            <div><h3 className="text-2xl font-bold text-white mb-2">Ready to Build Your Legacy?</h3><p className="text-green-200">Assemble your squad and register for upcoming competitions.</p></div>
            <Link to="/my-teams" className="btn-primary bg-green-600 hover:bg-green-700 flex items-center flex-shrink-0"><PlusCircle size={18} className="mr-2"/> Create Team</Link>
        </AnimatedSection>
        <AnimatedSection delay={200} className="space-y-6 pt-6">
            <h3 className="text-2xl font-semibold text-white">Registered Teams ({teams.length})</h3>
            <div className="p-4 bg-dark-700 rounded-lg flex items-center border border-dark-600"><input type="text" placeholder="Search teams..." className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"/></div>

            {loading && (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                </div>
            )}
            {error && (
                <div className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-red-400">Failed to load teams.</p>
                    <p className="text-xs text-gray-500">{error}</p>
                </div>
            )}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {teams.map((team, index) => (
                        <AnimatedSection key={team.id} delay={250 + index * 50} className="flex items-center p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors shadow-lg border border-dark-700 hover:border-primary-500/50">
                            <img src={team.logo_url || '/images/team_placeholder.png'} alt={team.name} className="w-12 h-12 rounded-full object-cover border-2 border-dark-600 mr-4" />
                            <div className="flex-grow">
                                <p className="font-bold text-white text-lg">{team.name}</p>
                                <span className="text-gray-400 text-sm flex items-center capitalize">{team.game}</span>
                            </div>
                            <Link to={`/team/${team.id}`} className="btn-secondary text-sm px-3 py-1.5 transition-transform hover:scale-105"> View </Link>
                        </AnimatedSection>
                    ))}
                </div>
            )}
            {!loading && !error && teams.length === 0 && (
                <p className="text-gray-500 text-center py-10">No {GAME_NAME} teams have been created yet.</p>
            )}
        </AnimatedSection>
    </AnimatedSection>
);

const RundownContent = ({ 
    upcomingCups, loadingCups, cupsError, 
    myTournaments, loadingMyData, myDataError,
    publicRecentMatches, loadingPublicMatches, publicMatchesError,
    userIsLoggedIn
}) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
            {/* Left Column */}
            <div className="lg:w-2/3 space-y-10">
                <AnimatedSection delay={100} className="relative group overflow-hidden bg-gradient-to-br from-blue-700 via-cyan-800 to-blue-900 p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-blue-500/50">
                     <div className="absolute inset-0 bg-[url('/images/lan_6.jpg')] bg-repeat opacity-[0.03] mix-blend-overlay"></div>
                     <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between"><h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">GALAXY SHOWDOWN</h2><p className="text-blue-200 text-base sm:text-lg mb-4 sm:mb-0">Featured Seasonal Championship Event</p><Link to="#" className="btn-primary bg-white text-blue-800 hover:bg-blue-100 font-bold py-3 px-6 rounded-xl flex items-center transition-colors text-base shadow-lg mt-4 sm:mt-0 transform hover:scale-105">GO TO EVENT <ArrowRight size={20} className="ml-2" /></Link></div>
                </AnimatedSection>
                <AnimatedSection delay={200}>
                    <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-primary-400 flex items-center"><Clock size={20} className="mr-2"/> UPCOMING CUPS</h3><Link to="/tournaments" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">View All <ArrowRight size={16} className="ml-1" /></Link></div>
                    {/* --- Rundown Upcoming Cups (NOW DYNAMIC) --- */}
                    {loadingCups && <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>}
                    {cupsError && <p className="text-red-400 text-sm p-4 text-center">{cupsError}</p>}
                    {!loadingCups && !cupsError && (
                        <div className="space-y-4">
                            {upcomingCups.slice(0, 3).map((cup, index) => (<AnimatedSection key={cup.id} delay={250 + index * 50}><CupListItem cup={cup} /></AnimatedSection>))}
                            {upcomingCups.length === 0 && <p className="text-gray-500 text-center py-4">No upcoming cups scheduled.</p>}
                        </div>
                    )}
                </AnimatedSection>
            </div>
            {/* Right Column (My Data) */}
            <div className="lg:w-1/3 space-y-10">
                {userIsLoggedIn && ( // --- Only show this section if logged in ---
                    <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                         <h3 className="text-2xl font-bold text-primary-400 mb-6 flex items-center"><ListChecks size={20} className="mr-2"/> My Tournaments</h3>
                         {loadingMyData && <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>}
                         {myDataError && <p className="text-red-400 text-sm p-4 text-center">{myDataError}</p>}
                         {!loadingMyData && !myDataError && (
                             myTournaments.length > 0 ? (
                                <div className="space-y-4">
                                    {myTournaments.map((tournament, index) => (
                                         <AnimatedSection key={tournament.id} delay={350 + index * 50} className="bg-dark-700/50 rounded-lg p-4 border-l-4 border-primary-500/60">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link to={`/tournament/${tournament.id}`} className="font-semibold text-white hover:text-primary-300 text-base leading-tight">{tournament.name}</Link>
                                                <span className={`text-xs px-2 py-0.5 rounded ${tournament.status === 'Upcoming' ? 'bg-blue-600/70 text-blue-100' : 'bg-gray-600/70 text-gray-200'}`}>{tournament.status}</span>
                                            </div>
                                            <p className="text-sm text-gray-400 mb-2"><Calendar size={12} className="inline mr-1"/> Starts: {new Date(tournament.start_date).toLocaleDateString()}</p>
                                        </AnimatedSection>
                                    ))}
                                </div>
                             ) : (
                                <p className="text-gray-500 text-center py-4">You haven't joined any {GAME_NAME} tournaments yet.</p>
                             )
                         )}
                    </AnimatedSection>
                )}
                
                <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                    {/* --- THIS SECTION IS NOW PUBLIC RECENT RESULTS --- */}
                    <h3 className="text-2xl font-bold text-primary-400 mb-6">RECENT RESULTS</h3>
                     {loadingPublicMatches && <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>}
                     {publicMatchesError && <p className="text-red-400 text-sm p-4 text-center">{publicMatchesError}</p>}
                     {!loadingPublicMatches && !publicMatchesError && (
                        publicRecentMatches.length > 0 ? (
                            <div className="space-y-4">
                                {publicRecentMatches.map((match, idx) => (
                                    <div key={idx} className="border border-dark-700 p-3 rounded-lg bg-dark-900">
                                        <p className="text-xs text-gray-400 mb-1 truncate">{match.tournamentName}</p>
                                        <p className="font-semibold text-white text-sm mb-2">Team: <span className="text-primary-300">{match.teamName}</span></p>
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center">
                                                <span className="font-bold text-white">Placement: <span className={`text-xl ${match.placement === 1 ? 'text-green-400' : 'text-primary-300'}`}>#{match.placement}</span></span>
                                            </div>
                                            <span className="font-bold text-red-400">Kills: <span className="text-xl">{match.kills}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent match results found.</p>
                        )
                     )}
                </AnimatedSection>
            </div>
        </div>
    );
};


// --- Main Page Component ---
export default function Farlight84Page() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('rundown');
    
    // --- Public Data States ---
    const [upcomingCups, setUpcomingCups] = useState([]);
    const [pastCups, setPastCups] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [publicRecentMatches, setPublicRecentMatches] = useState([]); 
    const [loadingCups, setLoadingCups] = useState(true);
    const [cupsError, setCupsError] = useState(null);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [leaderboardError, setLeaderboardError] = useState(null);
    const [loadingPublicMatches, setLoadingPublicMatches] = useState(true); 
    const [publicMatchesError, setPublicMatchesError] = useState(null); 
    const [loadingAllTeams, setLoadingAllTeams] = useState(true);
    const [allTeamsError, setAllTeamsError] = useState(null);
    
    // --- User-Specific Data States ---
    const [myTournaments, setMyTournaments] = useState([]);
    const [loadingMyData, setLoadingMyData] = useState(true);
    const [myDataError, setMyDataError] = useState(null);

    // --- useEffect to fetch all data ---
    useEffect(() => {
        // Fetches public data (Cups, Teams, Leaderboard, Public Matches)
        const fetchPublicData = async () => {
            setLoadingCups(true);
            setLoadingLeaderboard(true);
            setLoadingPublicMatches(true);
            setLoadingAllTeams(true);
            
            // --- 1. Fetch Cups ---
            try {
                const { data: cupData, error: cupError } = await supabase
                    .from('tournaments')
                    .select('id, name, format, max_participants, start_date, prize_pool_amount, prize_type, prize_currency, status, image')
                    .eq('game', GAME_NAME)
                    .eq('is_public', true)
                    .order('start_date', { ascending: false }); // Get most recent first

                if (cupError) throw new Error(`Cup Error: ${cupError.message}`);

                // --- FIX: Upcoming cups are any not 'Completed' ---
                const past = cupData.filter(t => t.status === 'Completed');
                const upcoming = cupData
                    .filter(t => t.status !== 'Completed')
                    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // Sort ascending
                
                setUpcomingCups(upcoming);
                setPastCups(past);
                // --- END FIX ---
                
                setCupsError(null);
            } catch (cupError) {
                console.error("Error fetching tournaments:", cupError);
                setCupsError(cupError.message);
            } finally {
                setLoadingCups(false);
            }

            // --- 2. Fetch All Teams (for Teams Tab) ---
            try {
                const { data: teamsData, error: teamsError } = await supabase
                    .from('teams')
                    .select('id, name, game, logo_url')
                    .eq('game', GAME_NAME);
                
                if (teamsError) throw teamsError;
                setAllTeams(teamsData || []);
                setAllTeamsError(null);
            } catch (err) {
                console.error("Error fetching all teams:", err);
                setAllTeamsError(err.message);
            } finally {
                setLoadingAllTeams(false);
            }

            // --- 3. Fetch Leaderboard & Public Matches ---
            try {
                // 3a. Get all participants
                const { data: participants, error: pError } = await supabase
                    .from('tournament_participants')
                    .select('id, team_id, team_name, team_logo_url, tournaments!inner(game)')
                    .eq('tournaments.game', GAME_NAME);
                
                if (pError) throw pError;
                
                // 3b. Get unique teams *that have participated*
                const uniqueParticipantTeams = Array.from(new Map(participants.map(p => [p.team_id, p])).values());

                // 3c. Get all results for these participants
                const participantIds = participants.map(p => p.id);
                let allResults = [];
                if (participantIds.length > 0) {
                    const { data: results, error: rError } = await supabase
                        .from('match_results')
                        .select('participant_id, placement, created_at, kills, id, tournament_participants(team_name, tournaments(name))')
                        .in('participant_id', participantIds)
                        .order('created_at', { ascending: false }); // Order for recent matches
                    if (rError) throw rError;
                    allResults = results || [];
                }
                
                // 3d. Set Public Recent Matches (for Rundown tab)
                const formattedRecentMatches = allResults.slice(0, 5).map(r => ({
                    ...r,
                    teamName: r.tournament_participants?.team_name || 'Unknown',
                    tournamentName: r.tournament_participants?.tournaments?.name || 'Tournament'
                }));
                setPublicRecentMatches(formattedRecentMatches);
                setPublicMatchesError(null);

                // 3e. Calculate Leaderboard
                const statsMap = new Map();
                uniqueParticipantTeams.forEach(team => {
                    // Use participant data for logo/name, as it's from the time of registration
                    if (team && team.team_id) {
                         statsMap.set(team.team_id, { 
                            team: { id: team.team_id, name: team.team_name, logo_url: team.team_logo_url }, 
                            totalMatches: 0, 
                            totalWins: 0 
                        });
                    }
                });

                allResults.forEach(result => {
                    const participant = participants.find(p => p.id === result.participant_id);
                    if (participant && participant.team_id) {
                        const teamStats = statsMap.get(participant.team_id);
                        if (teamStats) {
                            teamStats.totalMatches += 1;
                            if (result.placement === 1) {
                                teamStats.totalWins += 1;
                            }
                        }
                    }
                });

                const calculatedLeaderboard = Array.from(statsMap.values())
                    .map(item => ({
                        ...item,
                        winRate: item.totalMatches > 0 ? (item.totalWins / item.totalMatches) * 100 : 0
                    }))
                    .filter(item => item.totalMatches > 0) // Only rank teams with matches
                    .sort((a, b) => b.winRate - a.winRate || b.totalWins - a.totalWins); // Sort by win rate, then wins
                
                setLeaderboard(calculatedLeaderboard);
                setLeaderboardError(null);

            } catch (teamError) {
                console.error("Error fetching teams/leaderboard:", teamError);
                setLeaderboardError(teamError.message);
                setPublicMatchesError(teamError.message); // If this fails, recent matches also fail
            } finally {
                setLoadingLeaderboard(false);
                setLoadingPublicMatches(false); // Ensure this is set false even on error
            }
        };

        // Fetches user-specific data (My Tournaments)
        const fetchUserData = async (userId) => {
            if (!userId) {
                setLoadingMyData(false);
                return;
            }
            
            setLoadingMyData(true);
            setMyDataError(null);
            try {
                // 1. Get user's team IDs
                const { data: teamsAsMember } = await supabase.from('team_members').select('team_id').eq('user_id', userId);
                const { data: teamsAsOwner } = await supabase.from('teams').select('id').eq('owner_id', userId);
                const memberTeamIds = teamsAsMember ? teamsAsMember.map(t => t.team_id) : [];
                const ownerTeamIds = teamsAsOwner ? teamsAsOwner.map(t => t.id) : [];
                const uniqueTeamIds = [...new Set([...memberTeamIds, ...ownerTeamIds])];

                if (uniqueTeamIds.length === 0) {
                    setLoadingMyData(false);
                    setMyTournaments([]);
                    return; // User has no teams
                }

                // 2. Get participant records for user's teams
                const { data: participantRecords, error: pError } = await supabase
                    .from('tournament_participants')
                    .select('id, tournaments!inner(id, name, game, start_date, status)')
                    .eq('tournaments.game', GAME_NAME)
                    .in('team_id', uniqueTeamIds);
                
                if (pError) throw pError;
                if (!participantRecords || participantRecords.length === 0) {
                    setLoadingMyData(false);
                    setMyTournaments([]);
                    return; // User has not participated in tourneys
                }

                // 3. Set "My Tournaments"
                const uniqueTournaments = Array.from(new Map(participantRecords.map(p => [p.tournaments.id, p.tournaments])).values())
                    .map(t => ({...t, status: new Date(t.start_date) > new Date() && t.status !== 'Completed' ? 'Upcoming' : t.status }))
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                setMyTournaments(uniqueTournaments);

            } catch (err) {
                console.error("Error fetching user data:", err);
                setMyDataError(err.message);
            } finally {
                setLoadingMyData(false);
            }
        };

        fetchPublicData();
        fetchUserData(user?.id);
    }, [user]);

    const navTabs = [ { name: 'RUNDOWN', path: 'rundown', icon: Hash }, { name: 'CUPS', path: 'cups', icon: Trophy }, { name: 'LEADERBOARD', path: 'leaderboard', icon: BarChart }, { name: 'TEAMS', path: 'teams', icon: Users }, ];

    const renderContent = () => {
        switch (activeTab) {
            case 'cups': 
                return (
                    <div className="space-y-10 px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center">
                            <Trophy size={28} className="mr-3" /> Cups & Tournaments
                        </h2>
                        <div className="space-y-6">
                            <h3 className="text-2xl font-semibold text-white flex items-center"><Clock size={20} className="mr-3 text-green-400" /> Upcoming Cups</h3>
                            <CupsContent cups={upcomingCups} loading={loadingCups} error={cupsError} isPast={false} />
                        </div>
                        <div className="space-y-6 pt-8 border-t border-dark-700">
                            <h3 className="text-2xl font-semibold text-white flex items-center"><Calendar size={20} className="mr-3 text-yellow-400" /> Past Events Archive</h3>
                            <CupsContent cups={pastCups} loading={loadingCups} error={cupsError} isPast={true} />
                        </div>
                    </div>
                );
            case 'leaderboard': 
                return <LeaderboardContent leaderboard={leaderboard} loading={loadingLeaderboard} error={leaderboardError} />;
            case 'teams': 
                return <TeamsContent teams={allTeams} loading={loadingAllTeams} error={allTeamsError} />;
            case 'rundown': 
            default: return (
                <RundownContent
                    upcomingCups={upcomingCups}
                    loadingCups={loadingCups}
                    cupsError={cupsError}
                    myTournaments={myTournaments}
                    loadingMyData={loadingMyData}
                    myDataError={myDataError}
                    publicRecentMatches={publicRecentMatches}
                    loadingPublicMatches={loadingPublicMatches}
                    publicMatchesError={publicMatchesError}
                    userIsLoggedIn={!!user}
                />
            );
        }
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-full mx-auto space-y-10 pb-10">
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl">
                    <img src={GAME_BANNER_URL} alt="Farlight 84 Banner" className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" /><h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">FARLIGHT 84 HUB</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">Your central command for all {GAME_NAME} tournaments, leaderboards, and team activities on Africa Rise Esports.</p>
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