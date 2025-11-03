// src/pages/TeamPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
// Added/changed icons: Heart, Clock, BarChart, Crosshair, Percent, User, LogOut, CheckCircle
import {
    Users, Trophy, Calendar, MapPin, Star, Mail, UserPlus, Settings, BarChart, Percent, Crosshair, Loader2, AlertCircle, Gamepad2, User, UserX, LogOut, Heart, Clock as ClockIcon, CheckCircle
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- NEW: Helper function to fetch team stats, matches, and events ---
const fetchTeamPerformance = async (teamId) => {
    if (!teamId) return { stats: null, recentMatches: [], upcomingEvents: [] };

    try {
        // 1. Get all participant records for this team
        const { data: participantRecords, error: pError } = await supabase
            .from('tournament_participants')
            .select('id, team_name, tournaments!inner(id, name, game, start_date, status)') // inner join to only get participants in tournaments
            .eq('team_id', teamId);
        
        if (pError) throw pError;
        if (!participantRecords || participantRecords.length === 0) {
            console.log("No participant records found for team:", teamId);
            return { stats: null, recentMatches: [], upcomingEvents: [] };
        }

        const participantIds = participantRecords.map(p => p.id);

        // 2. Fetch all match results for these participant records
        const { data: results, error: resultsError } = await supabase
            .from('match_results')
            .select('id, created_at, placement, kills, participant_id')
            .in('participant_id', participantIds)
            .order('created_at', { ascending: false });

        if (resultsError) throw resultsError;
        
        const allResults = results || [];

        // 3. Calculate Stats
        let totalKills = 0;
        let totalPlacementSum = 0;
        let totalWins = 0;
        allResults.forEach(r => {
            totalKills += r.kills || 0;
            totalPlacementSum += r.placement || 0;
            if (r.placement === 1) totalWins++;
        });
        
        const totalMatches = allResults.length;
        const totalLosses = totalMatches - totalWins;
        const stats = {
            totalMatches: totalMatches,
            totalWins: totalWins,
            totalLosses: totalLosses,
            totalKills: totalKills,
            winRate: totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0,
            avgPlacement: totalMatches > 0 ? (totalPlacementSum / totalMatches).toFixed(1) : 0,
        };

        // 4. Format Recent Matches (Top 5)
        const recentMatches = allResults.slice(0, 5).map(r => {
            const participant = participantRecords.find(p => p.id === r.participant_id);
            return {
                id: r.id,
                game: participant?.tournaments?.game || 'Unknown Game',
                tournamentName: participant?.tournaments?.name || 'Unknown Tournament',
                placement: r.placement,
                kills: r.kills,
                date: r.created_at
            };
        });

        // 5. Format Upcoming Events
        const upcomingEvents = participantRecords
            .filter(p => p.tournaments.status === 'Draft' || p.tournaments.status === 'In Progress')
            .map(p => ({
                id: p.tournaments.id,
                name: p.tournaments.name,
                startDate: p.tournaments.start_date
            }))
            // De-duplicate events
            .filter((event, index, self) => self.findIndex(e => e.id === event.id) === index)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));


        return { stats, recentMatches, upcomingEvents };

    } catch (error) {
        console.error("Error in fetchTeamPerformance:", error.message);
        return { stats: null, recentMatches: [], upcomingEvents: [] };
    }
};
// ---

export default function TeamPage() {
    const { teamId } = useParams();
    const { user: authUser } = useAuth();
    const [teamData, setTeamData] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);

    // --- State for Liking (Single Like Logic) ---
    const [hasLiked, setHasLiked] = useState(false); // Track if current user liked
    const [isLiking, setIsLiking] = useState(false);
    const [likeError, setLikeError] = useState(null);
    // ---

    // State for Join Requests
    const [hasPendingRequest, setHasPendingRequest] = useState(false);
    const [isRequestingJoin, setIsRequestingJoin] = useState(false);
    const [joinRequestError, setJoinRequestError] = useState(null);
    // ---

    // --- NEW: State for dynamic data ---
    const [teamStats, setTeamStats] = useState(null);
    const [recentMatches, setRecentMatches] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    // ---

    // --- Fetch Team Data, Members, Like Status, and Join Request Status ---
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            // Ensure teamId is a number for Supabase bigint comparison
            const numericTeamId = parseInt(teamId, 10);
            if (isNaN(numericTeamId)) {
                 if (isMounted) { setError("Invalid Team ID provided."); setLoading(false); }
                 return;
            }

            if (!isMounted) return;
            setLoading(true); setError(null); setLikeError(null);
            setJoinRequestError(null); setHasPendingRequest(false); setHasLiked(false); // Reset all relevant states
            // --- NEW: Reset dynamic state ---
            setTeamStats(null); setRecentMatches([]); setUpcomingEvents([]);
            // ---

            console.log(`TeamPage: Fetching data for team ID: ${numericTeamId}`);

            try {
                // Fetch team data (including owner and likes column)
                const { data: teamResult, error: teamError } = await supabase
                    .from('teams')
                    .select(`
                        *,
                        likes,
                        owner:profiles!owner_id ( username, avatar_url )
                    `)
                    .eq('id', numericTeamId).maybeSingle();

                if (teamError) throw teamError;
                if (!teamResult) throw new Error(`Team with ID ${numericTeamId} not found.`);
                if (!isMounted) return;
                console.log("TeamPage: Fetched team data:", teamResult);
                setTeamData(teamResult);

                // Check ownership
                const ownerCheck = authUser && teamResult.owner_id === authUser.id;
                setIsOwner(ownerCheck);

                // Fetch members
                // --- UPDATED: Fetch all profile data (*) for members ---
                const { data: membersResult, error: membersError } = await supabase
                    .from('team_members')
                    .select(`
                        *,
                        profiles ( * )
                    `)
                    .eq('team_id', numericTeamId).order('joined_at');
                if (membersError) throw membersError;
                if (!isMounted) return;
                console.log("TeamPage: Fetched members:", membersResult);
                setMembers(membersResult || []);

                // Check membership
                const memberCheck = authUser && membersResult?.some(m => m.user_id === authUser.id);
                setIsMember(memberCheck);

                // --- NEW: Fetch Stats, Matches, and Events ---
                const { stats, recentMatches, upcomingEvents } = await fetchTeamPerformance(numericTeamId);
                if (isMounted) {
                    setTeamStats(stats);
                    setRecentMatches(recentMatches);
                    setUpcomingEvents(upcomingEvents);
                }
                // ---

                // --- Fetch Like & Join Request Status (only if logged in and not owner/member) ---
                if (authUser && !ownerCheck && !memberCheck) {
                    // Check Like Status
                    console.log(`[TeamPage] Checking like status for team ${numericTeamId} by user ${authUser.id}`);
                    const { data: likeData, error: likeCheckError } = await supabase
                        .from('team_likes')
                        .select('team_id')
                        .eq('team_id', numericTeamId)
                        .eq('liker_id', authUser.id)
                        .maybeSingle();
                    if (likeCheckError && isMounted) console.error("Error checking like status:", likeCheckError);
                    else if (likeData && isMounted) { console.log("[TeamPage] User has liked this team."); setHasLiked(true); }

                    // Check Join Request Status
                    console.log(`[TeamPage] Checking join request status for team ${numericTeamId} by user ${authUser.id}`);
                    const { data: requestData, error: requestError } = await supabase
                        .from('team_join_requests')
                        .select('id')
                        .eq('team_id', numericTeamId)
                        .eq('user_id', authUser.id)
                        .eq('status', 'pending')
                        .maybeSingle();
                    if (requestError && isMounted) console.error("Error checking join request status:", requestError);
                    else if (requestData && isMounted) { console.log("[TeamPage] User has a pending join request."); setHasPendingRequest(true); }
                }
                // --- End Status Fetches ---

                // Placeholders (Only achievements left)
                if(isMounted){
                    setTeamData(prev => ({
                        ...(prev || {}),
                         achievements: prev?.achievements || [
                              { title: 'Local Champions', description: 'Won City League 2024', icon: Trophy, date: '2024-12-15' },
                         ]
                    }));
                }

            } catch (err) {
                console.error("TeamPage: Error fetching data:", err.message);
                 if (isMounted) setError(`Failed to load team data: ${err.message}`);
            } finally {
                 if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false };

    }, [teamId, authUser]); // Rerun if teamId or authUser changes

    // --- Handle Like Button Click (Use RPC) ---
    const handleLikeTeam = async () => {
        if (!authUser) { setLikeError("You must be logged in to like a team."); return; }
        if (!teamData || !teamData.id || isOwner) { setLikeError("Cannot like this team."); return; } // Prevent owner liking
        if (hasLiked) { setLikeError("You have already liked this team."); return; } // Prevent double liking

        setIsLiking(true); setLikeError(null);
        console.log(`[TeamPage] Calling RPC 'increment_team_like' for team ID: ${teamData.id}`);

        try {
            // Call the Supabase RPC function
            const { data, error: rpcError } = await supabase.rpc('increment_team_like', {
                target_team_id: teamData.id // Pass the team ID to the function
            });

            if (rpcError) throw rpcError; // Throw DB errors

            console.log("RPC Response:", data);

            // Check the response from the function
            if (data && data.success) {
                // Optimistic UI update for the count
                setTeamData(prev => ({ ...prev, likes: (prev?.likes ?? 0) + 1 }));
                setHasLiked(true); // Update UI state
            } else {
                // Show message from function if like wasn't successful
                setLikeError(data?.message || "Could not like team.");
                // Re-check like status if message indicates already liked
                if (data?.message?.includes("already liked")) { setHasLiked(true); }
            }

        } catch (err) {
            console.error("Error calling increment_team_like function:", err);
            setLikeError(`Failed to like team: ${err.message}`);
        } finally { setIsLiking(false); }
    };
    // ---

    // --- Handle Request to Join Button Click ---
    const handleRequestToJoin = async () => {
        if (!authUser) { setJoinRequestError("You must be logged in to request to join."); return; }
        if (!teamData || !teamData.id || isOwner || isMember || hasPendingRequest) {
            setJoinRequestError("Cannot send join request."); return;
        }

        setIsRequestingJoin(true); setJoinRequestError(null);
        const targetTeamId = teamData.id;
        console.log(`[TeamPage] User ${authUser.id} requesting to join team ${targetTeamId}`);

        try {
            const { error: insertError } = await supabase
                .from('team_join_requests')
                .insert({
                    team_id: targetTeamId,
                    user_id: authUser.id, // RLS policy checks this
                    status: 'pending'
                });

            if (insertError) {
                 if (insertError.message.includes('unique_pending_request')) {
                     setHasPendingRequest(true); // Ensure UI reflects existing request
                     throw new Error("You already have a pending request for this team.");
                 } else if (insertError.message.includes('violates row-level security policy')) {
                     // RLS blocked it - maybe user became member/owner somehow? Recheck state.
                     const { data: memberCheck } = await supabase.from('team_members').select('user_id').eq('team_id', targetTeamId).eq('user_id', authUser.id).maybeSingle();
                     if (memberCheck) setIsMember(true);
                     else { // Check if owner just in case
                         const { data: ownerCheckData } = await supabase.from('teams').select('owner_id').eq('id', targetTeamId).eq('owner_id', authUser.id).maybeSingle();
                         if (ownerCheckData) setIsOwner(true);
                     }
                     throw new Error("Cannot send request (already owner/member or permission issue).");
                 }
                throw insertError; // Other DB errors
            }

            console.log("[TeamPage] Join request sent successfully.");
            setHasPendingRequest(true); // Update UI state

        } catch (err) {
            console.error("Error sending join request:", err);
            setJoinRequestError(`Failed to send request: ${err.message}`);
        } finally {
            setIsRequestingJoin(false);
        }
    };
    // ---

     // --- Render Loading State ---
     if (loading) {
         return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl text-gray-400">Loading Team...</p> </div> );
    }

    // --- Render Error State / Not Found ---
    if (error) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Team</h2> <p className="text-gray-400">{error}</p> <Link to="/players?view=teams" className="mt-6 btn-secondary"> Back to Teams </Link> </div> );
    }

     if (!teamData) { return <Navigate to="/players?view=teams" replace />; } // Redirect if no team data after loading

    // --- Calculations ---
    const teamGame = teamData.game;
    const currentLikes = teamData.likes ?? 0;

    return (
        <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white min-h-screen relative overflow-hidden z-10">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] z-[-1]"></div>
            <div className="absolute inset-0 bg-radial-gradient-to-tl from-transparent via-primary-900/5 to-transparent animate-pulse-slow"></div>

            <div className="max-w-full mx-auto space-y-8 lg:space-y-10 pb-10 relative z-10">

                {/* --- Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl bg-dark-800">
                    <img src={teamData.banner_url || '/images/lan_9.jpg'} alt={`${teamData.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-sm scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                         <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                             {/* Team Logo */}
                             <div className="relative -mt-16 sm:-mt-12 flex-shrink-0">
                                 <img src={teamData.logo_url || '/images/placeholder_team.png'} alt={teamData.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary-500 bg-dark-800 shadow-lg"/>
                             </div>
                             {/* Team Info */}
                             <div className="flex-grow text-center sm:text-left mb-2">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md mb-1">{teamData.name}</h1>
                                <p className="text-lg sm:text-xl text-primary-400 font-semibold mb-2">{teamData.game}</p>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-gray-400 text-sm">
                                    {(teamData.city || teamData.country) && ( <span className="flex items-center"><MapPin size={14} className="mr-1 text-red-500" /> {teamData.city ? `${teamData.city}, ` : ''}{teamData.country || ''}</span> )}
                                    {teamData.created_at && ( <span className="flex items-center"><Calendar size={14} className="mr-1" /> Founded {new Date(teamData.created_at).toLocaleDateString()}</span> )}
                                    <span className="flex items-center"> <Heart size={14} className="mr-1 text-red-500 fill-current"/> {currentLikes} Likes </span>
                                </div>
                             </div>
                             {/* Action Buttons Container */}
                             <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0 mt-3 sm:mt-0">
                                <div className="flex gap-3">
                                    {/* Manage/Leave/Join/Pending Button */}
                                    {isOwner ? (
                                        <Link to={`/manage-team/${teamData.id}`} className="btn-primary text-sm flex items-center"><Settings className="mr-1.5" size={16} /> Manage</Link>
                                    ) : isMember ? (
                                        <button className="btn-danger text-sm flex items-center"><LogOut className="mr-1.5 rotate-180" size={16} /> Leave</button> // TODO: Leave logic
                                    ) : authUser ? (
                                        hasPendingRequest ? (
                                            <button className="btn-secondary text-sm flex items-center italic opacity-70 cursor-default" disabled> <ClockIcon className="mr-1.5" size={16} /> Pending</button>
                                        ) : (
                                            <button
                                                onClick={handleRequestToJoin}
                                                disabled={isRequestingJoin}
                                                className="btn-secondary text-sm flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isRequestingJoin ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin"/> : <UserPlus className="mr-1.5" size={16} />}
                                                {isRequestingJoin ? 'Sending...' : 'Request Join'}
                                            </button>
                                        )
                                    ) : null /* Not logged in */}

                                     {/* Like Button (Show if logged in AND not owner) */}
                                     {authUser && !isOwner && (
                                         <button
                                             onClick={handleLikeTeam}
                                             disabled={isLiking || hasLiked} // Disable if liking or already liked
                                             className={`btn-secondary text-sm flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed group ${
                                                 hasLiked ? 'bg-red-600/30 border border-red-500/50 text-red-300 pointer-events-none' : 'hover:bg-red-500/20 hover:text-red-300'
                                             }`}
                                             title={hasLiked ? "You already liked this team" : "Like this team"}
                                         >
                                             {isLiking ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <Heart className={`w-4 h-4 mr-1 ${hasLiked ? 'fill-current text-red-500' : 'text-gray-400 group-hover:text-red-400'}`}/>}
                                             {hasLiked ? 'Liked' : 'Like'}
                                         </button>
                                     )}
                                </div>
                                {/* Display Like or Join Error */}
                                {(likeError || joinRequestError) && <p className="text-xs text-red-400 mt-1 text-right">{likeError || joinRequestError}</p>}
                             </div>
                         </div>
                    </div>
                </AnimatedSection>

                {/* --- Main Content Grid --- */}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                     {/* Left Column */}
                     <div className="lg:col-span-2 space-y-8 lg:space-y-10">
                        {/* Team Stats Overview */}
                        <AnimatedSection delay={100} className="card bg-dark-800 p-5 rounded-xl shadow-lg">
                           {/* --- UPDATED: "Quick Stats" is now "Overall Stats" --- */}
                           <h2 className="text-2xl font-bold text-primary-300 mb-4">Overall Stats</h2>
                           {teamStats ? (
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                    <div><div className="text-3xl font-bold text-blue-400">{teamStats.totalMatches}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Matches</div></div>
                                    <div><div className="text-3xl font-bold text-green-400">{teamStats.totalWins}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Wins</div></div>
                                    <div><div className="text-3xl font-bold text-red-400">{teamStats.totalKills}</div><div className="text-gray-400 text-xs uppercase tracking-wider">Kills</div></div>
                                    <div><div className="text-3xl font-bold text-blue-400">{teamStats.winRate}%</div><div className="text-gray-400 text-xs uppercase tracking-wider">Win Rate</div></div>
                                </div>
                           ) : (
                                <p className="text-gray-500 text-center text-sm py-2">No tournament stats recorded yet.</p>
                           )}
                        </AnimatedSection>

                        {/* Team Description */}
                        {teamData.description && ( <AnimatedSection delay={150} className="card bg-dark-800 p-6 rounded-xl shadow-lg"> <h2 className="text-2xl font-bold text-primary-300 mb-3">About {teamData.name}</h2> <p className="text-gray-300 italic leading-relaxed">{teamData.description}</p> </AnimatedSection> )}

                        {/* Team Members */}
                        <AnimatedSection delay={200} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Active Roster ({members.length})</h2>
                             {members.length > 0 ? (
                                 <div className="space-y-5">
                                     {members.map((member, index) => {
                                         // --- UPDATED: Get IGN/UID and Profile Stats ---
                                         const profile = member.profiles;
                                         if (!profile) return null; // Skip if profile is missing

                                         const memberGameDetails = profile.game_details?.[teamGame];
                                         const memberWins = profile.total_wins ?? 0;
                                         const memberLosses = profile.total_losses ?? 0;
                                         const memberTotal = memberWins + memberLosses;
                                         const memberWinRate = memberTotal > 0 ? Math.round((memberWins / memberTotal) * 100) : 0;
                                         // ---
                                         
                                         return (
                                             <AnimatedSection key={member.user_id || index} delay={index * 50} className="bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:bg-dark-700/80 border border-dark-600 hover:border-primary-600/50">
                                                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
                                                     <Link to={`/profile/${profile.username}`} className="flex items-center flex-grow w-full sm:w-auto group">
                                                         <img src={profile.avatar_url || '/images/placeholder_player.png'} alt={profile.username} className="w-12 h-12 rounded-full mr-4 border border-primary-500/50 flex-shrink-0 object-cover group-hover:ring-2 group-hover:ring-primary-400 transition-all" />
                                                         <div>
                                                             <span className="font-semibold text-lg text-white group-hover:text-primary-300 transition-colors block">{profile.username}</span>
                                                             <span className="text-primary-400 font-medium text-sm block">{member.role}</span>
                                                         </div>
                                                     </Link>
                                                     
                                                     <div className="text-left sm:text-right text-sm w-full sm:w-auto flex-shrink-0">
                                                        <p className="text-xs text-gray-500">Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
                                                     </div>
                                                 </div>
                                                 
                                                 {/* --- REPLACEMENT: Show IGN/UID and Personal Stats --- */}
                                                 <div className="space-y-2 border-t border-dark-600 pt-3">
                                                     {(memberGameDetails?.ign || memberGameDetails?.uid) ? (
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                                                            {memberGameDetails.ign && (
                                                                <div className="flex items-center text-gray-300" title={`${teamGame} In-Game Name`}> <Gamepad2 size={14} className="mr-1.5 text-primary-400 flex-shrink-0"/> <span className="font-medium">{memberGameDetails.ign}</span> </div>
                                                            )}
                                                            {memberGameDetails.uid && (
                                                                <div className="flex items-center text-gray-300" title={`${teamGame} User ID`}> <User size={14} className="mr-1.5 text-primary-400 flex-shrink-0"/> <span className="font-medium">{memberGameDetails.uid}</span> </div>
                                                            )}
                                                        </div>
                                                     ) : (
                                                        <p className="text-gray-500 italic text-sm">No {teamGame} IGN/UID provided.</p>
                                                     )}
                                                     
                                                     {/* Personal Profile Stats */}
                                                     <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm pt-2 border-t border-dark-600/50">
                                                        <div className="flex items-center text-gray-300" title="Personal Profile Win Rate">
                                                            <BarChart size={14} className="mr-1.5 text-blue-400"/>
                                                            <span className="font-bold text-blue-400">{memberWinRate}%</span>&nbsp;Win Rate
                                                        </div>
                                                        <div className="flex items-center text-gray-300" title="Personal Profile Wins">
                                                            <Trophy size={14} className="mr-1.5 text-green-400"/>
                                                            <span className="font-bold text-green-400">{memberWins}</span>&nbsp;Wins
                                                        </div>
                                                        <div className="flex items-center text-gray-300" title="Personal Profile Losses">
                                                            <UserX size={14} className="mr-1.5 text-red-400"/>
                                                            <span className="font-bold text-red-400">{memberLosses}</span>&nbsp;Losses
                                                        </div>
                                                     </div>
                                                 </div>
                                                 {/* --- End Replacement --- */}

                                             </AnimatedSection>
                                         );
                                     })}
                                 </div>
                             ) : ( <p className="text-gray-400 text-center py-4">This team has no members yet (besides the owner).</p> )}
                         </AnimatedSection>

                         {/* --- UPDATED: Recent Matches --- */}
                         <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Recent Matches</h2>
                             <div className="space-y-4">
                                 {recentMatches.length > 0 ? (
                                     recentMatches.map((match, index) => (
                                         <div key={match.id || index} className="bg-dark-700/50 p-3 rounded-lg border border-dark-600">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs text-gray-400">{match.game} - <span className="font-semibold">{match.tournamentName}</span></p>
                                                <p className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <p className="text-sm">
                                                    Result: <span className={`font-bold text-lg ${match.placement === 1 ? 'text-green-400' : 'text-primary-400'}`}>
                                                        {match.placement === 1 ? 'Win' : `#${match.placement}`}
                                                    </span>
                                                </p>
                                                <p className="text-sm">
                                                    Kills: <span className="font-bold text-lg text-red-400">{match.kills}</span>
                                                </p>
                                            </div>
                                         </div>
                                     ))
                                 ) : (
                                    <p className="text-gray-500 text-center py-2">No recent matches found.</p>
                                 )}
                             </div>
                         </AnimatedSection>

                     </div> {/* End Left Column */}

                     {/* Right Column */}
                     <div className="space-y-8 lg:sticky lg:top-24 self-start">
                         
                         {/* --- UPDATED: Upcoming Events --- */}
                         <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Upcoming Events</h2>
                             <div className="space-y-3">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map(event => (
                                        <Link key={event.id} to={`/tournament/${event.id}`} className="block bg-dark-700/50 p-3 rounded-lg hover:bg-dark-700/80 border border-dark-600 hover:border-primary-600/50 transition-colors">
                                            <p className="font-semibold text-white group-hover:text-primary-300">{event.name}</p>
                                            <p className="text-sm text-gray-400">Starts: {new Date(event.startDate).toLocaleDateString()}</p>
                                        </Link>
                                    ))
                                ) : (
                                    <p className='text-sm text-gray-400 italic text-center py-2'>No upcoming events scheduled.</p>
                                )}
                             </div>
                         </AnimatedSection>

                          {/* Team Owner */}
                         {teamData.owner && (
                              <AnimatedSection delay={550} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                                 <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Team Owner</h2>
                                 <Link to={`/profile/${teamData.owner.username}`} className="flex items-center group">
                                     <img src={teamData.owner.avatar_url || '/images/placeholder_player.png'} alt={teamData.owner.username} className="w-10 h-10 rounded-full mr-3 border border-dark-600 object-cover" />
                                     <span className="font-medium text-gray-200 group-hover:text-primary-300">{teamData.owner.username}</span>
                                 </Link>
                              </AnimatedSection>
                         )}
                         {/* Contact Button */}
                         <AnimatedSection delay={600} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Contact Team</h2>
                             <button className="w-full btn-primary flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"> <Mail className="mr-2" size={16} /> Send Message </button>
                         </AnimatedSection>
                     </div> {/* End Right Column */}
                 </div> {/* End Main Grid */}

                 {/* Achievements */}
                 {teamData.achievements && teamData.achievements.length > 0 && (
                     <AnimatedSection delay={700} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 card bg-dark-800 mt-8 p-6 rounded-xl shadow-lg">
                         <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Team Achievements</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {teamData.achievements.map((achievement, index) => {
                                 const IconComponent = achievement.icon || Star;
                                 return (
                                     <div key={index} className="bg-dark-700/50 p-4 rounded-lg flex flex-col justify-between border-l-4 border-yellow-500/70 shadow-md">
                                         <div className="flex items-start space-x-3 mb-2">
                                             <IconComponent className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                                             <div>
                                                 <p className="font-semibold text-lg text-white leading-tight">{achievement.title}</p>
                                                 <p className="text-sm text-gray-400">{achievement.description}</p>
                                             </div>
                                         </div>
                                         <p className="text-xs text-gray-500 italic text-right">Achieved: {new Date(achievement.date).toLocaleDateString()}</p>
                                     </div>
                                 );
                             })}
                         </div>
                     </AnimatedSection>
                 )}

            </div> {/* End Page Container */}
        </div>
    );
}