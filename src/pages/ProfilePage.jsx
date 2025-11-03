// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
// Import Heart icon and ThumbsUp (optional alternative)
import { User, Edit3, Trophy, Users, Calendar, MapPin, Star, Mail, Phone, Clock, Coins, Percent, Gamepad2, FileText, Eye, Search, ArrowRight, Loader2, AlertCircle, Heart, BarChart, Crosshair } from 'lucide-react'; // Added BarChart, Crosshair
import { Link, Navigate, useParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

// Helper function
const normalizeUrl = (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

// --- NEW: Helper function to fetch user's teams (owned & member) ---
const fetchUserTeams = async (userId) => {
    try {
        // 1. Get teams user owns
        const { data: ownedTeamsData, error: ownedError } = await supabase
            .from('teams')
            .select('*')
            .eq('owner_id', userId);

        if (ownedError) console.error('Error fetching owned teams:', ownedError.message);

        // 2. Get teams user is a member of
        const { data: memberTeamsData, error: memberError } = await supabase
            .from('team_members')
            .select('role, teams(*)') // Fetches role and all team data
            .eq('user_id', userId);
        
        if (memberError) console.error('Error fetching member teams:', memberError.message);

        // 3. Combine and deduplicate
        const ownedTeams = (ownedTeamsData || []).map(t => ({ ...t, role: 'Owner' }));
        const memberTeams = (memberTeamsData || []).map(m => ({ ...m.teams, role: m.role }));

        const teamMap = new Map();
        // Add member teams first
        memberTeams.forEach(t => t && teamMap.set(t.id, t));
        // Add owned teams (will overwrite member entry if user is both, prioritizing Owner role)
        ownedTeams.forEach(t => t && teamMap.set(t.id, t));

        return Array.from(teamMap.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    } catch (error) {
        console.error("Error in fetchUserTeams:", error.message);
        return [];
    }
};

// --- NEW: Helper function to fetch all tournament stats & matches ---
const fetchUserStats = async (userId) => {
    try {
        // 1. Get all team IDs for the user
        const { data: teamsAsMember } = await supabase.from('team_members').select('team_id').eq('user_id', userId);
        const { data: teamsAsOwner } = await supabase.from('teams').select('id').eq('owner_id', userId);
        
        const allTeamIds = [
            ...(teamsAsMember ? teamsAsMember.map(t => t.team_id) : []),
            ...(teamsAsOwner ? teamsAsOwner.map(t => t.id) : [])
        ];
        const uniqueTeamIds = [...new Set(allTeamIds)];

        if (uniqueTeamIds.length === 0) {
            // No teams, so no stats
            return { recentMatches: [], stats: null };
        }

        // 2. Get all participant records for those teams
        const { data: participantRecords, error: pError } = await supabase
            .from('tournament_participants')
            .select('id, team_name, tournaments(id, game, name)') // Get tournament info
            .in('team_id', uniqueTeamIds);
        
        if (pError) throw pError;
        if (!participantRecords || participantRecords.length === 0) {
            return { recentMatches: [], stats: null };
        }

        const participantIds = participantRecords.map(p => p.id);

        // 3. Get all match results for these participants
        const { data: matchResults, error: resultsError } = await supabase
            .from('match_results')
            .select('*')
            .in('participant_id', participantIds)
            .order('created_at', { ascending: false }); // Order by creation date for "recent"

        if (resultsError) throw resultsError;
        
        const results = matchResults || [];

        // 4. Calculate Stats
        let totalKills = 0;
        let totalPlacementSum = 0;
        let totalWins = 0;
        results.forEach(r => {
            totalKills += r.kills || 0;
            totalPlacementSum += r.placement || 0;
            if (r.placement === 1) totalWins++;
        });
        
        const totalMatches = results.length;
        const totalLosses = totalMatches - totalWins;
        const stats = {
            totalKills: totalKills,
            totalMatches: totalMatches,
            avgPlacement: totalMatches > 0 ? (totalPlacementSum / totalMatches).toFixed(1) : 0,
            totalWins: totalWins,
            totalLosses: totalLosses,
            winRate: totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0
        };

        // 5. Format Recent Matches
        const recentMatches = results.slice(0, 5).map(r => {
            const participant = participantRecords.find(p => p.id === r.participant_id);
            return {
                id: r.id,
                game: participant?.tournaments?.game || 'Unknown Game',
                tournamentName: participant?.tournaments?.name || 'Unknown Tournament',
                teamName: participant?.team_name || 'Unknown Team',
                placement: r.placement,
                kills: r.kills,
                date: r.created_at
            };
        });
        
        return { recentMatches, stats };

    } catch (error) {
        console.error("Error in fetchUserStats:", error.message);
        return { recentMatches: [], stats: null };
    }
};


export default function ProfilePage() {
    const { username: usernameParam } = useParams();
    const { user: authUser, session, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    // State for Liking
    const [hasLiked, setHasLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [likeError, setLikeError] = useState(null);
    // ---
    
    // --- NEW: State for dynamic data ---
    const [teams, setTeams] = useState([]);
    const [recentMatches, setRecentMatches] = useState([]);
    const [gameStats, setGameStats] = useState(null); // For stats from tournaments
    // ---

    useEffect(() => {
        let isMounted = true;

        const fetchAllProfileData = async () => {
             if (!isMounted) return;
            setLoading(true);
            setError(null);
            setLikeError(null);
            setHasLiked(false);
            setProfile(null);
            // --- NEW: Reset dynamic state ---
            setTeams([]);
            setRecentMatches([]);
            setGameStats(null);
            // ---

            try {
                let query;
                let targetUserId = null;

                // Determine target profile ID
                if (usernameParam) {
                    console.log(`[ProfilePage] Fetching profile ID for username: ${usernameParam}`);
                    const { data: profileDataMinimal, error: findError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('username', usernameParam)
                        .maybeSingle();

                    if (findError && !(findError.message.includes('0 rows'))) throw findError;
                    if (!profileDataMinimal) throw new Error(`Profile not found for user "${usernameParam}".`);
                    targetUserId = profileDataMinimal.id;

                } else if (authUser) {
                    console.log(`[ProfilePage] Using logged-in user ID: ${authUser.id}`);
                    targetUserId = authUser.id;
                } else {
                    throw new Error("User not logged in."); // Cannot view any profile if not logged in and no username given
                }

                 // Fetch full profile data using the determined targetUserId
                console.log(`[ProfilePage] Fetching full profile for ID: ${targetUserId}`);
                query = supabase.from('profiles').select('*').eq('id', targetUserId).single();
                const { data, error: profileError } = await query;

                // Handle profile fetch errors (including not found after ID lookup)
                if (profileError && !(profileError.message.includes('0 rows'))) throw profileError;
                if (!data) throw new Error("Profile data could not be loaded.");


                 if (isMounted) {
                    console.log("[ProfilePage] Fetched profile data:", data);
                    const isCurrentUserProfile = authUser && data.id === authUser.id;
                    setIsOwnProfile(isCurrentUserProfile);

                    const enhancedData = {
                        ...data,
                        email: isCurrentUserProfile ? authUser.email : 'Protected',
                        joinDate: isCurrentUserProfile ? authUser.created_at : data.created_at,
                        favoriteGames: data.favorite_games || [],
                        gameDetails: data.game_details || {}, // --- This is for Game Profiles
                        socialLinks: data.social_links || {},
                        credits: data.credits ?? 0,
                        totalWins: data.total_wins ?? 0, // Fallback stats
                        totalLosses: data.total_losses ?? 0, // Fallback stats
                        avatar: data.avatar_url || '/images/ava_m_1.png',
                        banner: data.banner_url || '/images/lan_3.jpg',
                    };
                    setProfile(enhancedData);

                    // --- NEW: Fetch Teams and Stats in parallel ---
                    const [teamsResult, statsResult] = await Promise.all([
                        fetchUserTeams(targetUserId),
                        fetchUserStats(targetUserId)
                    ]);
            
                    if (isMounted) {
                        console.log("[ProfilePage] Fetched Teams:", teamsResult);
                        setTeams(teamsResult);
                        
                        console.log("[ProfilePage] Fetched Stats:", statsResult);
                        setRecentMatches(statsResult.recentMatches);
                        setGameStats(statsResult.stats);
                    }
                    // ---

                    // Fetch Like Status if applicable
                    if (authUser && !isCurrentUserProfile && targetUserId) {
                         console.log(`[ProfilePage] Checking like status for profile ${targetUserId} by user ${authUser.id}`);
                         const { data: likeData, error: likeError } = await supabase
                            .from('profile_likes')
                            .select('profile_id')
                            .eq('profile_id', targetUserId)
                            .eq('liker_id', authUser.id)
                            .maybeSingle();

                         if (likeError && isMounted) {
                            console.error("Error checking like status:", likeError);
                         } else if (likeData && isMounted) {
                             console.log("[ProfilePage] User has already liked this profile.");
                             setHasLiked(true);
                         } else if(isMounted) {
                             console.log("[ProfilePage] User has not liked this profile.");
                             setHasLiked(false);
                         }
                    }
                 }

            } catch (err) {
                console.error('[ProfilePage] Error during fetch:', err.message);
                 if (isMounted) setError(err.message === "User not logged in." ? err.message : `Failed to load profile: ${err.message}`);
            } finally {
                 if (isMounted) setLoading(false);
            }
        };

        // Trigger fetch only when auth state is resolved and we have a target (param or logged-in user)
        if (!authLoading && (usernameParam || authUser)) {
            fetchAllProfileData();
        } else if (!authLoading && !usernameParam && !authUser) {
            // No target and not logged in - error state handled by redirect check later
             if(isMounted) {
                 setError("User not logged in.");
                 setLoading(false);
             }
        }

        return () => { isMounted = false; };

    }, [authUser, authLoading, usernameParam]);

    // --- (Placeholder Teams/Matches removed) ---
    // ---

    // --- Handle Like Button Click (Use RPC) ---
    const handleLikeProfile = async () => {
        if (!authUser) {
            setLikeError("You must be logged in to like a profile.");
            return;
        }
        if (isOwnProfile || !profile || !profile.id) {
            setLikeError("Cannot like this profile.");
            return;
        }
        if (hasLiked) {
             console.log("Already liked.");
             setLikeError("You have already liked this profile."); // Give feedback
            return;
        }

        setIsLiking(true);
        setLikeError(null);
        console.log(`[ProfilePage] Calling RPC 'increment_like' for profile ID: ${profile.id}`);

        try {
            // Call the Supabase RPC function
            const { data, error: rpcError } = await supabase.rpc('increment_like', {
                profile_user_id: profile.id // Pass the profile ID to the function
            });

            if (rpcError) {
                 console.error("RPC Error:", rpcError);
                 throw new Error(rpcError.message || "Database function error.");
            }

            console.log("RPC Response:", data);

            // Check the response from the function
            if (data && data.success) {
                // Optimistic UI update for the count
                setProfile(prevProfile => ({
                    ...prevProfile,
                    credits: (prevProfile?.credits ?? 0) + 1
                }));
                setHasLiked(true); // Mark as liked in UI state
            } else {
                // Show message from function if like wasn't successful (e.g., already liked, self-like attempt)
                setLikeError(data?.message || "Could not like profile.");
                // Optionally re-check like status if message indicates already liked
                if (data?.message?.includes("already liked")) {
                     setHasLiked(true);
                }
            }

        } catch (err) {
            console.error("Error calling increment_like function:", err);
            setLikeError(`Failed to like profile: ${err.message}`);
        } finally {
            setIsLiking(false);
        }
    };
    // ---

    // --- Render Loading State ---
    if (loading) {
         return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl">Loading Profile...</p> </div> );
    }

    // --- Render Error State / Redirect ---
    if (error || !profile) {
        if (error === "User not logged in.") {
            return <Navigate to="/login" replace />;
        }
        return <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Profile</h2> <p className="text-gray-400">{error || 'Profile data unavailable.'}</p> <Link to="/players" className="mt-6 btn-secondary"> Back to Players </Link> </div>;
    }


    // --- Calculate Win Rate (Use new stats if available, else fallback) ---
    const totalWins = gameStats ? gameStats.totalWins : (profile.totalWins ?? 0);
    const totalLosses = gameStats ? gameStats.totalLosses : (profile.totalLosses ?? 0);
    const winRate = totalWins + totalLosses > 0
      ? Math.round((totalWins / (totalWins + totalLosses)) * 100)
      : 0;

    // --- Render Profile ---
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Profile Header */}
                <AnimatedSection tag="div" className="relative rounded-xl overflow-hidden shadow-2xl" delay={0}>
                    {/* Banner */}
                     <div className="w-full h-48 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${profile.banner || '/images/lan_3.jpg'})` }}>
                         <div className="absolute inset-0 bg-dark-900/40"></div>
                     </div>
                    {/* Content Layer */}
                    <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-32 md:-mt-24">
                        {/* Avatar */}
                         <div className="relative flex-shrink-0 mb-4 md:mb-0">
                             <img src={profile.avatar || '/images/ava_m_1.png'} alt={profile.fullName || profile.username} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-dark-900 shadow-xl ring-4 ring-primary-500/50" />
                              {profile.verified && ( <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-dark-900"> <Star className="w-4 h-4 text-white" /> </div> )}
                         </div>
                        {/* User Details and Stats */}
                        <div className="flex-1 text-center md:text-left w-full pt-4">
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
                                <div>
                                     <h1 className="text-3xl font-bold text-white mb-1">{profile.username || 'N/A'}</h1>
                                     <p className="text-xl text-gray-300 mb-2">{profile.fullName || ''}</p>
                                     <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm mb-2"> <MapPin size={14} className="mr-1" /> {profile.city && profile.country ? `${profile.city}, ${profile.country}` : (profile.country || 'Location not set')} </div>
                                </div>
                                {/* Action Buttons: Edit or Like */}
                                <div className="flex flex-col items-center self-center md:self-end mt-4 md:mt-0 flex-shrink-0">
                                    <div className="flex gap-3 items-center">
                                        {isOwnProfile ? (
                                            <Link to="/edit-profile" className="btn-primary flex items-center px-4 py-2"> <Edit3 className="mr-2" size={16} /> Edit Profile </Link>
                                        ) : authUser ? (
                                            <button
                                                onClick={handleLikeProfile}
                                                disabled={isLiking || hasLiked} // Disable if liking or already liked
                                                className={`btn-secondary flex items-center px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                                                    hasLiked ? 'bg-red-600/30 border border-red-500/50 text-red-300 pointer-events-none' : 'hover:bg-red-500/20 hover:text-red-300'
                                                }`}
                                                title={hasLiked ? "You already liked this profile" : "Like this profile"}
                                            >
                                                {isLiking ? (
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                ) : (
                                                    // Show filled heart if liked
                                                    <Heart className={`w-5 h-5 mr-2 ${hasLiked ? 'fill-current text-red-500' : 'text-gray-400'}`} />
                                                )}
                                                {/* Change text based on liked state */}
                                                {hasLiked ? 'Liked' : 'Like'}
                                            </button>
                                        ) : null }
                                    </div>
                                    {/* Display Like Error below the button */}
                                    {likeError && !isOwnProfile && <p className="text-xs text-red-400 mt-1 text-center md:text-right">{likeError}</p>}
                                </div>
                            </div>
                            {/* Stats Section (Using Heart for Likes/Credits) --- UPDATED with dynamic stats --- */}
                            <AnimatedSection tag="div" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center bg-dark-800/80 p-4 rounded-lg border border-dark-700/50" delay={50}>
                                <div>
                                    <div className="text-2xl font-bold text-primary-400 flex items-center justify-center">
                                        <Heart className="w-5 h-5 mr-1 fill-current text-red-500"/>
                                        {profile.credits}
                                    </div>
                                    <div className="text-gray-400 text-sm">Likes</div>
                                </div>
                                <div><div className="text-2xl font-bold text-green-400">{totalWins}</div><div className="text-gray-400 text-sm">Wins</div></div>
                                <div><div className="text-2xl font-bold text-red-400">{totalLosses}</div><div className="text-gray-400 text-sm">Losses</div></div>
                                <div><div className="text-2xl font-bold text-blue-400">{winRate}%</div><div className="text-gray-400 text-sm">Win Rate</div></div>
                            </AnimatedSection>
                            {/* Bio */}
                            <AnimatedSection tag="p" className="text-gray-300 mb-4 bg-dark-800/80 p-3 rounded-lg border border-dark-700/50" delay={100}>{profile.bio || 'No bio provided.'}</AnimatedSection>
                            {/* Favorite Games */}
                            <AnimatedSection tag="div" className="flex flex-wrap gap-2 justify-center md:justify-start" delay={150}>
                                {profile.favoriteGames?.map((game) => ( <span key={game} className="bg-primary-900 text-primary-200 px-3 py-1 rounded-full text-sm font-medium border border-primary-700"> {game} </span> ))}
                                {profile.favoriteGames?.length === 0 && <span className="text-gray-500 text-sm italic">No favorite games added.</span>}
                            </AnimatedSection>
                        </div>
                    </div>
                </AnimatedSection>

                 {/* Button to Players Directory */}
                 <AnimatedSection delay={180} className="text-center">
                     <Link to="/players" className="inline-flex items-center btn-secondary px-6 py-2 group hover:bg-dark-700 transition-colors">
                         <Search size={18} className="mr-2 text-primary-400 group-hover:text-primary-300" />
                         Find Other Players
                         <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                     </Link>
                 </AnimatedSection>

                 {/* Main Content & Sidebar Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* --- UPDATED: Recent Matches --- */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={200}>
                            <h2 className="text-2xl font-bold mb-6 text-primary-300">Recent Matches</h2>
                            {recentMatches.length > 0 ? (
                                <div className="space-y-4">
                                    {recentMatches.map(match => (
                                         <div key={match.id} className="bg-dark-700 p-3 rounded-lg border border-dark-600">
                                             <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs text-gray-400">{match.game} - {match.tournamentName}</p>
                                                    <p className="font-medium text-white">
                                                        Team: <span className="text-primary-300">{match.teamName}</span>
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">{new Date(match.date).toLocaleDateString()}</p>
                                             </div>
                                             <div className="flex gap-4 mt-2 pt-2 border-t border-dark-600">
                                                <p className="text-sm">
                                                    Placement: <span className="text-primary-400 font-bold text-base">#{match.placement}</span>
                                                </p>
                                                <p className="text-sm">
                                                    Kills: <span className="text-red-400 font-bold text-base">{match.kills}</span>
                                                </p>
                                             </div>
                                         </div>
                                    ))}
                                </div>
                             ) : ( <p className="text-gray-400 text-center py-4">No recent match history from tournaments.</p> )}
                            {recentMatches.length > 0 && profile.username && ( <div className="text-center mt-4"> <Link to={`/profile/${profile.username}/matches`} className="text-primary-400 hover:text-primary-300 text-sm font-medium"> View All Matches </Link> </div> )}
                        </AnimatedSection>

                        {/* --- UPDATED: Teams Section --- */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={300}>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-dark-700 pb-3">
                                <h2 className="text-2xl font-bold text-primary-300 mb-3 sm:mb-0">Teams</h2>
                                {isOwnProfile && (
                                    <Link to="/my-teams" className="btn-secondary text-sm flex items-center group">
                                        <Users size={16} className="mr-2" />
                                        Manage My Teams
                                        <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                )}
                            </div>
                            {teams.length > 0 ? (
                                <div className="space-y-4">
                                {teams.map((team, index) => (
                                    <AnimatedSection key={team.id} tag="div" className="bg-dark-900 border border-dark-700 rounded-lg p-4 hover:border-primary-500/50 transition-colors" delay={index * 50}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                        <img src={team.logo_url || '/images/placeholder_team.png'} alt={`${team.name} logo`} className="w-10 h-10 rounded-md mr-4 border border-dark-600 object-cover"/>
                                        <div>
                                            <Link to={`/team/${team.id}`} className="font-semibold hover:text-primary-400 transition-colors">{team.name}</Link>
                                            <p className="text-sm text-gray-400">{team.game}</p>
                                        </div>
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full font-medium ${team.role === 'Owner' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-primary-700 text-primary-100'}`}>{team.role}</span>
                                    </div>
                                    </AnimatedSection>
                                ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-4">{isOwnProfile ? 'You have not' : 'This user has not'} created or joined any teams.</p>
                            )}
                        </AnimatedSection>


                         {/* --- UPDATED: Game Profiles --- */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={400}>
                            <h2 className="text-2xl font-bold mb-6 text-primary-300 flex items-center"><Gamepad2 size={20} className="mr-2"/> Game Profiles</h2>
                            {profile.gameDetails && Object.keys(profile.gameDetails).length > 0 && Object.values(profile.gameDetails).some(d => d.ign || d.uid) ? (
                                <div className="space-y-4">
                                    {Object.entries(profile.gameDetails).map(([game, details]) => (
                                        (details.ign || details.uid) && ( // Only show if there is data
                                            <div key={game} className="bg-dark-900 border border-dark-700 rounded-lg p-3">
                                                <p className="font-semibold text-primary-400 text-base">{game}</p>
                                                <div className="pl-2 space-y-1 mt-1">
                                                    {details.ign && <p className="text-sm text-gray-300">IGN: <span className="font-medium text-white">{details.ign}</span></p>}
                                                    {details.uid && <p className="text-sm text-gray-300">UID: <span className="font-medium text-white">{details.uid}</span></p>}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic text-center py-2">No in-game profiles added. {isOwnProfile && <Link to="/edit-profile" className="text-primary-400 hover:underline">Add them now</Link>}</p>
                            )}
                        </AnimatedSection>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Information */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={500}>
                           <h2 className="text-xl font-bold mb-4 text-primary-300">Contact & Info</h2>
                            <div className="space-y-3 text-sm">
                                <p className="flex items-center"><Mail size={14} className="mr-2 text-primary-400"/> {profile.email}</p>
                                <p className="flex items-center"><Phone size={14} className="mr-2 text-primary-400"/> {profile.phone || 'Not provided'}</p>
                                <p className="flex items-center"><Calendar size={14} className="mr-2 text-primary-400"/> Joined: {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString() : 'N/A'}</p>
                           </div>
                        </AnimatedSection>
                        {/* Social Links */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={600}>
                           <h2 className="text-xl font-bold mb-4 text-primary-300">Social Links</h2>
                           <p className="text-gray-400 text-sm">Social media links will appear here.</p>
                           {/* TODO: Render profile.socialLinks */}
                        </AnimatedSection>
                         {/* --- UPDATED: Game Stats (Sidebar) --- */}
                        <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={700}>
                             <h2 className="text-xl font-bold mb-4 text-primary-300">Tournament Statistics</h2>
                             {gameStats ? (
                                <div className="space-y-3 text-sm">
                                    <p className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><BarChart size={14} className="mr-1.5"/>Total Matches:</span> <span className="font-bold text-lg text-white">{gameStats.totalMatches}</span></p>
                                    <p className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><Trophy size={14} className="mr-1.5"/>Total Wins:</span> <span className="font-bold text-lg text-green-400">{gameStats.totalWins}</span></p>
                                    <p className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><Crosshair size={14} className="mr-1.5"/>Total Kills:</span> <span className="font-bold text-lg text-red-400">{gameStats.totalKills}</span></p>
                                    <p className="flex items-center justify-between"><span className="text-gray-400 flex items-center"><Percent size={14} className="mr-1.5"/>Avg. Placement:</span> <span className="font-bold text-lg text-blue-400">#{gameStats.avgPlacement}</span></p>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic text-center py-2">No tournament statistics found.</p>
                            )}
                        </AnimatedSection>
                    </div>
                </div>
            </div>
        </div>
    );
}
