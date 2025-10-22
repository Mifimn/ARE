// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
import { Calendar, Trophy, Users, Bell, TrendingUp, Clock, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

export default function DashboardPage() {
  const { user: authUser } = useAuth(); // Get the authenticated user object
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          .select('*') // Select all columns for now
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
          // Handle case where profile might not exist yet (e.g., trigger didn't run)
          // Set a default profile object using auth data if needed
           setProfile({
             username: authUser.email.split('@')[0], // Fallback username
             full_name: 'User', // Fallback name
             // Add other default fields from your profiles table if necessary
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

  // --- Placeholder data (Kept for structure, replace/remove as needed) ---
  const stats = [
    // You might want to fetch these stats too, or use profile data
    { label: 'Current Rank', value: profile?.rank || 'N/A', icon: Star, color: 'text-yellow-400' },
    { label: 'Tournaments Played', value: '0', icon: Trophy, color: 'text-green-400' }, // Placeholder
    { label: 'Win Rate', value: '0%', icon: TrendingUp, color: 'text-blue-400' }, // Placeholder
    { label: 'Active Teams', value: '0', icon: Users, color: 'text-purple-400' }, // Placeholder
  ];
  // ... (Keep upcomingMatches, recentNews, notifications placeholders for now) ...
   const upcomingMatches = [/* ... */];
   const recentNews = [/* ... */];
   const notifications = [/* ... */];
  // --- End Placeholder Data ---


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        <p className="ml-4 text-xl">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">Error loading dashboard: {error}</div>;
  }

  // Use fetched profile data, provide fallbacks
  const displayName = profile?.username || authUser?.email || 'User';
  const displayAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'; // Default avatar

  return (
    <div className="bg-dark-900 text-white">
      <div className="space-y-8">
        {/* Welcome Header */}
        <AnimatedSection tag="div" className="mb-8" delay={100}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {/* 👇 Use dynamic username */}
            Welcome back, {displayName}!
          </h1>
          <p className="text-gray-400">Ready to dominate the competition today?</p>
        </AnimatedSection>

        {/* Stats Cards - Updated to use profile rank if available */}
        <AnimatedSection tag="div" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" delay={200}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedSection key={index} tag="div" className="bg-dark-800 p-5 rounded-xl border border-dark-700 shadow-lg" delay={index * 100}> {/* Example card style */}
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

        {/* ... (Rest of the Dashboard sections: Matches, News, Notifications) ... */}
        {/* You'll eventually fetch data for these sections too */}
         {/* Matches and News Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg" direction="left" delay={300}>
            {/* ... Upcoming Matches content ... */}
             <div className="flex items-center justify-between mb-6"> <h2 className="text-xl font-bold flex items-center"> <Clock className="mr-2 text-primary-500" size={24} /> Upcoming Matches </h2> </div> <div className="space-y-4"> {/* Map matches here */} </div>
          </AnimatedSection>

          {/* Recent News */}
          <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg" direction="right" delay={400}>
            {/* ... Recent News content ... */}
             <div className="flex items-center justify-between mb-6"> <h2 className="text-xl font-bold flex items-center"> <Bell className="mr-2 text-primary-500" size={24} /> Recent News </h2> </div> <div className="space-y-4"> {/* Map news here */} </div>
          </AnimatedSection>
        </div>

        {/* Notifications */}
        <AnimatedSection tag="div" className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg mt-8" delay={500}>
            {/* ... Notifications content ... */}
             <h2 className="text-xl font-bold mb-6 flex items-center"> <Bell className="mr-2 text-primary-500" size={24} /> Recent Notifications </h2> <div className="space-y-3"> {/* Map notifications here */} </div>
        </AnimatedSection>

      </div>
    </div>
  );
}