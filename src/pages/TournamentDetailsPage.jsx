// src/pages/TournamentDetailsPage.jsx

import {
    Trophy, Calendar, Users, MapPin, DollarSign, Clock, Star, UserPlus,
    Tv, ListChecks, Info, ChevronRight, CheckCircle, User, Gamepad2, FileText, Eye,
    ArrowLeft, Loader2, AlertCircle, X, XCircle, UserCheck // Added new icons
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---
import { useAuth } from '../contexts/AuthContext'; // --- IMPORT AUTH ---


// --- NEW: Custom Modal Component (for alerts) ---
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
    const [participantCount, setParticipantCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userTeam, setUserTeam] = useState(null);
    const [teamMemberCount, setTeamMemberCount] = useState(0);
    const [isRegistered, setIsRegistered] = useState(false);

    // --- UI States ---
    const [joinState, setJoinState] = useState('LOADING'); // LOADING, READY, DISABLED, JOINED
    const [joinMessage, setJoinMessage] = useState('Loading...');
    const [isJoining, setIsJoining] = useState(false);
    const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '' });

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchTournamentData = async () => {
            if (!tournamentId) {
                setError("No tournament ID provided.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            let teamData = null;
            let memberCount = 0;
            let registered = false;

            try {
                // 1. Fetch tournament details
                const { data: tournamentData, error: tournamentError } = await supabase
                    .from('tournaments')
                    .select('*')
                    .eq('id', tournamentId)
                    .single();

                if (tournamentError) throw tournamentError;
                if (!tournamentData) throw new Error("Tournament not found.");
                setTournament(tournamentData);

                // 2. Fetch participant count
                const { count, error: countError } = await supabase
                    .from('tournament_participants')
                    .select('id', { count: 'exact', head: true })
                    .eq('tournament_id', tournamentId);

                if (countError) throw countError;
                setParticipantCount(count || 0);

                // 3. (If user is logged in) Fetch user's team, member count, and registration status
                if (user) {
                    // 3a. Find team where user is owner
                    // *** UPDATED QUERY to select * to match ManageTeamPage.jsx ***
                    const { data: teamFetchData, error: teamError } = await supabase
                        .from('teams')
                        .select('*') // Use '*' to satisfy RLS and get all team data
                        .eq('owner_id', user.id)
                        .single();

                    if (teamError && teamError.code !== 'PGRST116') { // Ignore "no rows found"
                        console.error("Error fetching team:", teamError.message);
                        throw teamError;
                    }

                    if (teamFetchData) {
                        setUserTeam(teamFetchData);
                        teamData = teamFetchData;

                        // 3b. Get team member count (add 1 for the owner)
                        const { count: memberCountData, error: memberError } = await supabase
                            .from('team_members')
                            .select('id', { count: 'exact', head: true })
                            .eq('team_id', teamFetchData.id);

                        if (memberError) throw memberError;
                        const totalMembers = (memberCountData || 0) + 1; // +1 for the owner
                        setTeamMemberCount(totalMembers);
                        memberCount = totalMembers;

                        // 3c. Check if this team is already registered
                        const { data: registrationData, error: regError } = await supabase
                            .from('tournament_participants')
                            .select('id')
                            .eq('tournament_id', tournamentId)
                            .eq('captain_id', user.id) // Check if user (as captain) is registered
                            .maybeSingle();

                        if (regError) throw regError;

                        if (registrationData) {
                            setIsRegistered(true);
                            registered = true;
                        }
                    }
                }

                // 4. Update the Join Button state based on all fetched data
                updateJoinButtonState(tournamentData, count, teamData, memberCount, registered);

            } catch (err) {
                console.error("Error fetching tournament details:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentData();
    }, [tournamentId, user]); // Re-run if user logs in or tournamentId changes

    // --- Logic to determine join button state ---
    const updateJoinButtonState = (tournamentData, currentCount, team, members, isAlreadyRegistered) => {
        if (!tournamentData) return;

        const isFull = currentCount >= tournamentData.max_participants;
        const now = new Date();
        const regDeadline = new Date(tournamentData.registration_deadline);

        if (isAlreadyRegistered) {
            setJoinState('JOINED');
            setJoinMessage('Team Already Joined');
        } else if (!user) {
            setJoinState('DISABLED');
            setJoinMessage('Login to Join Tournament');
        } else if (isFull) {
            setJoinState('DISABLED');
            setJoinMessage('Tournament Full');
        } else if (now > regDeadline) {
            setJoinState('DISABLED');
            setJoinMessage('Registration Closed');
        } else if (!team) {
            setJoinState('DISABLED');
            setJoinMessage('Create a Team to Join');
        } else if (members < 4) { // --- YOUR RULE: Min 4 members ---
            setJoinState('DISABLED');
            setJoinMessage(`Team needs 4+ members (has ${members})`);
        } else {
            setJoinState('READY');
            setJoinMessage('Join Tournament');
        }
    };

    // --- Handle Join Button Click ---
    const handleJoinTournament = async () => {
        if (joinState !== 'READY' || !user || !userTeam || !tournament) {
            setAlertModal({ isOpen: true, title: "Error", message: "Cannot join tournament. Please refresh." });
            return;
        }

        setIsJoining(true); // Show loading spinner on button

        // --- *** THE FIX IS HERE *** ---
        // We read `userTeam.name` (from 'teams' table) and insert it into the `team_name` column.
        // We read `userTeam.id` and insert it into the `team_id` column.
        const { error } = await supabase
            .from('tournament_participants')
            .insert({
                tournament_id: tournament.id,
                team_name: userTeam.name,        // <-- FIX 1: Use `userTeam.name`
                team_logo_url: userTeam.logo_url,
                captain_id: user.id,
                team_id: userTeam.id             // <-- FIX 2: Ensure this is saved
            });

        setIsJoining(false);

        if (error) {
            console.error("Error joining tournament:", error.message);
            setAlertModal({ isOpen: true, title: "Error Joining", message: error.message });
        } else {
            // Success!
            setAlertModal({ isOpen: true, title: "Success!", message: `Your team, ${userTeam.name}, has successfully joined the tournament.` });
            // Update UI immediately
            setJoinState('JOINED');
            setJoinMessage('Successfully Joined!');
            setParticipantCount(prev => prev + 1);
            setIsRegistered(true);
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

    // --- Data processing for display (from your file) ---
    // Using `prize_pool_amount` from the table
    const prizeDistribution = tournament.prize_pool_amount >= 5000
       ? [ { position: '1st Place', prize: '$2,500', percentage: '50%' }, { position: '2nd Place', prize: '$1,250', percentage: '25%' }, { position: '3rd Place', prize: '$750', percentage: '15%' }, { position: '4th Place', prize: '$500', percentage: '10%' } ]
       : [ { position: '1st Place', prize: 'R500', percentage: '50%' }, { position: '2nd Place', prize: 'R250', percentage: '25%' }, { position: '3rd Place', prize: 'R150', percentage: '15%' }, { position: '4th Place', prize: 'R100', percentage: '10%' } ];

    const prize = tournament.prize_type === 'Cash (USD)'
        ? `$${tournament.prize_pool_amount.toLocaleString()}`
        : `${tournament.prize_pool_amount.toLocaleString()} ${tournament.prize_currency || 'Coins'}`;

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
                    <img src={tournament.image || '/images/lan_6.jpg'} alt={`${tournament.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-30"/>
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

                            {/* --- UPDATED Action Buttons --- */}
                            <div className="flex flex-col sm:flex-row gap-4 border-t border-dark-700 pt-6">
                                <button
                                    onClick={handleJoinTournament}
                                    className={`btn-primary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                        ${joinState === 'JOINED' ? 'bg-green-600 hover:bg-green-700' : ''}
                                        ${joinState === 'DISABLED' ? 'bg-gray-600 hover:bg-gray-600' : ''}
                                    `}
                                    disabled={joinState !== 'READY' || isJoining}
                                >
                                    {isJoining ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                                    joinState === 'JOINED' ? <UserCheck size={20} className="mr-2" /> : 
                                    joinState === 'READY' ? <UserPlus size={20} className="mr-2" /> :
                                    <XCircle size={20} className="mr-2" />}
                                    {joinMessage}
                                </button>

                                <Link
                                    to={`/cup/${tournament.id}`} // Link to the cup page
                                    className="btn-secondary text-lg px-8 py-3 flex-1 flex items-center justify-center transform transition-transform hover:scale-105">
                                    <Eye className="mr-2" size={20} /> View Cup / Bracket
                                </Link>
                            </div>
                            {/* --------------------------- */}
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
                            <div className="space-y-3 border-t border-dark-700 pt-4">{prizeDistribution.map((prize, index) => (<div key={index} className="flex justify-between items-center text-sm"><span className="text-gray-300 font-medium">{prize.position}</span><div className="text-right"><div className="font-semibold text-white">{prize.prize}</div><div className="text-xs text-gray-400">{prize.percentage}</div></div></div>))}</div>
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