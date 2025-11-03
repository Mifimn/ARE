// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
import { Calendar, Trophy, Users, Bell, TrendingUp, Clock, Star, Loader2, AlertCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom'; // Import Link

export default function DashboardPage() {
  const { user: authUser } = useAuth(); // Get the authenticated user object
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: State for dynamic stats ---
  const [stats, setStats] = useState({
    rank: 'N/A',
    tournamentsPlayed: 0,
    winRate: 0,
    activeTeams: 0
  });
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  // ---

  // --- Effect 1: Fetch Profile ---
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
          .select('username, avatar_url, full_name') // Removed 'rank'
          .eq('id', authUser.id) // Filter by the logged-in user's ID
          .single(); // Expect only one row

        if (profileError) {
          throw profileError;
        }

        if (data) {
          console.log("Fetched profile data:", data); // Log fetched data
          setProfile(data);
        } else {
          console.warn("No profile data found for user:", authUser.id);
           setProfile({
             username: authUser.email.split('@')[0], // Fallback username
             full_name: 'User', // Fallback name
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
  }, [authUser]); // Re-fetch if the authenticated user changes

  // --- Effect 2: Fetch Dashboard Stats & Matches ---
  useEffect(() => {
      if (!authUser) {
        setLoadingStats(false);
        return;
      }

      const fetchDashboardData = async () => {
          setLoadingStats(true);
          try {
              // --- *** FIX IS HERE *** ---
              // --- 1. Fetch Team Count (Accurately) ---
              const { data: teamsAsMember, error: memberError } = await supabase
                  .from('team_members')
                  .select('team_id')
                  .eq('user_id', authUser.id);
              
              const { data: teamsAsOwner, error: ownerError } = await supabase
                  .from('teams')
                  .select('id')
                  .eq('owner_id', authUser.id);

              if (memberError) console.error('Error fetching member teams:', memberError.message);
              if (ownerError) console.error('Error fetching owner teams:', ownerError.message);
              
              const memberTeamIds = teamsAsMember ? teamsAsMember.map(t => t.team_id) : [];
              const ownerTeamIds = teamsAsOwner ? teamsAsOwner.map(t => t.id) : [];

              // Combine and find unique team IDs
              const uniqueTeamIds = [...new Set([...memberTeamIds, ...ownerTeamIds])];
              const totalTeams = uniqueTeamIds.length;
              // --- *** END FIX *** ---


              // --- 2. Fetch Stats (Wins, Matches) ---
              let tournamentsPlayed = 0;
              let winRate = 0;
              let userParticipantIds = [];

              if (uniqueTeamIds.length > 0) {
                  const { data: participantRecords, error: pError } = await supabase
                      .from('tournament_participants')
                      .select('id, tournament_id')
                      .in('team_id', uniqueTeamIds);
                  
                  if (pError) throw pError;

                  if (participantRecords && participantRecords.length > 0) {
                      // Get unique tournament IDs
                      tournamentsPlayed = [...new Set(participantRecords.map(p => p.tournament_id))].length;
                      userParticipantIds = participantRecords.map(p => p.id);
                  }
              }
              
              if (userParticipantIds.length > 0) {
                   const { data: matchResults, error: resultsError } = await supabase
                      .from('match_results')
                      .select('placement')
                      .in('participant_id', userParticipantIds);
                  
                  if (resultsError) throw resultsError;

                  const totalMatches = matchResults?.length || 0;
                  if (totalMatches > 0) {
                      const totalWins = matchResults.filter(r => r.placement === 1).length;
                      winRate = Math.round((totalWins / totalMatches) * 100);
                  }
              }
              
              // --- 3. Fetch Upcoming Matches ---
              if (userParticipantIds.length > 0) {
                  const { data: upcomingData, error: upcomingError } = await supabase
                      .from('match_participants')
                      .select('tournament_matches!inner(*, tournaments(name))')
                      .in('participant_id', userParticipantIds)
                      .eq('tournament_matches.status', 'Scheduled')
                      .order('scheduled_time', { referencedTable: 'tournament_matches', ascending: true })
                      .limit(3);

                  if (upcomingError) throw upcomingError;
                  
                  // The data is nested, so we extract it
                  setUpcomingMatches(upcomingData.map(item => ({
                      ...item.tournament_matches,
                      tournament_name: item.tournament_matches.tournaments.name
                  })) || []);
              }

              // --- 4. Set All Stats ---
              setStats(prevStats => ({
                  ...prevStats,
                  activeTeams: totalTeams,
                  tournamentsPlayed: tournamentsPlayed,
                  winRate: winRate
              }));

          } catch (error) {
              console.error("Error fetching dashboard data:", error.message);
              setError(error.message); // Set page-level error
          } finally {
              setLoadingStats(false);
          }
      };

      fetchDashboardData();
  }, [authUser]);

  // --- Placeholder data (Kept for structure, replace/remove as needed) ---
   const recentNews = [
    { id: 1, title: 'New Season of Free Fire League Announced', date: '2025-11-02', category: 'Tournaments' },
    { id: 2, title: 'Profile Customization Update', date: '2025-10-30', category: 'Platform' },
   ];
   const notifications = [/* ... */];
  // --- End Placeholder Data ---

  // --- NEW: Combine stats into one array for rendering ---
  const statsCards = [
    { label: 'Current Rank', value: stats.rank, icon: Star, color: 'text-yellow-400' },
    { label: 'Tournaments Played', value: loadingStats ? '...' : stats.tournamentsPlayed, icon: Trophy, color: 'text-green-400' },
    { label: 'Win Rate', value: loadingStats ? '...' : `${stats.winRate}%`, icon: TrendingUp, color: 'text-blue-400' },
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
        {/* Welcome Header */}
        <AnimatedSection tag="div" className="mb-8" delay={100}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-400">Ready to dominate the competition today?</p>
        </AnimatedSection>

        {/* Stats Cards - Updated to use dynamic data */}
        <AnimatedSection tag="div" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" delay={200}>
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
          
          {/* --- UPDATED: Upcoming Matches --- */}
          <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg" direction="left" delay={300}>
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

        {/* Notifications (Static) */}
        <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg mt-8" delay={500}>
             <h2 className="text-xl font-bold mb-6 flex items-center"> <Bell className="mr-2 text-primary-500" size={24} /> Recent Notifications </h2>
             <div className="space-y-3">
                {notifications.length > 0 ? notifications.map(notif => (
                    <div key={notif.id}>{/* ... notification item ... */}</div>
                )) : (
                    <p className="text-gray-500 text-center py-4">No new notifications.</p>
                )}
             </div>
        </AnimatedSection>

      </div>
    </div>
  );
}
