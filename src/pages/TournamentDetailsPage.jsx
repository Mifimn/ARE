// src/pages/TournamentDetailsPage.jsx

import {
    Trophy, Calendar, Users, MapPin, DollarSign, Clock, Star, UserPlus,
    Tv, ListChecks, Info, ChevronRight, CheckCircle, User, Gamepad2, FileText, Eye // Removed Edit3
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useState, useEffect } from 'react';

export default function TournamentDetailsPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const [tournamentData, setTournamentData] = useState(null);
    const [loading, setLoading] = useState(true);
    // REMOVED hasUserJoined state

    // --- Placeholder Data & Fetch Simulation ---
    useEffect(() => {
        setLoading(true);
        setTournamentData(null);
        console.log(`Fetching data for tournament ID: ${tournamentId}`);

        // USE FREE FIRE TOURNAMENT AS PRIMARY EXAMPLE
        const allTournaments = [
              {
                id: 2, // Free Fire Tournament ID
                name: "Free Fire Clash Squads - MYTHIC'25",
                game: 'Free Fire',
                description: 'Intense 4v4 Clash Squad action. Prove your team coordination!',
                startDate: '2025-10-20', // Updated year based on current date
                endDate: '2025-10-20',   // Updated year
                registrationDeadline: '2025-10-18', // Updated year
                maxParticipants: 64, currentParticipants: 47, prizePool: 1000, entryFee: 0,
                format: 'Single Elimination', platform: 'Mobile', region: 'Africa',
                status: 'Registration Open', organizer: 'ARE Community',
                image: '/images/action_1.jpg', streamingPlatform: '',
                rules: `1. Game Mode: Clash Squad.\n2. Map: Bermuda.\n3. Squad Size: Squads (4).\n4. Reporting: Submit final screenshots.\n5. Fair Play: No hacks, exploits, or teaming.`,
                extraRules: 'Check-in required 15 minutes prior. First round matches start promptly.',
                gameSpecificSettings: { mode: 'Clash Squad', map: 'Bermuda', teamSize: 'Squads (4)' },
                cupId: 2 // Assuming cupId is the same as tournamentId
             },
             {
                id: 1, // Another tournament example (COD Warzone)
                name: 'African COD Warzone Championship',
                game: 'COD Warzone',
                description: 'High-stakes Call of Duty Warzone action across the continent.',
                startDate: '2026-03-15', endDate: '2026-03-17', registrationDeadline: '2026-03-10', // Updated year
                maxParticipants: 128, currentParticipants: 96, prizePool: 5000, entryFee: 10,
                format: 'Quads Battle Royale', platform: 'Cross-Platform', region: 'Africa',
                status: 'Upcoming', // Example status
                organizer: 'Africa Rise Esports',
                image: '/images/action_3.jpg',
                streamingPlatform: 'https://twitch.tv/africariesports',
                rules: `1. Game Mode: Battle Royale Quads.\n2. Map: Urzikstan.\n3. Points System: Standard ALGS Scoring.\n4. Reporting: Submit screenshots of final placement and squad kills.\n5. Fair Play: Zero tolerance for cheating.`,
                extraRules: 'All players must join the official Discord server.',
                gameSpecificSettings: { mode: 'Battle Royale', map: 'Urzikstan', teamSize: 'Quads' },
                cupId: 1
             },
             // Add other tournament objects here if needed for testing different IDs
        ];

        // Find the tournament matching the ID from the URL
        const fetchedTournament = allTournaments.find(t => t.id === parseInt(tournamentId)) || allTournaments[0]; // Fallback to first

        const timer = setTimeout(() => {
            setTournamentData(fetchedTournament);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);

    }, [tournamentId]);

     // Adjusted prizes for FF example, assuming prize data structure is consistent
     const prizeDistribution = tournamentData?.prizePool >= 5000
       ? [ { position: '1st Place', prize: '$2,500', percentage: '50%' }, { position: '2nd Place', prize: '$1,250', percentage: '25%' }, { position: '3rd Place', prize: '$750', percentage: '15%' }, { position: '4th Place', prize: '$500', percentage: '10%' } ]
       : [ { position: '1st Place', prize: 'R500', percentage: '50%' }, { position: '2nd Place', prize: 'R250', percentage: '25%' }, { position: '3rd Place', prize: 'R150', percentage: '15%' }, { position: '4th Place', prize: 'R100', percentage: '10%' } ];


    // --- Loading State ---
    if (loading || !tournamentData) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> );
    }

    // --- Status Styling Helper ---
    const getStatusClasses = (status) => { /* ... (keep function same) ... */ switch (status) { case 'Registration Open': return 'bg-green-500/20 text-green-300 border-green-500'; case 'Ongoing': return 'bg-blue-500/20 text-blue-300 border-blue-500'; case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500'; default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500'; } };

    // --- Handle Join Action (Placeholder) ---
    const handleJoinTournament = () => {
        console.log(`User attempting to join tournament ID: ${tournamentData.id}`);
        // Simulate API call
        alert(`Successfully joined ${tournamentData.name}! (Simulated) - You might be redirected or the button state would change in a real app.`);
        // In a real app you might refresh data or navigate, but here we just show an alert
    };

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
                                <span className="flex items-center"><DollarSign className="mr-1.5 text-yellow-400" size={16} /> R{tournamentData.prizePool.toLocaleString()} Prize Pool</span> {/* Using R */}
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
                                <p><span className="text-gray-400 font-medium block">Entry Fee:</span> <span className="font-semibold text-lg text-yellow-400">{tournamentData.entryFee === 0 ? 'Free' : `R${tournamentData.entryFee}`}</span></p> {/* Using R */}
                                <p><span className="text-gray-400 font-medium block">Max Players:</span> <span className="font-semibold text-lg">{tournamentData.maxParticipants}</span></p>
                                <p><span className="text-gray-400 font-medium block">Teams Allowed:</span> <span className="font-semibold text-lg">{tournamentData.allowTeams ? 'Yes' : 'No'}</span></p>
                            </div>

                            {/* --- UPDATED Action Buttons --- */}
                            <div className="flex flex-col sm:flex-row gap-4 border-t border-dark-700 pt-6">
                                {/* Join Button (conditionally disabled) */}
                                <button
                                    onClick={handleJoinTournament}
                                    className="btn-primary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    disabled={tournamentData.status !== 'Registration Open'}
                                >
                                    <UserPlus className="mr-2" size={20} />
                                    {tournamentData.status === 'Registration Open' ? 'Join Tournament' : 'Registration Closed'}
                                </button>

                                {/* View Cup Button (always visible, links to cup page) */}
                                <Link
                                    to={`/cup/${tournamentData.cupId || tournamentData.id}`} // Link to the cup page
                                    className="btn-secondary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105">
                                    <Eye className="mr-2" size={20} /> View Cup / Bracket
                                </Link>
                            </div>
                            {/* --------------------------- */}
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
                            <h2 className="text-3xl font-bold text-primary-300 mb-6 border-b border-dark-700 pb-3 flex items-center"><ListChecks size={24} className="mr-3"/> Rules Summary</h2>
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-40 overflow-y-auto">{tournamentData.rules || 'No rules specified.'}</pre>
                             {tournamentData.extraRules && (
                                <>
                                    <h3 className="text-xl font-semibold text-primary-400 mt-6 mb-3 border-t border-dark-700 pt-4 flex items-center"><FileText size={18} className="mr-2"/> Extra Notes</h3>
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-40 overflow-y-auto">{tournamentData.extraRules}</pre>
                                </>
                            )}
                        </AnimatedSection>

                    </div> {/* End Left Column */}

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        {/* Prize Pool */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={500}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2" size={22} /> Prize Pool</h2>
                            <div className="text-center mb-5"><div className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">R{tournamentData.prizePool.toLocaleString()}</div><div className="text-gray-400 text-sm uppercase tracking-wider">Total Prize Money</div></div> {/* Using R */}
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
                    </div> {/* End Right Column */}
                </div> {/* End Main Grid */}
            </div> {/* End Page Container */}
        </div>
    );
}