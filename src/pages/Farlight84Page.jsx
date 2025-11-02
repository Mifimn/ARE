// src/pages/Farlight84Page.jsx

import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight, PlusCircle, Calendar, Gamepad2, Hash, Clock, BarChart, ListChecks, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---

// --- (Original) Placeholder Data for User's Joined Tournaments ---
const myJoinedTournaments = [
    { id: 1, title: 'Farlight 84 Weekly League', date: '25 Nov', status: 'Upcoming', nextMatch: 'Week 1 - Match 1 - 18:00' },
];
// --------------------------------------------------------

// --- Enhanced Cup List Item (Uses Supabase data) ---
const CupListItem = ({ cup, isPast = false }) => {
    // Format the prize
    const prize = cup.prize_type === 'Cash (USD)'
        ? `$${cup.prize_pool_amount.toLocaleString()}`
        : `${cup.prize_pool_amount.toLocaleString()} ${cup.prize_currency || 'Coins'}`;

    // Format the date
    const date = cup.start_date ? new Date(cup.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBD';

    // Format the name
    let formatText = cup.format.replace(/-/g, ' ');
    if (cup.format === 'multi-stage-br') formatText = 'BR League';

    return (
        <Link
            to={`/tournament/${cup.id}`} // Correct link
            className="block relative group overflow-hidden rounded-xl shadow-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
        >
            <img
                src={cup.image || '/images/lan_9.jpg'} // Fallback image for FL84
                alt="Cup Background"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isPast ? 'opacity-20 group-hover:opacity-30' : 'opacity-30 group-hover:opacity-40'}`}
            />
            <div className="relative z-10 p-5 bg-gradient-to-r from-dark-800/90 via-dark-800/80 to-transparent flex items-center justify-between">
                <div className="flex-grow pr-4">
                    <h4 className={`text-lg font-bold mb-1 transition-colors ${isPast ? 'text-gray-400 group-hover:text-gray-300' : 'text-white group-hover:text-primary-300'}`}>
                        {cup.name}
                    </h4>
                    <p className="text-sm text-gray-400 capitalize">{formatText} &bull; {cup.max_participants} Entries</p>
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


// --- Content Components (Updated with Supabase data) ---

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
                        No {isPast ? 'past' : 'upcoming'} Farlight 84 cups found.
                    </p>
                )}
            </>
        )}
    </AnimatedSection>
);

const LeaderboardContent = ({ teams, loading, error }) => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center">
            <BarChart size={28} className="mr-3" /> Team Leaderboard
        </h2>
        <p className="text-gray-300 text-lg">
            Top teams in Farlight 84. Rankings based on official ARE tournament points.
             <br/>
            <span className="text-sm text-gray-500">(Note: Points/Members columns are placeholders until stats tracking is implemented)</span>
        </p>

        <div className="bg-dark-800 p-4 sm:p-6 rounded-xl shadow-inner border border-dark-700">
            <div className="hidden sm:flex justify-between items-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 pb-3 border-b border-dark-700">
                <span className="w-1/12 text-center">Rank</span> 
                <span className="w-5/12 pl-4">Team</span> 
                <span className="w-3/12 text-center">Members</span> 
                <span className="w-3/12 text-right pr-4">Points</span>
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
                {!loading && !error && teams.length > 0 && (
                    teams.map((team, index) => (
                        <AnimatedSection key={index} delay={100 + index * 50} className={`flex flex-wrap sm:flex-nowrap items-center p-3 rounded-lg transition-all duration-300 border-l-4 ${ index === 0 ? 'bg-yellow-500/10 border-yellow-400 hover:bg-yellow-500/20' : index === 1 ? 'bg-gray-500/10 border-gray-400 hover:bg-gray-500/20' : index === 2 ? 'bg-amber-600/10 border-amber-500 hover:bg-amber-600/20' : 'bg-dark-700 hover:bg-dark-600 border-transparent hover:border-primary-500/50' }`} >
                            <div className="flex items-center space-x-3 w-full sm:w-6/12 pb-2 sm:pb-0">
                                <span className={`text-center font-extrabold text-xl w-8 flex-shrink-0 ${index < 3 ? 'text-white' : 'text-gray-400'}`}>{index + 1}</span>
                                <img src={team.team_logo_url || '/images/team_placeholder.png'} alt={team.team_name} className="w-10 h-10 rounded-full object-cover border-2 border-dark-600 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className={`font-semibold text-base leading-tight ${index < 3 ? 'text-white' : 'text-gray-200'}`}>{team.team_name}</p>
                                    <Link to={`/team/${team.team_id}`} className="text-xs text-primary-400 hover:text-primary-300">View Team</Link>
                                </div>
                            </div>
                            <div className="flex justify-between sm:justify-end space-x-4 sm:space-x-0 w-full sm:w-6/12 text-sm pl-12 sm:pl-0">
                                <div className="w-auto sm:w-3/12 text-left sm:text-center text-gray-400 flex items-center justify-start sm:justify-center"><Users size={16} className="mr-1 sm:mr-2" /> <span>N/A</span></div>
                                <span className={`w-auto sm:w-3/12 text-right font-bold text-base sm:text-lg ${index < 3 ? 'text-white' : 'text-yellow-400'}`}>N/A</span>
                            </div>
                        </AnimatedSection>
                    ))
                )}
                {!loading && !error && teams.length === 0 && (
                     <p className="text-center text-sm text-gray-500 py-10">No teams found for Farlight 84.</p>
                )}
            </div>
        </div>
    </AnimatedSection>
);

const TeamsContent = ({ teams, loading, error }) => (
    <AnimatedSection delay={0} className="space-y-8">
        <h2 className="text-3xl font-bold text-primary-400 border-b-2 border-primary-500/30 pb-3 flex items-center"><Users size={28} className="mr-3" /> Team Directory</h2>
        <p className="text-gray-300 text-lg">Find registered Farlight 84 teams or create your own squad.</p>
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
                        <AnimatedSection key={index} delay={250 + index * 50} className="flex items-center p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors shadow-lg border border-dark-700 hover:border-primary-500/50">
                            <img src={team.team_logo_url || '/images/team_placeholder.png'} alt={team.team_name} className="w-12 h-12 rounded-full object-cover border-2 border-dark-600 mr-4" />
                            <div className="flex-grow">
                                <p className="font-bold text-white text-lg">{team.team_name}</p>
                                <span className="text-gray-400 text-sm flex items-center"><Users size={14} className="mr-1"/> N/A Members</span>
                            </div>
                            <Link to={`/team/${team.team_id}`} className="btn-secondary text-sm px-3 py-1.5 transition-transform hover:scale-105"> View </Link>
                        </AnimatedSection>
                    ))}
                </div>
            )}
        </AnimatedSection>
    </AnimatedSection>
);

// --- Main Page Component ---
export default function Farlight84Page() {
    const [activeTab, setActiveTab] = useState('rundown');

    // --- NEW: Data states ---
    const [upcomingCups, setUpcomingCups] = useState([]);
    const [pastCups, setPastCups] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [loadingCups, setLoadingCups] = useState(true);
    const [cupsError, setCupsError] = useState(null);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [teamsError, setTeamsError] = useState(null);

    // --- NEW: useEffect to fetch all data ---
    useEffect(() => {
        const fetchAllData = async () => {
            // --- Fetch Cups ---
            setLoadingCups(true);
            const { data: cupData, error: cupError } = await supabase
                .from('tournaments')
                .select('id, name, format, max_participants, start_date, prize_pool_amount, prize_type, prize_currency, status')
                .eq('game', 'Farlight 84') // --- UPDATED ---
                .eq('is_public', true)
                .order('start_date', { ascending: false });

            if (cupError) {
                console.error("Error fetching Farlight 84 tournaments:", cupError);
                setCupsError(cupError.message);
            } else {
                const now = new Date();
                setUpcomingCups(cupData.filter(t => t.status === 'Draft' || t.status === 'In Progress' || new Date(t.start_date) > now));
                setPastCups(cupData.filter(t => t.status === 'Completed' || new Date(t.start_date) <= now));
            }
            setLoadingCups(false);

            // --- Fetch Teams ---
            setLoadingTeams(true);
            const { data: teamData, error: teamError } = await supabase
                .from('tournament_participants')
                .select('team_id, team_name, team_logo_url, tournaments ( game )') // Fetch team_id
                .eq('tournaments.game', 'Farlight 84'); // --- UPDATED ---

            if (teamError) {
                console.error("Error fetching Farlight 84 teams:", teamError);
                setTeamsError(teamError.message);
            } else {
                const uniqueTeams = Array.from(new Map(teamData.map(t => [t.team_name, t])).values());
                setAllTeams(uniqueTeams);
            }
            setLoadingTeams(false);
        };

        fetchAllData();
    }, []);

    const navTabs = [ { name: 'RUNDOWN', path: 'rundown', icon: Hash }, { name: 'CUPS', path: 'cups', icon: Trophy }, { name: 'LEADERBOARD', path: 'leaderboard', icon: BarChart }, { name: 'TEAMS', path: 'teams', icon: Users }, ];
    const recentMatchesRundown = [ { winner: 'Hero_Gamer', loser: 'FarlightPro', winnerScore: 1, loserScore: 0, winnerLogo: '/images/ava_m_1.png', loserLogo: '/images/ava_f_1.png' }, { teams: ['/images/team_a.png', '/images/team_d.png', '/images/team_c.png', '/images/team_l.png', '/images/team_r.png', '/images/team_s.png'] }, { teams: ['/images/team_w.png', '/images/team_o.png', '/images/team_z.png', '/images/team_x.png', '/images/team_y.png', '/images/team_kk.png'] }, ];

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
                return <LeaderboardContent teams={allTeams.slice(0, 10)} loading={loadingTeams} error={teamsError} />; // Show top 10
            case 'teams': 
                return <TeamsContent teams={allTeams} loading={loadingTeams} error={teamsError} />;
            case 'rundown': 
            default: return (
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">
                    {/* Left Column */}
                    <div className="lg:w-2/3 space-y-10">
                        <AnimatedSection delay={100} className="relative group overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-purple-500/50">
                             <div className="absolute inset-0 bg-[url('/images/lan_9.jpg')] bg-repeat opacity-[0.03] mix-blend-overlay"></div>
                             <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between"><h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 drop-shadow-lg">FL84 MENA LEAGUE</h2><p className="text-purple-200 text-base sm:text-lg mb-4 sm:mb-0">Featured Seasonal Championship Event</p><Link to="/event/mythic-25" className="btn-primary bg-white text-purple-800 hover:bg-purple-100 font-bold py-3 px-6 rounded-xl flex items-center transition-colors text-base shadow-lg mt-4 sm:mt-0 transform hover:scale-105">GO TO EVENT <ArrowRight size={20} className="ml-2" /></Link></div>
                        </AnimatedSection>
                        <AnimatedSection delay={200}>
                            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-primary-400 flex items-center"><Clock size={20} className="mr-2"/> UPCOMING CUPS</h3><button onClick={() => setActiveTab('cups')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">View All <ArrowRight size={16} className="ml-1" /></button></div>
                            {/* --- Rundown Upcoming Cups --- */}
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
                    {/* Right Column (Keeping placeholder data for 'My Tournaments' and 'Recent Matches') */}
                    <div className="lg:w-1/3 space-y-10">
                        <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                             <h3 className="text-2xl font-bold text-primary-400 mb-6 flex items-center"><ListChecks size={20} className="mr-2"/> My Tournaments</h3>
                             {myJoinedTournaments.length > 0 ? (
                                <div className="space-y-4">
                                    {myJoinedTournaments.map((tournament, index) => (
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
                        <AnimatedSection delay={400} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                             <div className="flex justify-between items-center mb-4"><h3 className="text-2xl font-bold text-green-400">SCRIMS</h3><button className="bg-green-600/30 text-green-300 hover:bg-green-600/50 font-semibold py-1.5 px-4 rounded-lg text-sm flex items-center transition-colors"><PlusCircle size={16} className="mr-1" /> Activate Scrim</button></div>
                            <div className="bg-dark-900 p-4 rounded-lg flex justify-between items-center border border-dark-600 hover:border-green-500/50 transition-colors"><div><p className="text-base font-semibold text-white">Daily Fire Scrim</p><p className="text-sm text-gray-400 flex items-center"><Calendar size={14} className="mr-1" /> Best of 1 - Free Entry</p></div><div className="text-right"><p className="text-xl font-bold text-green-400 leading-none">18:00</p><p className="text-sm text-gray-500 leading-none">Today</p></div></div>
                        </AnimatedSection>
                        <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                            <h3 className="text-2xl font-bold text-primary-400 mb-6">RECENT MATCHES</h3><div className="space-y-4"><div className="border border-dark-700 p-3 rounded-lg bg-dark-900"><div className="flex items-center justify-between mb-1 text-sm"><div className="flex items-center"><img src={recentMatchesRundown[0].loserLogo} alt="loser" className="w-6 h-6 rounded-full mr-2 opacity-70"/> <span className="text-gray-400 line-through">{recentMatchesRundown[0].loser}</span></div><span className="font-semibold text-red-500">{recentMatchesRundown[0].loserScore}</span></div><div className="flex items-center justify-between text-sm"><div className="flex items-center"><img src={recentMatchesRundown[0].winnerLogo} alt="winner" className="w-6 h-6 rounded-full mr-2 border-2 border-green-500"/> <span className="font-bold text-white">{recentMatchesRundown[0].winner}</span></div><span className="font-bold text-green-400">{recentMatchesRundown[0].winnerScore}</span></div></div>{[recentMatchesRundown[1], recentMatchesRundown[2]].map((match, idx) => (<div key={idx} className="flex flex-wrap gap-2 p-3 bg-dark-700 rounded-lg border border-dark-600">{match.teams.map((logo, index) => (<img key={index} src={logo} alt={`Team ${index}`} className="w-6 h-6 rounded-full object-cover border border-dark-900" title={`Team ${index+1}`} />))}</div>))}</div><button className="w-full mt-6 text-center text-sm text-primary-400 hover:text-primary-300 transition-colors font-medium">View Match History</button>
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
                    <img src="/images/lan_9.jpg" alt="Farlight 84 Banner" className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" /><h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">FARLIGHT 84 HUB</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">Your central command for all Farlight 84 tournaments, leaderboards, and team activities on Africa Rise Esports.</p>
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