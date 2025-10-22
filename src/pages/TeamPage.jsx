// src/pages/TeamPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
// Added necessary icons for stats and actions
import { Users, Trophy, Calendar, MapPin, Star, Mail, UserPlus, Settings, BarChart, Percent, Crosshair, Loader2, AlertCircle, Gamepad2, User, UserX, LogOut } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function TeamPage() {
    const { teamId } = useParams();
    const { user: authUser } = useAuth();
    const [teamData, setTeamData] = useState(null); // State for main team data
    const [members, setMembers] = useState([]); // State for members list
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false); // State to check if current user is a member

    // --- Fetch Team Data & Members ---
    useEffect(() => {
        let isMounted = true; // Prevent state updates if component unmounts
        const fetchTeamAndMembers = async () => {
            if (!teamId) {
                if(isMounted) { setError("No team ID provided."); setLoading(false); }
                return;
            }

            if(isMounted) { setLoading(true); setError(null); }
            console.log(`TeamPage: Fetching data for team ID: ${teamId}`);

            try {
                // Fetch team data first (including owner profile)
                const { data: teamResult, error: teamError } = await supabase
                    .from('teams')
                    .select(`
                        *,
                        owner:profiles!owner_id ( username, avatar_url )
                    `) // Fetch all team columns and related owner profile
                    .eq('id', teamId)
                    .maybeSingle();

                if (teamError) throw teamError;
                if (!teamResult) throw new Error(`Team with ID ${teamId} not found.`);
                if (!isMounted) return;

                console.log("TeamPage: Fetched team data:", teamResult);
                setTeamData(teamResult); // Set basic team data

                // Check ownership
                const ownerCheck = authUser && teamResult.owner_id === authUser.id;
                setIsOwner(ownerCheck);

                // Fetch members with their profile data AND stats from team_members
                console.log("TeamPage: Fetching members for team:", teamId);
                const { data: membersResult, error: membersError } = await supabase
                    .from('team_members')
                    .select(`
                        *,
                        impact_score, win_share, accuracy, 
                        profiles ( id, username, avatar_url, game_details )
                    `) // Clean select string for Supabase
                    .eq('team_id', teamId)
                    .order('joined_at'); // Sort by join date

                if (membersError) throw membersError;
                if (!isMounted) return;

                console.log("TeamPage: Fetched members:", membersResult);
                setMembers(membersResult || []);

                // Check if the current user is a member (including the owner)
                if (authUser && membersResult?.some(m => m.user_id === authUser.id)) {
                    setIsMember(true);
                } else {
                    setIsMember(false);
                }

                 // --- Retain placeholder arrays for sections not yet implemented ---
                 setTeamData(prev => ({ // Use previous state to safely add placeholders
                     ...(prev || {}), // Spread previous team data if it exists
                     // Keep placeholders if you haven't implemented fetching these yet
                     recentMatches: prev?.recentMatches || [
                          { id: 1, opponent: 'Rival Team', result: 'Win', score: '16-12', date: '2025-10-14', duration: '45 min' },
                     ],
                     achievements: prev?.achievements || [
                          { title: 'Local Champions', description: 'Won City League 2024', icon: Trophy, date: '2024-12-15' },
                          { title: 'Bronze Scrims', description: 'Top 3 placement in weekly scrims', icon: Trophy, date: '2025-01-22' },
                          { title: 'Rising Star', description: 'Most Improved Team Award 2025', icon: Star, date: '2025-09-01' },
                     ]
                 }));
                 // --- End placeholders ---


            } catch (err) {
                console.error("TeamPage: Error fetching team data:", err.message);
                 if (isMounted) setError(`Failed to load team data: ${err.message}`);
            } finally {
                 if (isMounted) setLoading(false);
            }
        };

        fetchTeamAndMembers();
        return () => { isMounted = false }; // Cleanup function

    }, [teamId, authUser]); // Re-fetch if teamId or authUser changes


     // --- Render Loading State ---
     if (loading) {
         return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl text-gray-400">Loading Team...</p> </div> );
    }

    // --- Render Error State / Not Found ---
    if (error) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">Error Loading Team</h2> <p className="text-gray-400">{error}</p> <Link to="/players?view=teams" className="mt-6 btn-secondary"> Back to Teams </Link> </div> );
    }

     if (!teamData) { return <Navigate to="/players?view=teams" replace />; } // Redirect if somehow still null

    // --- Calculate Win Rate (Placeholder) ---
    const winRate = 0; // Replace with actual calculation from team stats

    // Get the team's primary game to filter game_details
    const teamGame = teamData.game;

    return (
        <div className="bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 text-white min-h-screen relative overflow-hidden z-10">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] z-[-1]"></div>
            <div className="absolute inset-0 bg-radial-gradient-to-tl from-transparent via-primary-900/5 to-transparent animate-pulse-slow"></div>

            <div className="max-w-full mx-auto space-y-8 lg:space-y-10 pb-10 relative z-10">

                {/* --- Hero Banner (Uses fetched data including banner_url) --- */}
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl bg-dark-800">
                    {/* 👇 Use teamData.banner_url */}
                    <img src={teamData.banner_url || '/images/lan_9.jpg'} alt={`${teamData.name} Banner`} className="absolute inset-0 w-full h-full object-cover object-center opacity-30 blur-sm scale-105"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                         <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                             <div className="relative -mt-16 sm:-mt-12 flex-shrink-0">
                                 <img src={teamData.logo_url || '/images/placeholder_team.png'} alt={teamData.name} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-primary-500 bg-dark-800 shadow-lg"/>
                             </div>
                             <div className="flex-grow text-center sm:text-left mb-2">
                                 <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md mb-1">{teamData.name}</h1>
                                 <p className="text-lg sm:text-xl text-primary-400 font-semibold mb-2">{teamData.game}</p>
                                 <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 text-gray-400 text-sm">
                                    {(teamData.city || teamData.country) && ( <span className="flex items-center"><MapPin size={14} className="mr-1 text-red-500" /> {teamData.city ? `${teamData.city}, ` : ''}{teamData.country || ''}</span> )}
                                    {teamData.created_at && ( <span className="flex items-center"><Calendar size={14} className="mr-1" /> Founded {new Date(teamData.created_at).toLocaleDateString()}</span> )}
                                 </div>
                             </div>
                             <div className="flex gap-3 flex-shrink-0 mt-3 sm:mt-0">
                                {/* Conditional Action Buttons */}
                                {isOwner ? ( <Link to={`/manage-team/${teamData.id}`} className="btn-primary text-sm flex items-center"><Settings className="mr-1.5" size={16} /> Manage Team</Link> )
                                : isMember ? ( <button className="btn-danger text-sm flex items-center"><LogOut className="mr-1.5 rotate-180" size={16} /> Leave Team</button> // TODO: Add leave logic
                                ) : authUser ? ( <button className="btn-secondary text-sm flex items-center"><UserPlus className="mr-1.5" size={16} /> Request to Join</button> // TODO: Add request logic
                                ) : null }
                             </div>
                         </div>
                    </div>
                </AnimatedSection>

                {/* --- Main Content Grid --- */}
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                     {/* Left Column */}
                     <div className="lg:col-span-2 space-y-8 lg:space-y-10">

                         {/* Team Stats Overview (Placeholders) */}
                         <AnimatedSection delay={100} className="card bg-dark-800 p-5 rounded-xl shadow-lg">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                 <div><div className="text-3xl font-bold text-primary-400">#?</div><div className="text-gray-400 text-xs uppercase tracking-wider">Rank</div></div>
                                 <div><div className="text-3xl font-bold text-green-400">0</div><div className="text-gray-400 text-xs uppercase tracking-wider">Wins</div></div>
                                 <div><div className="text-3xl font-bold text-red-400">0</div><div className="text-gray-400 text-xs uppercase tracking-wider">Losses</div></div>
                                 <div><div className="text-3xl font-bold text-blue-400">{winRate}%</div><div className="text-gray-400 text-xs uppercase tracking-wider">Win Rate</div></div>
                              </div>
                         </AnimatedSection>

                         {/* Team Description */}
                         {teamData.description && ( <AnimatedSection delay={150} className="card bg-dark-800 p-6 rounded-xl shadow-lg"> <h2 className="text-2xl font-bold text-primary-300 mb-3">About {teamData.name}</h2> <p className="text-gray-300 italic leading-relaxed">{teamData.description}</p> </AnimatedSection> )}

                         {/* --- Team Members (Updated Display) --- */}
                         <AnimatedSection delay={200} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Active Roster ({members.length})</h2>
                             {members.length > 0 ? (
                                 <div className="space-y-5">
                                     {members.map((member, index) => {
                                         const memberGameDetails = member.profiles?.game_details?.[teamGame];
                                         // Use stats directly from the fetched member object
                                         const memberStats = {
                                             impactScore: member.impact_score ?? 0,
                                             winShare: member.win_share ?? 0.0,
                                             accuracy: member.accuracy ?? 0.0
                                         };

                                         return (
                                             <AnimatedSection key={member.user_id || index} delay={index * 50} className="bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:bg-dark-700/80 border border-dark-600 hover:border-primary-600/50">
                                                 {/* Member Info & Link */}
                                                 <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                                                     {/* Wrap image and text block in Link */}
                                                     <Link to={`/profile/${member.profiles?.username}`} className="flex items-center flex-grow w-full sm:w-auto group">
                                                         <img src={member.profiles?.avatar_url || '/images/placeholder_player.png'} alt={member.profiles?.username} className="w-12 h-12 rounded-full mr-4 border border-primary-500/50 flex-shrink-0 object-cover group-hover:ring-2 group-hover:ring-primary-400 transition-all" />
                                                         <div>
                                                             <span className="font-semibold text-lg text-white group-hover:text-primary-300 transition-colors block">{member.profiles?.username || 'Unknown User'}</span>
                                                             <span className="text-primary-400 font-medium text-sm block">{member.role}</span>
                                                         </div>
                                                     </Link>
                                                     <div className="text-right text-xs text-gray-400 flex-shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
                                                         <p>Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
                                                     </div>
                                                 </div>

                                                 {/* Display Game Profile Data */}
                                                 {(memberGameDetails && (memberGameDetails.ign || memberGameDetails.uid)) ? (
                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4 border-t border-dark-600/50 pt-3">
                                                           {memberGameDetails.ign && ( <div className="flex items-center text-gray-300" title={`${teamGame} In-Game Name`}> <Gamepad2 size={14} className="mr-2 text-primary-400 flex-shrink-0"/> <span className="truncate">{memberGameDetails.ign}</span> </div> )}
                                                           {memberGameDetails.uid && ( <div className="flex items-center text-gray-300" title={`${teamGame} User ID`}> <User size={14} className="mr-2 text-primary-400 flex-shrink-0"/> <span className="truncate">{memberGameDetails.uid}</span> </div> )}
                                                      </div>
                                                 ) : (
                                                      // Optionally show placeholder if no game details, or just skip section
                                                      <div className="text-xs text-gray-500 italic mb-4 border-t border-dark-600/50 pt-3"> No {teamGame} profile data added by this user. </div>
                                                 )}

                                                 {/* --- Display Performance Stats (Fetched) --- */}
                                                 <div className={`grid grid-cols-3 gap-2 text-sm ${ (memberGameDetails && (memberGameDetails.ign || memberGameDetails.uid)) ? 'pt-3 border-t border-dark-600/50' : ''}`}> {/* Adjust border logic slightly */}
                                                     <div className="text-center">
                                                          {/* 👇 Use fetched stat, format if needed */}
                                                          <div className="font-semibold text-xl text-green-400">{memberStats.impactScore}</div>
                                                          <div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><BarChart size={12} className="mr-1"/>Impact</div>
                                                     </div>
                                                     <div className="text-center">
                                                          {/* 👇 Use fetched stat, format as percentage */}
                                                          <div className="font-semibold text-xl text-blue-400">{(memberStats.winShare * 100).toFixed(1)}%</div>
                                                          <div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><Percent size={12} className="mr-1"/>Win Share</div>
                                                     </div>
                                                     <div className="text-center">
                                                          {/* 👇 Use fetched stat, format as percentage */}
                                                          <div className="font-semibold text-xl text-yellow-400">{(memberStats.accuracy * 100).toFixed(1)}%</div>
                                                          <div className="text-gray-400 uppercase tracking-wider text-xs flex items-center justify-center"><Crosshair size={12} className="mr-1"/>Accuracy</div>
                                                     </div>
                                                 </div>
                                                 {/* --- End Performance Stats --- */}
                                             </AnimatedSection>
                                         );
                                     })}
                                 </div>
                             ) : ( <p className="text-gray-400 text-center py-4">This team has no members yet (besides the owner).</p> )}
                         </AnimatedSection>
                         {/* --- End Team Members --- */}

                         {/* Recent Matches (Retained Placeholder) */}
                         {teamData.recentMatches && teamData.recentMatches.length > 0 && (
                              <AnimatedSection delay={300} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                                  <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Recent Matches</h2>
                                  <div className="space-y-4">
                                       {teamData.recentMatches.map((match, index) => (
                                           <div key={match.id || index} className="bg-dark-700/50 p-3 rounded">
                                               <p className='text-gray-200'>vs <span className='font-semibold'>{match.opponent}</span> - <span className={`font-bold ${match.result === 'Win' ? 'text-green-400' : 'text-red-400'}`}>{match.result}</span> ({match.score})</p>
                                               <p className="text-xs text-gray-400">{match.date} ({match.duration})</p>
                                           </div>
                                       ))}
                                  </div>
                              </AnimatedSection>
                         )}
                     </div> {/* End Left Column */}

                     {/* Right Column (Retained Placeholders/Structure) */}
                     <div className="space-y-8 lg:sticky lg:top-24 self-start">
                         {/* Quick Stats */}
                         <AnimatedSection delay={400} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                              <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Quick Stats</h2>
                              <div className="space-y-3 text-base"> {/* ... Placeholder stats ... */} </div>
                         </AnimatedSection>
                         {/* Upcoming Events */}
                         <AnimatedSection delay={500} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Upcoming Events</h2>
                             <div className="space-y-4"> <p className='text-sm text-gray-400 italic'>No upcoming events scheduled.</p> </div>
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
                         {/* Contact */}
                         <AnimatedSection delay={600} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                             <h2 className="text-xl font-bold mb-4 text-primary-300 border-b border-dark-700 pb-2">Contact Team</h2>
                             <button className="w-full btn-primary flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"> <Mail className="mr-2" size={16} /> Send Message </button>
                         </AnimatedSection>
                     </div> {/* End Right Column */}
                 </div> {/* End Main Grid */}

                 {/* Achievements (Resolved) */}
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