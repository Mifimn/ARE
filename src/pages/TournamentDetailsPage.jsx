// src/pages/TournamentDetailsPage.jsx

import {
    Trophy, Calendar, Users, MapPin, DollarSign, Clock, Star, UserPlus,
    Edit3, Tv, ListChecks, Info, ChevronRight, CheckCircle, User, Gamepad2, FileText // Added Gamepad2, FileText
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useState, useEffect } from 'react';

export default function TournamentDetailsPage() {
    const { id } = useParams();
    const [tournamentData, setTournamentData] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Placeholder Data & Fetch Simulation ---
    useEffect(() => {
        setLoading(true);
        setTournamentData(null);
        // Simulate fetching data based on 'id'
        // Replace this entire block with your actual Supabase fetch logic
        console.log(`Fetching data for tournament ID: ${id}`); // Log the ID being used

        // Find the specific tournament data (using hardcoded data for now)
        // In a real app, this would be a Supabase query:
        // const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single();
        const allTournaments = [ // Example database
             {
                id: 1, // Match this ID or use the 'id' from useParams
                name: 'FIFA 24 African Championship',
                game: 'FIFA 24',
                description: 'The biggest FIFA tournament in Africa featuring top players...',
                startDate: '2024-03-15', endDate: '2024-03-17', registrationDeadline: '2024-03-10',
                maxParticipants: 128, currentParticipants: 96, prizePool: 5000, entryFee: 0,
                format: 'Single Elimination', platform: 'Console', region: 'Africa',
                status: 'Registration Open', organizer: 'Africa Rise Esports',
                image: '/images/lan_1.jpg', streamingPlatform: 'https://twitch.tv/africariesports',
                // Store rules as a string, matching Create page
                rules: `1. Game Mode: Ultimate Team (85+ rated squads recommended).\n2. Match Duration: 6 minutes (3 min halves).\n3. Difficulty: World Class.\n4. Controls: Any.\n5. Game Speed: Normal.\n6. Defending: Tactical Defending Only.\n7. No legacy defending allowed.\n8. Custom formations/tactics are allowed.\n9. Reporting: Submit screenshot of final score immediately.\n10. Disconnects: Consult admin. Intentional disconnects result in forfeiture.`,
                extraRules: 'All players must join the official Discord server 30 minutes before match time.', // Added Extra Rules
                // Added Game Specific Settings
                gameSpecificSettings: { mode: 'Ultimate Team', map: 'N/A', teamSize: 'Solos' }
             },
             // Add other tournament objects here if needed for testing different IDs
              {
                id: 2, // Example Free Fire Tournament
                name: 'Free Fire Clash Squads - MYTHIC\'25',
                game: 'Free Fire',
                description: 'Intense 4v4 Clash Squad action. Prove your team coordination!',
                startDate: '2024-10-20', endDate: '2024-10-20', registrationDeadline: '2024-10-18',
                maxParticipants: 64, currentParticipants: 47, prizePool: 1000, entryFee: 0,
                format: 'Single Elimination', platform: 'Mobile', region: 'Africa',
                status: 'Registration Open', organizer: 'ARE Community',
                image: '/images/action_1.jpg', streamingPlatform: '',
                rules: `1. Game Mode: Clash Squad.\n2. Map: Bermuda.\n3. Squad Size: Squads (4).\n4. Reporting: Submit final screenshots.\n5. Fair Play: No hacks, exploits, or teaming.`,
                extraRules: 'Check-in required 15 minutes prior. First round matches start promptly.',
                gameSpecificSettings: { mode: 'Clash Squad', map: 'Bermuda', teamSize: 'Squads (4)' }
             }
        ];

        // Find the tournament matching the ID from the URL (convert id to number)
        const fetchedTournament = allTournaments.find(t => t.id === parseInt(id)) || allTournaments[0]; // Fallback to first if ID not found

        const timer = setTimeout(() => {
            setTournamentData(fetchedTournament);
            setLoading(false);
        }, 300); // Shorter delay

        return () => clearTimeout(timer);

    }, [id]); // Re-run when the ID parameter changes

    // --- (prizeDistribution, participants, schedule data remain the same) ---
     const prizeDistribution = [ { position: '1st Place', prize: '$2,500', percentage: '50%' }, { position: '2nd Place', prize: '$1,250', percentage: '25%' }, { position: '3rd Place', prize: '$750', percentage: '15%' }, { position: '4th Place', prize: '$500', percentage: '10%' } ];
     const participants = [ { id: 1, username: 'FIFAKing23', country: 'Nigeria', avatar: '/images/ava_m_1.png', ranking: 'Gold III'}, { id: 2, username: 'DesertStorm', country: 'Egypt', avatar: '/images/ava_m_3.png', ranking: 'Platinum I'}, { id: 3, username: 'LionHeart', country: 'South Africa', avatar: '/images/ava_m_6.png', ranking: 'Gold I'}, { id: 4, username: 'AtlasWarrior', country: 'Morocco', avatar: '/images/ava_m_9.png', ranking: 'Diamond II'}, { id: 5, username: 'NaijaNinja', country: 'Nigeria', avatar: '/images/ava_f_1.png', ranking: 'Silver II'}, { id: 6, username: 'CairoQueen', country: 'Egypt', avatar: '/images/ava_f_3.png', ranking: 'Gold IV'}, ];
     const schedule = [ { round: 'Round 1', date: '2024-03-15', time: '10:00 AM', matches: 64 }, { round: 'Round 2', date: '2024-03-15', time: '2:00 PM', matches: 32 }, { round: 'Quarter Finals', date: '2024-03-16', time: '10:00 AM', matches: 8 }, { round: 'Semi Finals', date: '2024-03-16', time: '6:00 PM', matches: 4 }, { round: 'Finals', date: '2024-03-17', time: '8:00 PM', matches: 1 } ];
    // --- (End of data) ---


    // --- Loading State ---
    if (loading || !tournamentData) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> );
    }

    // --- Status Styling Helper ---
    const getStatusClasses = (status) => { /* ... (keep function same) ... */ switch (status) { case 'Registration Open': return 'bg-green-500/20 text-green-300 border-green-500'; case 'Ongoing': return 'bg-blue-500/20 text-blue-300 border-blue-500'; case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500'; default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500'; } };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-full mx-auto space-y-10 pb-10">

                {/* --- Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-72 sm:h-96 w-full overflow-hidden shadow-xl">
                    <img src={tournamentData.image} alt={`${tournamentData.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-30"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                        <AnimatedSection tag="div" delay={100}>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border mb-3 ${getStatusClasses(tournamentData.status)}`}>{tournamentData.status}</span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md mb-2">{tournamentData.name}</h1>
                            <p className="text-xl sm:text-2xl text-primary-400 font-semibold mb-4">{tournamentData.game}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300 text-sm sm:text-base">
                                <span className="flex items-center"><Calendar className="mr-1.5 text-primary-500" size={16} /> {new Date(tournamentData.startDate).toLocaleDateString()} - {new Date(tournamentData.endDate).toLocaleDateString()}</span>
                                <span className="flex items-center"><Users className="mr-1.5 text-primary-500" size={16} /> {tournamentData.currentParticipants}/{tournamentData.maxParticipants} Players</span>
                                <span className="flex items-center"><DollarSign className="mr-1.5 text-yellow-400" size={16} /> ${tournamentData.prizePool.toLocaleString()} Prize Pool</span>
                                <span className="flex items-center"><MapPin className="mr-1.5 text-primary-500" size={16} /> {tournamentData.region}</span>
                            </div>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>

                {/* --- Main Content Grid --- */}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left Column (Main Details) */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Overview & General Settings */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={200}>
                            <h2 className="text-3xl font-bold text-primary-300 mb-4 border-b border-dark-700 pb-3 flex items-center"><Info size={24} className="mr-3"/> Overview & Settings</h2>
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">{tournamentData.description}</p>
                            {/* Combined General Settings */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm mb-8">
                                <p><span className="text-gray-400 font-medium block">Format:</span> <span className="font-semibold text-lg">{tournamentData.format}</span></p>
                                <p><span className="text-gray-400 font-medium block">Platform:</span> <span className="font-semibold text-lg">{tournamentData.platform}</span></p>
                                <p><span className="text-gray-400 font-medium block">Region:</span> <span className="font-semibold text-lg">{tournamentData.region}</span></p>
                                <p><span className="text-gray-400 font-medium block">Entry Fee:</span> <span className="font-semibold text-lg text-yellow-400">{tournamentData.entryFee === 0 ? 'Free' : `$${tournamentData.entryFee}`}</span></p>
                                <p><span className="text-gray-400 font-medium block">Max Players:</span> <span className="font-semibold text-lg">{tournamentData.maxParticipants}</span></p>
                                <p><span className="text-gray-400 font-medium block">Teams Allowed:</span> <span className="font-semibold text-lg">{tournamentData.allowTeams ? 'Yes' : 'No'}</span></p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 border-t border-dark-700 pt-6">
                                <button className="btn-primary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed" disabled={tournamentData.status !== 'Registration Open'}>
                                    <UserPlus className="mr-2" size={20} /> {tournamentData.status === 'Registration Open' ? 'Join Tournament' : 'Registration Closed'}
                                </button>
                                {/* Only show Edit button if user is organizer (example logic) */}
                                {/* {isOrganizer && ( */}
                                <Link to={`/update-tournament/${tournamentData.id}`} className="btn-secondary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105">
                                    <Edit3 className="mr-2" size={20} /> Edit Details
                                </Link>
                                {/* )} */}
                            </div>
                        </AnimatedSection>

                        {/* Game Specific Settings */}
                        {tournamentData.gameSpecificSettings && Object.keys(tournamentData.gameSpecificSettings).length > 0 && (
                             <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={250}>
                                <h2 className="text-3xl font-bold text-primary-300 mb-4 border-b border-dark-700 pb-3 flex items-center"><Gamepad2 size={24} className="mr-3"/> {tournamentData.game} Settings</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                                     {Object.entries(tournamentData.gameSpecificSettings).map(([key, value]) => (
                                        <p key={key}>
                                            <span className="text-gray-400 font-medium block capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                            <span className="font-semibold text-lg">{value || 'N/A'}</span>
                                        </p>
                                    ))}
                                </div>
                             </AnimatedSection>
                        )}

                        {/* Rules */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={300}>
                            <h2 className="text-3xl font-bold text-primary-300 mb-6 border-b border-dark-700 pb-3 flex items-center"><ListChecks size={24} className="mr-3"/> Default Rules</h2>
                            {/* Display rules as preformatted text */}
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-60 overflow-y-auto">{tournamentData.rules || 'No default rules specified.'}</pre>

                             {/* Display Extra Rules if they exist */}
                             {tournamentData.extraRules && (
                                <>
                                    <h3 className="text-xl font-semibold text-primary-400 mt-6 mb-3 border-t border-dark-700 pt-4 flex items-center"><FileText size={18} className="mr-2"/> Extra Rules / Notes</h3>
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-60 overflow-y-auto">{tournamentData.extraRules}</pre>
                                </>
                            )}
                        </AnimatedSection>

                        {/* Schedule */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={400}>
                           <h2 className="text-3xl font-bold text-primary-300 mb-6 border-b border-dark-700 pb-3 flex items-center"><Calendar size={24} className="mr-3"/> Schedule</h2>
                           {schedule.length > 0 ? (
                               <div className="space-y-4">
                                   {schedule.map((item, index) => ( /* ... schedule items ... */ <div key={index} className="bg-dark-700/50 rounded-lg p-4 flex justify-between items-center border-l-4 border-primary-500/60"><div><h3 className="font-semibold text-lg text-white">{item.round}</h3><p className="text-gray-400 text-sm">{item.matches} Matches</p></div><div className="text-right"><p className="font-medium text-gray-200">{new Date(item.date).toLocaleDateString()}</p><p className="text-gray-400 text-sm">{item.time}</p></div></div>))}
                               </div>
                           ) : (
                               <p className="text-gray-400">Detailed schedule will be posted soon.</p>
                           )}
                        </AnimatedSection>

                    </div> {/* End Left Column */}

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        {/* Prize Pool */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={500}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2" size={22} /> Prize Pool</h2>
                            <div className="text-center mb-5"><div className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">${tournamentData.prizePool.toLocaleString()}</div><div className="text-gray-400 text-sm uppercase tracking-wider">Total Prize Money</div></div>
                            <div className="space-y-3 border-t border-dark-700 pt-4">{prizeDistribution.map((prize, index) => (<div key={index} className="flex justify-between items-center text-sm"><span className="text-gray-300 font-medium">{prize.position}</span><div className="text-right"><div className="font-semibold text-white">{prize.prize}</div><div className="text-xs text-gray-400">{prize.percentage}</div></div></div>))}</div>
                        </AnimatedSection>

                        {/* Key Info */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={600}>
                             <h2 className="text-2xl font-bold mb-4 text-primary-300">Key Info</h2>
                             <div className="space-y-3 text-base">
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><User className="mr-2" size={16}/> Organizer:</span><span className="font-medium text-white">{tournamentData.organizer}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><Clock className="mr-2" size={16}/> Reg. Deadline:</span><span className="font-medium text-white">{new Date(tournamentData.registrationDeadline).toLocaleDateString()}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><Tv className="mr-2" size={16}/> Stream:</span><a href={tournamentData.streamingPlatform} target="_blank" rel="noopener noreferrer" className={`font-medium ${tournamentData.streamingPlatform ? 'text-primary-400 hover:text-primary-300 hover:underline' : 'text-gray-500 cursor-not-allowed'} truncate`}>{tournamentData.streamingPlatform ? 'Watch Live' : 'N/A'}</a></div>
                             </div>
                        </AnimatedSection>

                        {/* Participants Preview */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={700}>
                            <h2 className="text-2xl font-bold mb-4 text-primary-300">Participants ({participants.length})</h2>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">{participants.map((p) => (<div key={p.id} className="flex items-center p-2 bg-dark-700/50 rounded-lg"><img src={p.avatar} alt={p.username} className="w-8 h-8 rounded-full mr-3 border border-dark-600"/><div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{p.username}</p><p className="text-xs text-gray-400">{p.country}</p></div><div className="text-xs text-primary-400 font-semibold ml-2">{p.ranking}</div></div>))}</div>
                            <div className="text-center mt-4 border-t border-dark-700 pt-4"><Link to="/players" className="text-primary-400 hover:text-primary-300 text-sm font-medium">View All Participants</Link></div>
                        </AnimatedSection>
                    </div> {/* End Right Column */}
                </div> {/* End Main Grid */}
            </div> {/* End Page Container */}
        </div>
    );
}