// src/pages/TournamentDetailsPage.jsx

import {
    Trophy, Calendar, Users, MapPin, DollarSign, Clock, Star, UserPlus,
    Tv, ListChecks, Info, ChevronRight, CheckCircle, User, Gamepad2, FileText, Eye,
    ArrowLeft, Loader2, AlertCircle, X, XCircle, UserCheck
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection'; // <-- RE-ADDED
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---
import { useAuth } from '../contexts/AuthContext'; // --- IMPORT AUTH ---


// --- Custom Modal Component (for alerts) ---
const CustomModal = ({ isOpen, onClose, title, children, confirmText = 'OK', onConfirm, showCancel = false, isLoading = false }) => {
    if (!isOpen) return null;

    const Icon = (title && title.toLowerCase().includes('error')) ? AlertCircle : (title && title.toLowerCase().includes('success')) ? CheckCircle : Info;
    const iconColor = (title && title.toLowerCase().includes('error')) ? 'text-red-400' : (title && title.toLowerCase().includes('success')) ? 'text-green-400' : 'text-primary-400';

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose(); // Default behavior: close on confirm
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !isLoading && onClose()}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-md border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${iconColor}`} /> <h3 className="text-lg font-semibold text-white">{title}</h3> </div>
                    <button onClick={() => !isLoading && onClose()} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" disabled={isLoading}> <X size={20} /> </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="text-gray-300 text-sm">{children}</div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    {showCancel && (<button onClick={() => !isLoading && onClose()} className="btn-secondary text-sm" disabled={isLoading}>Cancel</button>)}
                    <button onClick={handleConfirm} className="btn-primary text-sm flex items-center justify-center" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function TournamentDetailsPage() {
    const { tournamentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // --- Data States ---
    const [tournament, setTournament] = useState(null);
    const [allTournamentParticipants, setAllTournamentParticipants] = useState([]); // <-- List of all teams in tourney
    const [participantCount, setParticipantCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- User-specific States ---
    const [isRegistered, setIsRegistered] = useState(false); // True if *any* of user's teams are in
    const [eligibleTeams, setEligibleTeams] = useState([]); // User's owned teams that can join
    const [selectedTeamId, setSelectedTeamId] = useState(''); // Team selected from dropdown

    // --- UI States ---
    const [joinState, setJoinState] = useState('LOADING'); // LOADING, READY, DISABLED, JOINED
    const [joinMessage, setJoinMessage] = useState('Loading...');
    const [isJoining, setIsJoining] = useState(false);
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

    // --- Data Fetching Effect ---
    useEffect(() => {
        let isMounted = true;
        const fetchTournamentData = async () => {
            if (!tournamentId) {
                if (isMounted) setError("No tournament ID provided.");
                if (isMounted) setLoading(false);
                return;
            }

            if (isMounted) setLoading(true);
            if (isMounted) setError(null);
            let tournamentData = null;
            let participants = [];

            try {
                // 1. Fetch tournament details
                const { data: tourneyData, error: tournamentError } = await supabase
                    .from('tournaments')
                    .select('*')
                    .eq('id', tournamentId) // Use string tournamentId
                    .single();

                if (tournamentError) throw tournamentError;
                if (!tourneyData) throw new Error("Tournament not found.");
                if (isMounted) setTournament(tourneyData);
                tournamentData = tourneyData;

                // 2. Fetch ALL participants for this tournament
                const { data: participantData, error: countError } = await supabase
                    .from('tournament_participants')
                    .select('id, team_id, captain_id')
                    .eq('tournament_id', tournamentId); // <-- Use string tournamentId

                if (countError) throw countError;
                participants = participantData || [];
                if (isMounted) {
                    setAllTournamentParticipants(participants);
                    setParticipantCount(participants.length);
                }

            } catch (err) {
                console.error("Error fetching tournament data:", err.message);
                if (isMounted) setError(err.message);
                if (isMounted) setLoading(false);
                return; // Stop if tournament fetch fails
            }

            // 3. (If user is logged in) Fetch user's team data
            if (user && isMounted) {
                try {
                    // 3a. Get all user's team IDs (owned & member)
                    const { data: ownedTeamsData, error: ownedErr } = await supabase.from('teams').select('id, name, game, logo_url, owner_id').eq('owner_id', user.id);
                    const { data: memberTeams, error: memberErr } = await supabase.from('team_members').select('team_id').eq('user_id', user.id);
                    if (ownedErr) throw ownedErr;
                    if (memberErr) throw memberErr;

                    const ownedTeams = ownedTeamsData || [];
                    const ownedTeamIds = ownedTeams.map(t => t.id);
                    const memberTeamIds = memberTeams ? memberTeams.map(t => t.team_id) : [];
                    const allUserTeamIds = [...new Set([...ownedTeamIds, ...memberTeamIds])];

                    // 3b. Check if ANY of these teams are already registered
                    const registeredTeam = participants.find(p => allUserTeamIds.includes(p.team_id));

                    if (registeredTeam) {
                        if (isMounted) {
                            setIsRegistered(true);
                            setJoinState('JOINED');
                            setJoinMessage('Team Already Joined');
                        }
                    } else {
                        // 3c. User is not registered, so find eligible *owned* teams
                        if (isMounted) setIsRegistered(false);

                        const teamsForGame = ownedTeams.filter(t => t.game === tournamentData.game);
                        const isFull = participants.length >= tournamentData.max_participants;
                        const isClosed = new Date() > new Date(tournamentData.registration_deadline);

                        if (isFull) {
                            setJoinState('DISABLED');
                            setJoinMessage('Tournament Full');
                        } else if (isClosed) {
                            setJoinState('DISABLED');
                            setJoinMessage('Registration Closed');
                        } else if (teamsForGame.length === 0) {
                            setJoinState('DISABLED');
                            setJoinMessage(`You don't own a ${tournamentData.game} team.`);
                        } else {
                            // User has eligible teams, set up the dropdown
                            setJoinState('READY');
                            setJoinMessage('Select a team to join');
                            setEligibleTeams(teamsForGame);
                            setSelectedTeamId(teamsForGame[0].id.toString()); // Default to first team
                        }
                    }
                } catch (err) {
                    console.error("Error fetching user team data:", err.message);
                    if (isMounted) setError(err.message);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else {
                // No user, not loading
                if (isMounted) setJoinState('DISABLED');
                if (isMounted) setJoinMessage('Login to Join Tournament');
                if (isMounted) setLoading(false);
            }
        };

        fetchTournamentData();

        return () => { isMounted = false; }; // Cleanup
    }, [tournamentId, user]); // Re-run if user logs in or tournamentId changes


    // --- Handle Join Button Click ---
    const handleJoinTournament = async () => {
        if (joinState !== 'READY' || !user || !selectedTeamId || !tournament) {
            setAlertModal({ isOpen: true, title: "Error", message: "Cannot join. Please select a team." });
            return;
        }

        setIsJoining(true);
        setJoinMessage('Validating team...');
        setAlertModal({ isOpen: false }); // Close any previous error

        const teamToJoin = eligibleTeams.find(t => t.id === Number(selectedTeamId));
        if (!teamToJoin) {
            setAlertModal({ isOpen: true, title: "Error", message: "Selected team not found." });
            setIsJoining(false);
            return;
        }

        try {
            const gameName = tournament.game; // e.g., "Free Fire"

            // --- Get all team member user IDs (including owner) ---
            const { data: teamMembers } = await supabase.from('team_members').select('user_id').eq('team_id', teamToJoin.id);
            const teamMemberUserIds = (teamMembers || []).map(m => m.user_id);
            const allTeamUserIds = [...new Set([...teamMemberUserIds, user.id])]; // Add owner

            // --- Validation 1: Check Member Count ---
            if (allTeamUserIds.length < 4) { // --- YOUR RULE: Min 4 members ---
                throw new Error(`Your team "${teamToJoin.name}" needs 4+ members (currently has ${allTeamUserIds.length}).`);
            }

            // --- *** NEW: Validation 1.5: Check IGN/UID for all members *** ---
            setJoinMessage('Checking player IGNs/UIDs...');
            const { data: memberProfiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, username, game_details')
                .in('id', allTeamUserIds);

            if (profileError) throw new Error(`Could not fetch team profiles: ${profileError.message}`);

            const missingInfoPlayers = [];
            for (const profile of memberProfiles) {
                const gameInfo = profile.game_details ? profile.game_details[gameName] : null;
                // Check if gameInfo exists, and if ign/uid are present and not empty
                if (!gameInfo || !gameInfo.ign || gameInfo.ign.trim() === '' || !gameInfo.uid || gameInfo.uid.trim() === '') {
                    missingInfoPlayers.push(profile.username);
                }
            }

            if (missingInfoPlayers.length > 0) {
                throw new Error(`Join failed: The following players must set their ${gameName} IGN and UID in their profile: ${missingInfoPlayers.join(', ')}`);
            }
            // --- *** END NEW VALIDATION *** ---


            // --- Validation 2: Check for Player Conflicts ---
            setJoinMessage('Checking for player conflicts...');

            // 2b. Get all user IDs *already* in the tournament
            const participantTeamIds = allTournamentParticipants.map(p => p.team_id);
            const participantCaptainIds = allTournamentParticipants.map(p => p.captain_id);

            let allRegisteredUserIds = new Set(participantCaptainIds);

            if (participantTeamIds.length > 0) {
                 const { data: participantMembers, error: pMemberError } = await supabase
                    .from('team_members')
                    .select('user_id')
                    .in('team_id', participantTeamIds);
                if (pMemberError) throw pMemberError;
                (participantMembers || []).forEach(m => allRegisteredUserIds.add(m.user_id));
            }

            // 2c. Find the conflict
            const conflictId = allTeamUserIds.find(id => allRegisteredUserIds.has(id));

            if (conflictId) {
                const conflictProfile = memberProfiles.find(p => p.id === conflictId);
                throw new Error(`Join failed: Player "${conflictProfile?.username || conflictId}" (on your team) is already registered in this tournament.`);
            }

            // --- All Validations Passed, Proceed to Join ---
            setJoinMessage('Joining tournament...');
            const { data: newParticipant, error: insertError } = await supabase
                .from('tournament_participants')
                .insert({
                    tournament_id: tournament.id,
                    team_name: teamToJoin.name,        
                    team_logo_url: teamToJoin.logo_url || null,
                    captain_id: user.id,
                    team_id: teamToJoin.id             
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Add new participant to local state
            setAllTournamentParticipants(prev => [...prev, newParticipant]);

            // Success!
            setAlertModal({ isOpen: true, title: "Success!", message: `Your team, ${teamToJoin.name}, has successfully joined the tournament.` });
            setJoinState('JOINED');
            setJoinMessage('Team Already Joined');
            setParticipantCount(prev => prev + 1);
            setIsRegistered(true);

        } catch (err) {
            console.error("Error during join validation/insert:", err.message);
            // Show the specific validation error message
            setAlertModal({ isOpen: true, title: "Join Failed", message: err.message });
            setJoinState('READY'); // Reset button
            setJoinMessage('Select a team to join');
        } finally {
            setIsJoining(false);
        }
    };

    // --- Loading State ---
    if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> );
    }

    // --- Error State ---
    if (error || !tournament) {
         return (
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Tournament</h2>
                <p className="text-gray-400">{error?.message || "The requested tournament could not be found."}</p>
                <Link to="/tournaments" className="mt-6 btn-secondary flex items-center">
                    <ArrowLeft size={16} className="mr-2" /> Back to Tournaments
                </Link>
            </div>
        );
    }

    // --- Data processing for display ---
    const isCash = tournament.prize_type === 'Cash (USD)';
    const currencySymbol = isCash ? '$' : '';
    const currencyName = isCash ? '' : ` ${tournament.prize_currency || 'Coins'}`;
    const totalPrize = tournament.prize_pool_amount;

    // Calculate Top 3 prizes
    const prizeDistribution = [
        {
            position: '1st Place',
            prize: `${currencySymbol}${(totalPrize * 0.50).toLocaleString()}${currencyName}`,
            percentage: '50%'
        },
        {
            position: '2nd Place',
            prize: `${currencySymbol}${(totalPrize * 0.30).toLocaleString()}${currencyName}`,
            percentage: '30%'
        },
        {
            position: '3rd Place',
            prize: `${currencySymbol}${(totalPrize * 0.20).toLocaleString()}${currencyName}`,
            percentage: '20%'
        }
    ];

    const prize = isCash
        ? `$${totalPrize.toLocaleString()}`
        : `${totalPrize.toLocaleString()}${currencyName}`;


    // --- Status Styling Helper ---
    const getStatusClasses = (status) => {
        if (status === 'JOINED') return 'bg-green-500/20 text-green-300 border-green-500';
        if (status === 'Full' || status === 'Registration Closed') return 'bg-red-500/20 text-red-300 border-red-500';
        switch (status) { 
            case 'Registration Open': return 'bg-green-500/20 text-green-300 border-green-500'; 
            case 'In Progress': return 'bg-blue-500/20 text-blue-300 border-blue-500'; 
            case 'Completed': return 'bg-gray-500/20 text-gray-400 border-gray-500'; 
            default: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500'; 
        } 
    };

    // Determine status text
    let statusText = tournament.status;
    if (isRegistered) statusText = 'JOINED';
    else if (participantCount >= tournament.max_participants) statusText = 'Full';
    else if (new Date() > new Date(tournament.registration_deadline)) statusText = 'Registration Closed';
    else if (tournament.status === 'Draft' || tournament.status === 'Setup') statusText = 'Registration Open';

    // --- Helper function to get game-specific banner ---
    const getGameBanner = (gameName) => {
        if (gameName === 'Free Fire') {
            return '/images/FF_ban.jpg';
        }
        if (gameName === 'Mobile Legends') {
            return '/images/ml_ban.jpeg';
        }
        if (gameName === 'Farlight 84') {
            return '/images/far_ban.jpeg';
        }
        return tournament.image || '/images/lan_6.jpg'; 
    };

    const bannerUrl = getGameBanner(tournament.game);


    return (
        <div className="bg-dark-900 text-white min-h-screen">
            {/* --- Alert Modal for Success/Error Messages --- */}
            <CustomModal
                isOpen={alertModal.isOpen}
                onClose={() => setAlertModal({ isOpen: false, title: '', message: '' })}
                title={alertModal.title}
                confirmText="OK"
                showCancel={false}
            >
                {alertModal.message}
            </CustomModal>

            <div className="max-w-full mx-auto space-y-10 pb-10">

                {/* --- Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-72 sm:h-96 w-full overflow-hidden shadow-xl">
                    <img src={bannerUrl} alt={`${tournament.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-30"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                        <AnimatedSection tag="div" delay={100}>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border mb-3 ${getStatusClasses(statusText)}`}>
                                {statusText}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md mb-2">{tournament.name}</h1>
                            <p className="text-xl sm:text-2xl text-primary-400 font-semibold mb-4">{tournament.game}</p>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300 text-sm sm:text-base">
                                <span className="flex items-center"><Calendar className="mr-1.5 text-primary-500" size={16} /> {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}</span>
                                <span className="flex items-center"><Users className="mr-1.5 text-primary-500" size={16} /> {participantCount}/{tournament.max_participants} Teams</span>
                                <span className="flex items-center"><DollarSign className="mr-1.5 text-yellow-400" size={16} /> {prize} Prize Pool</span>
                                <span className="flex items-center"><MapPin className="mr-1.5 text-primary-500" size={16} /> {tournament.region}</span>
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
                            <p className="text-gray-300 mb-6 text-lg leading-relaxed">{tournament.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 text-sm mb-8">
                                <p><span className="text-gray-400 font-medium block">Format:</span> <span className="font-semibold text-lg capitalize">{tournament.format.replace(/-/g, ' ')}</span></p>
                                <p><span className="text-gray-400 font-medium block">Platform:</span> <span className="font-semibold text-lg capitalize">{tournament.platform}</span></p>
                                <p><span className="text-gray-400 font-medium block">Region:</span> <span className="font-semibold text-lg capitalize">{tournament.region}</span></p>
                                <p><span className="text-gray-400 font-medium block">Entry Fee:</span> <span className="font-semibold text-lg text-yellow-400">{tournament.entry_fee === 0 ? 'Free' : `$${tournament.entry_fee}`}</span></p>
                                <p><span className="text-gray-400 font-medium block">Max Teams:</span> <span className="font-semibold text-lg">{tournament.max_participants}</span></p>
                                <p><span className="text-gray-400 font-medium block">Teams Allowed:</span> <span className="font-semibold text-lg">Yes</span></p>
                            </div>

                            {/* --- UPDATED: Action/Join Button Block --- */}
                            <div className="border-t border-dark-700 pt-6">
                                {joinState === 'READY' ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <select 
                                            value={selectedTeamId}
                                            onChange={(e) => setSelectedTeamId(e.target.value)}
                                            className="input-field text-lg flex-1 appearance-none"
                                            disabled={isJoining}
                                        >
                                            {eligibleTeams.map(team => (
                                                <option key={team.id} value={team.id}>{team.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleJoinTournament}
                                            className="btn-primary text-lg px-8 py-3 flex-1 sm:flex-none flex items-center justify-center"
                                            disabled={isJoining}
                                        >
                                            {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus size={20} className="mr-2" />}
                                            {isJoining ? joinMessage : 'Join Tournament'}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className={`btn-primary text-lg px-8 py-3 w-full flex items-center justify-center disabled:opacity-70
                                            ${joinState === 'JOINED' ? 'bg-green-600 hover:bg-green-700' : ''}
                                            ${joinState === 'DISABLED' ? 'bg-gray-600 hover:bg-gray-600' : ''}
                                            ${joinState === 'LOADING' ? 'disabled:opacity-50' : ''}
                                        `}
                                        disabled={true} // Disabled for JOINED, DISABLED, LOADING
                                    >
                                        {joinState === 'LOADING' && <Loader2 className="w-5 h-5 animate-spin" />}
                                        {joinState === 'JOINED' && <UserCheck size={20} className="mr-2" />}
                                        {joinState === 'DISABLED' && <XCircle size={20} className="mr-2" />}
                                        {joinMessage}
                                    </button>
                                )}

                                <Link
                                    to={`/cup/${tournament.id}`} // Link to the cup page
                                    className="btn-secondary text-lg px-8 py-3 w-full flex items-center justify-center transform transition-transform hover:scale-105 mt-4">
                                    <Eye className="mr-2" size={20} /> View Cup / Bracket
                                </Link>
                            </div>
                            {/* --- *** END ACTION BLOCK *** --- */}
                        </AnimatedSection>

                        {/* Game Specific Settings */}
                        {tournament.game_settings && Object.keys(tournament.game_settings).length > 0 && (
                             <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={250}>
                                <h2 className="text-3xl font-bold text-primary-300 mb-4 border-b border-dark-700 pb-3 flex items-center"><Gamepad2 size={24} className="mr-3"/> {tournament.game} Settings</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                                     {Object.entries(tournament.game_settings).map(([key, value]) => (
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
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-40 overflow-y-auto">{tournament.rules || 'No rules specified.'}</pre>
                             {tournament.extra_rules && (
                                <>
                                    <h3 className="text-xl font-semibold text-primary-400 mt-6 mb-3 border-t border-dark-700 pt-4 flex items-center"><FileText size={18} className="mr-2"/> Extra Notes</h3>
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans bg-dark-900/30 p-4 rounded border border-dark-600 max-h-40 overflow-y-auto">{tournament.extra_rules}</pre>
                                </>
                            )}
                        </AnimatedSection>

                    </div> {/* End Left Column */}

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8 lg:sticky lg:top-24 self-start">
                        {/* Prize Pool */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={500}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center text-yellow-400"><Trophy className="mr-2" size={22} /> Prize Pool</h2>
                            <div className="text-center mb-5"><div className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">{prize}</div><div className="text-gray-400 text-sm uppercase tracking-wider">{tournament.prize_type === 'Cash (USD)' ? 'Total Cash Prize' : 'In-Game Currency'}</div></div>

                            {/* --- *** UPDATED: Prize Distribution *** --- */}
                            <div className="space-y-3 border-t border-dark-700 pt-4">
                                {prizeDistribution.map((prize, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-300 font-medium">{prize.position}</span>
                                        <div className="text-right">
                                            <div className="font-semibold text-white">{prize.prize}</div>
                                            <div className="text-xs text-gray-400">{prize.percentage}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* --- *** END UPDATE *** --- */}

                        </AnimatedSection>

                        {/* Key Info */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={600}>
                             <h2 className="text-2xl font-bold mb-4 text-primary-300">Key Info</h2>
                             <div className="space-y-3 text-base">
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><User className="mr-2" size={16}/> Organizer:</span><span className="font-medium text-white">{tournament.organizer || 'ARE Community'}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><Clock className="mr-2" size={16}/> Reg. Deadline:</span><span className="font-medium text-white">{new Date(tournament.registration_deadline).toLocaleDateString()}</span></div>
                                <div className="flex justify-between items-center"><span className="text-gray-400 flex items-center"><Tv className="mr-2" size={16}/> Stream:</span><a href={tournament.stream_url} target="_blank" rel="noopener noreferrer" className={`font-medium ${tournament.stream_url ? 'text-primary-400 hover:text-primary-300 hover:underline' : 'text-gray-500 cursor-not-allowed'} truncate`}>{tournament.stream_url ? 'Watch Live' : 'N/A'}</a></div>
                             </div>
                        </AnimatedSection>
                    </div> {/* End Right Column */}
                </div> {/* End Main Grid */}
            </div> {/* End Page Container */}
        </div>
    );
}