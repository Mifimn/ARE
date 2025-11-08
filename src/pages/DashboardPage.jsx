// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
import { useTeamUpdate } from '../contexts/TeamUpdateContext.jsx'; // Import for global state synchronization
// Added Crosshair for Kills
import { Calendar, Trophy, Users, Bell, TrendingUp, Clock, Star, Loader2, AlertCircle, X, Mail, Info, ArrowRight, Crosshair } from 'lucide-react'; 
import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom'; // Import Link

export default function DashboardPage() {
  const { user: authUser } = useAuth(); 
  const { teamUpdateKey } = useTeamUpdate(); // Global state key for manual refresh
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for guidance alert ---
  const [showGuidanceAlert, setShowGuidanceAlert] = useState(true);

  // --- State for dynamic stats ---
  const [stats, setStats] = useState({
    rank: 'N/A',
    tournamentsPlayed: 0,
    winRate: 0,
    activeTeams: 0,
    totalKills: 0, // Kept in state for other dashboard components/future use
  });
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // --- Notification State ---
  const [notifications, setNotifications] = useState([]);
  // ---

  // --- Effect 1: Hide guidance alert after 5 seconds ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuidanceAlert(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer); 
  }, []);

  // --- Effect 2: Fetch Profile ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) {
        setError('Not logged in');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          // Ensure favorite_games (PLURAL) is selected
          .select('username, avatar_url, full_name, favorite_games, country, city') 
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        if (data) {
          setProfile(data);
        } else {
           setProfile({
             username: authUser.email.split('@')[0], // Fallback username
             full_name: 'User', // Fallback name
             favorite_games: null, 
             country: null,
             city: null
           });
        }
      } catch (err) {
        console.error('Error fetching profile:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]); 

  // --- Effect 3: Fetch Dashboard Stats & Notifications (EXPANDED & FIXED) ---
  useEffect(() => {
      // Ensure profile data is loaded before fetching stats/notifications
      if (!authUser || !profile) {
        setLoadingStats(false);
        return;
      }

      const fetchDashboardData = async () => {
          setLoadingStats(true);
          const currentNotifications = [];

          try {
              // --- 1. Fetch User-Specific Teams & Membership Dates ---
              const [ownedRes, memberRes] = await Promise.all([
                  supabase
                      .from('teams')
                      // Fetch team creation date for owner join date
                      .select('id, name, logo_url, description, country, owner_id, created_at')
                      .eq('owner_id', authUser.id),
                  supabase
                      .from('team_members')
                      // Fetch user's join date
                      .select('team_id, joined_at')
                      .eq('user_id', authUser.id)
              ]);

              if (ownedRes.error) throw ownedRes.error;
              if (memberRes.error) throw memberRes.error;

              const ownerTeams = ownedRes.data || [];

              // All unique team IDs associated with the user, mapped to their earliest join date
              const allTeamMemberships = [
                  ...(memberRes.data || []).map(t => ({ team_id: t.team_id, join_date: t.joined_at })),
                  // Owner is implicitly a member, joining on creation date:
                  ...ownerTeams.map(t => ({ team_id: t.id, join_date: t.created_at }))
              ];

              const uniqueTeamMemberships = allTeamMemberships.reduce((acc, current) => {
                  if (!acc.has(current.team_id) || new Date(current.join_date) < new Date(acc.get(current.team_id).join_date)) {
                      acc.set(current.team_id, current);
                  }
                  return acc;
              }, new Map());

              const combinedTeamIds = Array.from(uniqueTeamMemberships.keys());
              const totalTeams = combinedTeamIds.length;

              let userParticipantIds = [];
              let tournamentsPlayed = 0;
              let winRate = 0;
              let totalKills = 0;
              let totalMatches = 0;

              // --- 2. Calculate Stats based on User's Teams (WITH DATE FILTERING) ---
              if (combinedTeamIds.length > 0) {
                  // Get participant records where team_id is one of the user's teams
                  const { data: participantRecords } = await supabase
                      .from('tournament_participants')
                      .select('id, tournament_id, team_id');

                  // Filter participant records to only include those belonging to the user's teams
                  const userParticipantRecords = (participantRecords || []).filter(p => combinedTeamIds.includes(p.team_id));


                  if (userParticipantRecords.length > 0) {
                      tournamentsPlayed = [...new Set(userParticipantRecords.map(p => p.tournament_id))].length;
                      userParticipantIds = userParticipantRecords.map(p => p.id);
                  }

                  if (userParticipantIds.length > 0) {
                      // Fetch all match results, kills, and their scheduled time
                      const { data: matchResultsRaw } = await supabase
                          .from('match_results')
                          .select('placement, kills, participant_id, tournament_matches!match_id(scheduled_time)')
                          .in('participant_id', userParticipantIds);

                      // --- CRITICAL FILTERING: Match date vs. User join date ---
                      const filteredMatchResults = (matchResultsRaw || []).filter(r => {
                          // Find the participant record to get the team_id
                          const participant = userParticipantRecords.find(p => p.id === r.participant_id);
                          // Ensure this participant belongs to one of the user's teams
                          if (!participant) return false;

                          const matchTime = new Date(r.tournament_matches?.scheduled_time);
                          const membership = uniqueTeamMemberships.get(participant.team_id);

                          // Check if membership data exists and if the match occurred after or on join date
                          if (membership) {
                              const joinDate = new Date(membership.join_date);
                              // Validate dates before comparison
                              if (isNaN(matchTime.getTime()) || isNaN(joinDate.getTime())) return false;

                              return matchTime >= joinDate;
                          }
                          return false;
                      });

                      totalMatches = filteredMatchResults.length;
                      if (totalMatches > 0) {
                          const totalWins = filteredMatchResults.filter(r => r.placement === 1).length;
                          // Calculate total kills from filtered set
                          totalKills = filteredMatchResults.reduce((sum, r) => sum + (r.kills || 0), 0);
                          winRate = Math.round((totalWins / totalMatches) * 100);
                      }
                  }
              }

              // --- 3. Notification Data (Unchanged logic, uses correct user data) ---

              // 3a. Check for pending team invites (Action Required)
              const { count: inviteCount } = await supabase
                  .from('team_invites')
                  .select('id', { count: 'exact' })
                  .eq('invited_user_id', authUser.id)
                  .eq('status', 'pending');

              if (inviteCount > 0) {
                  currentNotifications.push({ 
                      id: 'invite', 
                      type: 'Action Required', 
                      message: `You have ${inviteCount} pending team invitation(s) to review.`,
                      link: '/my-teams'
                  });
              }

              // 3b. Check User Profile Completeness (Warning)
              const isUserIncomplete = !profile.full_name || !profile.country || profile.avatar_url === null; 
              if (isUserIncomplete) {
                   currentNotifications.push({ 
                      id: 'user_profile', 
                      type: 'Warning', 
                      message: 'Your personal profile seems incomplete (name, country, or avatar).',
                      link: '/edit-profile'
                  });
              }

              // 3c. Check Owned Team Profile Completeness (Warning)
              ownerTeams.forEach(team => {
                  const isTeamIncomplete = !team.description || !team.country || team.logo_url === null;
                  if (isTeamIncomplete) {
                       currentNotifications.push({ 
                          id: `team_profile_${team.id}`, 
                          type: 'Warning', 
                          message: `Team "${team.name}" profile is incomplete (logo, description, or country missing).`,
                          link: `/manage-team/${team.id}`
                      });
                  }
              });

              // 3d. Upcoming Matches (starting in next 30 minutes - Critical Alert)
              const now = Date.now();
              const next30Mins = new Date(now + 30 * 60 * 1000).toISOString();
              const nowISO = new Date(now).toISOString();

              const { data: impendingMatchesData } = await supabase
                  .from('match_participants')
                  .select('tournament_matches!inner(id, tournaments(name))')
                  .in('participant_id', userParticipantIds) 
                  .gte('tournament_matches.scheduled_time', nowISO) 
                  .lte('tournament_matches.scheduled_time', next30Mins) 
                  .eq('tournament_matches.status', 'Scheduled');

              const uniqueImpendingMatches = (impendingMatchesData || [])
                    .map(item => item.tournament_matches)
                    .filter((match, index, self) => 
                        self.findIndex(m => m.id === match.id) === index
                    );

              if (uniqueImpendingMatches.length > 0) {
                   currentNotifications.push({ 
                      id: 'match_alert', 
                      type: 'Critical Alert', 
                      message: `${uniqueImpendingMatches.length} match(es) for your teams start in the next 30 minutes!`,
                      link: '/dashboard#upcoming' // Link to upcoming matches section
                  });
              }

              // 3e. Recent Tournaments matching favorite game (New Content)
              const favoriteGamesArray = profile.favorite_games 
                    ? (Array.isArray(profile.favorite_games) ? profile.favorite_games : [profile.favorite_games])
                    : [];

              if (favoriteGamesArray.length > 0) {
                  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();

                  const { count: recentTourneyCount } = await supabase
                      .from('tournaments')
                      .select('id', { count: 'exact' })
                      .in('game', favoriteGamesArray)
                      .gte('created_at', oneDayAgo); 

                  if (recentTourneyCount > 0) {
                      currentNotifications.push({
                          id: 'new_tourney',
                          type: 'New Content',
                          message: `${recentTourneyCount} new ${favoriteGamesArray[0]} tournaments were posted in the last 24 hours!`, 
                          link: '/tournaments'
                      });
                  }
              }

              // --- 4. Set Final States ---
              setStats(prevStats => ({
                  ...prevStats,
                  activeTeams: totalTeams,
                  tournamentsPlayed: totalMatches, // This is actually Total Matches Played
                  winRate: winRate,
                  totalKills: totalKills, // Set total kills
              }));

              // Sort notifications by type priority
              const notificationPriority = {'Critical Alert': 1, 'Action Required': 2, 'Warning': 3, 'New Content': 4};
              currentNotifications.sort((a, b) => notificationPriority[a.type] - notificationPriority[b.type]);

              setNotifications(currentNotifications);

              // --- 5. Upcoming Matches for Central Panel (excluding critical alerts) ---
              const { data: upcomingData } = await supabase
                  .from('match_participants')
                  .select('tournament_matches!inner(*, tournaments(name))')
                  .in('participant_id', userParticipantIds)
                  .gte('tournament_matches.scheduled_time', next30Mins)
                  .order('scheduled_time', { referencedTable: 'tournament_matches', ascending: true })
                  .limit(3);

              setUpcomingMatches(upcomingData.map(item => ({
                  ...item.tournament_matches,
                  tournament_name: item.tournament_matches.tournaments.name
              })) || []);


          } catch (error) {
              console.error("Error fetching dashboard data:", error.message);
              setError(error.message); 
          } finally {
              setLoadingStats(false);
          }
      };

      fetchDashboardData();
  }, [authUser, teamUpdateKey, profile]); 

  // --- Placeholder data (for news only) ---
   const recentNews = [
    { id: 1, title: 'New Season of Free Fire League Announced', date: '2025-11-02', category: 'Tournaments' },
    { id: 2, title: 'Profile Customization Update', date: '2025-10-30', category: 'Platform' },
   ];
  // --- End Placeholder Data ---

  // --- Combine stats into one array for rendering (UPDATED) ---
  const statsCards = [
    // 1. Current Rank
    { label: 'Current Rank', value: stats.rank, icon: Star, color: 'text-yellow-400' }, 
    // 2. Tournament Played / Total Matches Played
    { label: 'Total Matches Played', value: loadingStats ? '...' : stats.tournamentsPlayed, icon: Trophy, color: 'text-green-400' },
    // 3. Win Rate
    { label: 'Win Rate', value: loadingStats ? '...' : `${stats.winRate}%`, icon: TrendingUp, color: 'text-blue-400' },
    // 4. Active Teams
    { label: 'Active Teams', value: loadingStats ? '...' : stats.activeTeams, icon: Users, color: 'text-purple-400' },
  ];


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
        <p className="ml-4 text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  if (error && !loading) {
    return <div className="text-center text-red-400 mt-10">Error loading dashboard: {error}</div>;
  }

  // Use fetched profile data, provide fallbacks
  const displayName = profile?.username || authUser?.email || 'User';

  return (
    <div className="bg-dark-900 text-white">
      <div className="space-y-8">

        {/* --- GUIDANCE ALERT (Unchanged) --- */}
        {showGuidanceAlert && (
          <div className="relative bg-primary-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between border border-primary-600 animate-fade-in">
            <span className="font-medium text-sm sm:text-base">
              New here? Check out the <Link to="/guidance" className="font-bold underline hover:text-primary-200">Guidance Page</Link> to learn how everything works!
            </span>
            <button 
              onClick={() => setShowGuidanceAlert(false)} 
              className="text-primary-200 hover:text-white rounded-full p-1"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {/* --- END ALERT --- */}


        {/* Welcome Header */}
        <AnimatedSection tag="div" className="mb-8" delay={100}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-400">Ready to dominate the competition today?</p>
        </AnimatedSection>

        {/* Stats Cards (UPDATED to match requested metrics) */}
        <AnimatedSection tag="div" className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8" delay={200}>
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedSection key={index} tag="div" className="bg-dark-800 p-5 rounded-xl border border-dark-700 shadow-lg" delay={index * 100}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color}`} size={32} />
                </div>
              </AnimatedSection>
            );
          })}
        </AnimatedSection>

         {/* Matches and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* --- Upcoming Matches --- */}
          <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg" direction="left" delay={300} id="upcoming">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                    <Clock className="mr-2 text-primary-500" size={24} /> Upcoming Matches
                </h2>
             </div>
             {loadingStats ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                </div>
             ) : error ? (
                <div className="flex justify-center items-center h-24 text-red-400">
                    <AlertCircle size={20} className="mr-2"/> Could not load matches.
                </div>
             ) : upcomingMatches.length > 0 ? (
                <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                        <Link to={`/cup/${match.tournament_id}`} key={match.id} className="block bg-dark-700/50 p-3 rounded-lg border border-dark-600 hover:border-primary-500/50 transition-colors">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-primary-300">{match.tournament_name}</span>
                                <span className="text-xs text-gray-400">{match.group_name} - Match {match.match_number}</span>
                            </div>
                            <p className="text-sm text-white font-medium">
                                {match.group_name ? `${match.group_name} Lobby` : 'Bracket Match'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                <Calendar size={12} className="inline mr-1"/> {new Date(match.scheduled_time).toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
             ) : (
                <div className="text-center text-gray-500 py-8">
                    <Calendar size={32} className="mx-auto mb-2" />
                    <p>No upcoming matches scheduled.</p>
                </div>
             )}
          </AnimatedSection>

          {/* Recent News (Still Static) */}
          <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg" direction="right" delay={400}>
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                    <Bell className="mr-2 text-primary-500" size={24} /> Recent News
                </h2>
                <Link to="/news" className="text-sm text-primary-400 hover:text-primary-300">View All</Link>
             </div>
             <div className="space-y-4">
                {recentNews.length > 0 ? recentNews.map(news => (
                    <div key={news.id} className="bg-dark-700/50 p-3 rounded-lg">
                        <span className="text-xs bg-dark-600 text-gray-300 px-2 py-0.5 rounded-full">{news.category}</span>
                        <p className="text-white font-medium mt-2 mb-1 hover:text-primary-300 transition-colors">
                            <Link to="/news">{news.title}</Link>
                        </p>
                        <p className="text-xs text-gray-500">{news.date}</p>
                    </div>
                )) : (
                    <p className="text-gray-500 text-center py-8">No recent news.</p>
                )}
             </div>
          </AnimatedSection>
        </div>

        {/* Notifications (DYNAMIC) (Unchanged) */}
        <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg mt-8" delay={500}>
             <h2 className="text-xl font-bold mb-6 flex items-center"> 
                <Bell className="mr-2 text-primary-500" size={24} /> Recent Notifications ({notifications.length})
             </h2>
             {notifications.length > 0 ? (
                 <div className="space-y-3">
                     {notifications.map((notif, index) => {
                         let Icon, color, badge;

                         switch (notif.type) {
                             case 'Critical Alert': Icon = AlertCircle; color = 'text-red-400'; badge = 'bg-red-800/50 border-red-600'; break;
                             case 'Action Required': Icon = Mail; color = 'text-yellow-400'; badge = 'bg-yellow-800/50 border-yellow-600'; break;
                             case 'Warning': Icon = Info; color = 'text-orange-400'; badge = 'bg-orange-800/50 border-orange-600'; break;
                             case 'New Content': Icon = Trophy; color = 'text-green-400'; badge = 'bg-green-800/50 border-green-600'; break;
                             default: Icon = Bell; color = 'text-primary-400'; badge = 'bg-dark-700'; break;
                         }

                         return (
                            <Link 
                                key={notif.id} 
                                to={notif.link || '#'} 
                                className={`flex items-start p-3 rounded-lg transition-colors hover:bg-dark-700/50 border ${badge}`}
                            >
                                <Icon size={20} className={`mr-3 flex-shrink-0 mt-0.5 ${color}`} />
                                <div className="flex-grow">
                                    <p className="text-sm text-white font-medium">{notif.message}</p>
                                    <span className="text-xs text-gray-500">{notif.type}</span>
                                </div>
                                <ArrowRight size={16} className="text-gray-500 ml-4 flex-shrink-0 mt-1"/>
                            </Link>
                         );
                     })}
                 </div>
             ) : (
                <p className="text-gray-500 text-center py-4">No new notifications.</p>
             )}
        </AnimatedSection>

      </div>
    </div>
  );
}