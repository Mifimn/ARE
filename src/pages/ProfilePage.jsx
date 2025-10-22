// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
// Added Search icon
import { User, Edit3, Trophy, Users, Calendar, MapPin, Star, Mail, Phone, Clock, Coins, Percent, Gamepad2, FileText, Eye, Search, ArrowRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

// Helper function remains the same
const normalizeUrl = (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export default function ProfilePage() {
  const { user: authUser, session, loading: authLoading } = useAuth(); // Get auth user, session, and auth loading state
  const [profile, setProfile] = useState(null); // State for fetched profile data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if auth isn't loading and we have a user
    if (!authLoading && authUser) {
      const fetchProfile = async () => {
        console.log("[ProfilePage] Auth loaded, fetching profile for user:", authUser.id);
        setLoading(true);
        setError(null);
        try {
          const { data, error: profileError, status } = await supabase
            .from('profiles')
            .select('*') // Fetch all columns defined in your table
            .eq('id', authUser.id)
            .single();

          if (profileError && status !== 406) { // 406 means no rows found, which is not necessarily an error here
            throw profileError;
          }

          if (data) {
            console.log("[ProfilePage] Fetched profile data:", data);
            // Ensure necessary fields have defaults if null from DB
            setProfile({
              ...data,
              email: authUser.email, // Get email from authUser
              joinDate: authUser.created_at, // Get join date from authUser
              // Provide defaults for potentially null fields from DB if needed
              favoriteGames: data.favorite_games || [],
              gameDetails: data.game_details || {},
              socialLinks: data.social_links || {},
              credits: data.credits ?? 0,
              totalWins: data.total_wins ?? 0,
              totalLosses: data.total_losses ?? 0,
              avatar: data.avatar_url || '/images/ava_m_1.png', // Default avatar
              banner: data.banner_url || '/images/lan_3.jpg', // Default banner
            });
          } else {
             console.warn("[ProfilePage] No profile found in DB for user:", authUser.id, ". Using fallback data.");
             // Fallback if profile doesn't exist (e.g., trigger failed)
             setProfile({
                id: authUser.id,
                username: authUser.email.split('@')[0], // Use part of email as username
                fullName: 'User', // Default full name
                email: authUser.email,
                joinDate: authUser.created_at,
                avatar: '/images/ava_m_1.png', // Default avatar
                banner: '/images/lan_3.jpg', // Default banner
                // Add other fields with default values from your table schema
                bio: 'No bio set.', country: null, city: null, phone: null, credits: 0,
                totalWins: 0, totalLosses: 0, favoriteGames: [], gameDetails: {},
                socialLinks: {}, verified: false,
             });
          }
        } catch (err) {
          console.error('[ProfilePage] Error fetching profile:', err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else if (!authLoading && !authUser) {
        // If auth is done loading but there's no user, stop loading and potentially redirect
        console.log("[ProfilePage] Auth loaded, no user found.");
        setLoading(false);
        setError("User not logged in."); // Set an error or handle redirect
    }
  }, [authUser, authLoading]); // Re-run effect when authUser or authLoading changes


  // --- Placeholder Teams/Matches (replace with fetched data later) ---
  const teams = [
    { id: 'thunder-hawks-123', name: 'Thunder Hawks', logo: 'https://via.placeholder.com/40x40?text=TH', game: 'COD Warzone', role: 'Captain' }, // Example ID
    { id: 'lagos-lions-1', name: 'Lagos Lions', logo: '/images/team_ll.png', game: 'FIFA 24', role: 'Member' }, // Example ID
  ];
  const recentMatches = [
    { id: 1, game: 'FIFA 24', opponent: 'DesertStorm', result: 'Win', score: '3-1', date: '2024-01-14' },
    { id: 2, game: 'COD Warzone', opponent: 'LionHeart', result: 'Loss', score: '12-15', date: '2024-01-13' },
    { id: 3, game: 'FIFA 24', opponent: 'AtlasWarrior', result: 'Win', score: '2-0', date: '2024-01-12' }
  ];
  // ---

  // --- Render Loading State ---
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-4 text-xl">Loading Profile...</p>
      </div>
    );
  }

  // --- Render Error State ---
  if (error || !profile) {
     if (error === "User not logged in.") {
        return <Navigate to="/login" replace />;
     }
    return <div className="text-center text-red-400 mt-10">Error loading profile: {error || 'Profile data unavailable.'}</div>;
  }

  // --- Calculate Win Rate ---
  const winRate = profile.totalWins + profile.totalLosses > 0
    ? Math.round((profile.totalWins / (profile.totalWins + profile.totalLosses)) * 100)
    : 0;

  // --- Render Profile ---
  return (
    <div className="bg-dark-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Profile Header */}
        <AnimatedSection tag="div" className="relative rounded-xl overflow-hidden shadow-2xl" delay={0}>
          {/* ... Banner ... */}
          <div className="w-full h-48 bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${profile.banner || '/images/lan_3.jpg'})` }}> {/* */}
            <div className="absolute inset-0 bg-dark-900/40"></div>
          </div>
          {/* ... Content Layer ... */}
          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-32 md:-mt-24">
            {/* ... Avatar and Edit Button ... */}
            <div className="relative flex-shrink-0 mb-4 md:mb-0">
               <img src={profile.avatar || '/images/ava_m_1.png'} alt={profile.fullName || profile.username} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-dark-900 shadow-xl ring-4 ring-primary-500/50" /> {/* */}
                {profile.verified && ( <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center border-2 border-dark-900"> <Star className="w-4 h-4 text-white" /> </div> )}
            </div>
            {/* ... User Details and Stats ... */}
            <div className="flex-1 text-center md:text-left w-full pt-4">
               <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-4">
                 <div>
                   <h1 className="text-3xl font-bold text-white mb-1">{profile.username || 'N/A'}</h1>
                   <p className="text-xl text-gray-300 mb-2">{profile.fullName || ''}</p>
                   <div className="flex items-center justify-center md:justify-start text-gray-400 text-sm mb-2"> <MapPin size={14} className="mr-1" /> {profile.city && profile.country ? `${profile.city}, ${profile.country}` : (profile.country || 'Location not set')} </div>
                 </div>
                 <Link to="/edit-profile" className="btn-primary flex items-center self-center md:self-end mt-4 md:mt-0 flex-shrink-0"> <Edit3 className="mr-2" size={16} /> Edit Profile </Link>
               </div>
               {/* ... Stats Section ... */}
               <AnimatedSection tag="div" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-center bg-dark-800/80 p-4 rounded-lg border border-dark-700/50" delay={50}>
                  <div><div className="text-2xl font-bold text-primary-400 flex items-center justify-center"><Coins className="w-5 h-5 mr-1"/> {profile.credits}</div><div className="text-gray-400 text-sm">Credits</div></div>
                  <div><div className="text-2xl font-bold text-green-400">{profile.totalWins}</div><div className="text-gray-400 text-sm">Wins</div></div>
                  <div><div className="text-2xl font-bold text-red-400">{profile.totalLosses}</div><div className="text-gray-400 text-sm">Losses</div></div>
                  <div><div className="text-2xl font-bold text-blue-400">{winRate}%</div><div className="text-gray-400 text-sm">Win Rate</div></div>
               </AnimatedSection>
               {/* ... Bio ... */}
               <AnimatedSection tag="p" className="text-gray-300 mb-4 bg-dark-800/80 p-3 rounded-lg border border-dark-700/50" delay={100}>{profile.bio || 'No bio provided.'}</AnimatedSection>
               {/* ... Favorite Games ... */}
               <AnimatedSection tag="div" className="flex flex-wrap gap-2 justify-center md:justify-start" delay={150}>
                  {profile.favoriteGames?.map((game) => ( <span key={game} className="bg-primary-900 text-primary-200 px-3 py-1 rounded-full text-sm font-medium border border-primary-700"> {game} </span> ))}
                  {profile.favoriteGames?.length === 0 && <span className="text-gray-500 text-sm italic">No favorite games added.</span>}
               </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>

        {/* --- Button to Players Directory --- */}
        <AnimatedSection delay={180} className="text-center">
             <Link
                to="/players"
                className="inline-flex items-center btn-secondary px-6 py-2 group hover:bg-dark-700 transition-colors"
             >
                <Search size={18} className="mr-2 text-primary-400 group-hover:text-primary-300" />
                Find Other Players
                <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
             </Link>
        </AnimatedSection>
        {/* --- End Button --- */}

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Matches (Keep placeholder for now) */}
            <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={200}>
              <h2 className="text-2xl font-bold mb-6 text-primary-300">Recent Matches</h2>
              {/* ... Match list or placeholder ... */}
               {recentMatches.length > 0 ? ( <div className="space-y-4"> {/* ... Map matches ... */} </div> ) : ( <p className="text-gray-400">No recent match history.</p> )}
               {recentMatches.length > 0 && ( <div className="text-center mt-4"> <Link to="/profile/matches" className="text-primary-400 hover:text-primary-300 text-sm font-medium"> View All Matches </Link> </div> )}
            </AnimatedSection>

            {/* My Teams Section (Updated) */}
            <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={300}>
              {/* --- Header with Button --- */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-dark-700 pb-3">
                <h2 className="text-2xl font-bold text-primary-300 mb-3 sm:mb-0">My Teams</h2>
                 <Link
                    to="/my-teams" // Link to the Team Management page
                    className="btn-secondary text-sm flex items-center group"
                 >
                    <Users size={16} className="mr-2" />
                    Manage My Teams
                    <ArrowRight size={14} className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                 </Link>
              </div>
              {/* --- End Header --- */}

              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team, index) => (
                    <AnimatedSection key={team.id} tag="div" className="bg-dark-900 border border-dark-700 rounded-lg p-4 hover:border-primary-500/50 transition-colors" delay={index * 50}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={team.logo} alt={`${team.name} logo`} className="w-10 h-10 rounded-md mr-4 border border-dark-600"/>
                          <div>
                            <Link to={`/team/${team.id}`} className="font-semibold hover:text-primary-400 transition-colors">{team.name}</Link>
                            <p className="text-sm text-gray-400">{team.game}</p>
                          </div>
                        </div>
                        <span className="text-sm bg-primary-700 text-primary-100 px-2 py-1 rounded-full">{team.role}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">You are not currently part of any teams.</p>
              )}
            </AnimatedSection>

             {/* Game Profiles */}
            <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={400}>
                {/* ... Game Profiles Content ... */}
                <h2 className="text-2xl font-bold mb-6 text-primary-300 flex items-center"><Gamepad2 size={20} className="mr-2"/> Game Profiles</h2> {/* ... */}
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={500}>
               {/* ... Contact Info Content ... */}
               <h2 className="text-xl font-bold mb-4 text-primary-300">Contact & Info</h2> {/* ... */}
            </AnimatedSection>
            {/* Social Links */}
            <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={600}>
               {/* ... Social Links Content ... */}
               <h2 className="text-xl font-bold mb-4 text-primary-300">Social Links</h2> {/* ... */}
            </AnimatedSection>
             {/* Game Stats (Placeholder) */}
              <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-lg" delay={700}>
                 {/* ... Game Stats Content ... */}
                 <h2 className="text-xl font-bold mb-4 text-primary-300">Game Statistics</h2> {/* ... */}
              </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}