// src/components/Header.jsx

import React, { useState, useEffect, useRef } from 'react'; // Added React import
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, Trophy, Users as UsersIcon } from 'lucide-react'; // --- ADDED UsersIcon ---
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth
import { supabase } from '../lib/supabaseClient'; // Import supabase client

export default function Header() {
  const { user: authUser, loading: authLoading } = useAuth(); // Get user and loading state
  const [profile, setProfile] = useState(null); // State for profile data
  const [profileLoading, setProfileLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Use authUser to determine authentication status
  const isAuthenticated = !!authUser; // True if authUser is not null/undefined

  // Fetch profile when authUser exists or changes
  useEffect(() => {
    if (authUser && !profileLoading) {
      const fetchProfile = async () => {
        setProfileLoading(true);
        console.log("[Header] Fetching profile for user:", authUser.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url') // Select only needed fields
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error("[Header] Error fetching profile:", error.message);
        } else if (data) {
          console.log("[Header] Profile data fetched:", data);
          setProfile(data);
        } else {
            console.warn("[Header] No profile found for user, using defaults.");
            // Set defaults if no profile row exists yet
            setProfile({
                username: authUser.email?.split('@')[0] || 'User',
                avatar_url: '/images/ava_m_1.png' // Default avatar
            });
        }
        setProfileLoading(false);
      };
      fetchProfile();
    } else if (!authUser) {
      // Clear profile if user logs out
      setProfile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]); // Re-run when authUser changes


  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation arrays (keep as provided)
  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/tournaments' },
    { name: 'About Us', href: '/about' },
    { name: 'News', href: '/news' },
  ];
  const authenticatedNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Games', href: '/tournaments' },
    { name: 'My Teams', href: '/my-teams' }, // --- "MY TEAMS" LIVES HERE ---
    { name: 'News', href: '/news' },
    { name: 'Create Tournament', href: '/create-tournament' },
    { name: 'Manage Tournaments', href: '/update-tournament/manage' }, 
  ];
  const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

  // Determine display values with fallbacks
  const displayUsername = profile?.username || (authUser?.email ? authUser.email.split('@')[0] : 'User');
  const displayAvatar = profile?.avatar_url || '/images/ava_m_1.png'; // Default avatar path

  return (
    <header className="bg-dark-800 shadow-lg fixed w-full top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- Updated Logo --- */}
          <Link to="/" className="flex items-center flex-shrink-0">
            {/* Use logo.png */}
            <img
              className="h-11 w-auto" // Adjust height as needed
              src="/images/logo.png"
              alt="Africa Rise Esports Logo"
            />
            {/* Optional: Keep text based on original code */}
            <span className="text-white font-bold text-xl hidden sm:inline ml-3">Africa Rise Esports</span>
          </Link>
          {/* --- End Updated Logo --- */}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  (location.pathname === item.href || 
                   (item.name === 'Games' && location.pathname.startsWith('/tournaments')) || 
                   (item.name === 'My Teams' && (location.pathname.startsWith('/my-teams') || location.pathname.startsWith('/manage-team'))) || 
                   (item.name === 'Manage Tournaments' && location.pathname.startsWith('/update-tournament'))) 
                    ? 'text-primary-500 bg-dark-700'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section - Updated with dynamic data */}
          <div className="hidden md:flex items-center space-x-4">
            {authLoading ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded-md text-sm font-medium"
                  disabled={profileLoading} // Disable button while profile loads
                >
                  {profileLoading ? (
                     <div className="w-8 h-8 rounded-full bg-dark-700 animate-pulse"></div> // Placeholder while loading profile
                  ) : (
                    <img
                      src={displayAvatar} // Use fetched or default avatar
                      alt="Profile"
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover" // Added object-cover
                    />
                  )}
                  {/* Use fetched or default username */}
                  <span className="hidden lg:inline">{displayUsername}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="mr-2" size={16} /> Profile
                    </Link>
                    <Link
                      to="/edit-profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="mr-2" size={16} /> Settings
                    </Link>
                    
                    {/* --- REMOVED "My Teams" and "Manage Tournaments" from here --- */}
                    
                    {/* Updated Logout Button */}
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        const { error } = await supabase.auth.signOut(); // Call signOut
                        if (error) console.error("Logout Error:", error);
                        // No need for window.location.href, AuthContext listener handles state
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700"
                    >
                      <LogOut className="mr-2" size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not Authenticated
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          {/* End Auth Section */}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Updated Auth Section */}
        {isMenuOpen && (
           <div className="md:hidden absolute top-16 inset-x-0 bg-dark-800 border-t border-dark-700 shadow-lg z-40">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                    <Link
                        key={item.name} to={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${ 
                          (location.pathname === item.href || 
                           (item.name === 'Games' && location.pathname.startsWith('/tournaments')) ||
                           (item.name === 'My Teams' && (location.pathname.startsWith('/my-teams') || location.pathname.startsWith('/manage-team'))) || 
                           (item.name === 'Manage Tournaments' && location.pathname.startsWith('/update-tournament'))) 
                           ? 'text-primary-500 bg-dark-700' 
                           : 'text-gray-300 hover:text-white hover:bg-dark-700' 
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                    > {item.name} </Link>
                ))}
                <div className="border-t border-dark-600 pt-4 pb-3">
                    {authLoading ? (
                        <div className="px-3 py-2 text-gray-400">Loading user...</div>
                    ) : isAuthenticated ? (
                        <>
                            <div className="flex items-center px-3 py-2 mb-2">
                                <img src={displayAvatar} alt="Profile" className="w-8 h-8 rounded-full mr-3 object-cover"/>
                                <span className="text-white font-medium">{displayUsername}</span>
                            </div>
                            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                            <Link to="/edit-profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                            
                            {/* --- REMOVED "My Teams" and "Manage Tournaments" from here --- */}
                            
                            <button onClick={async () => { setIsMenuOpen(false); await supabase.auth.signOut(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="block text-center mt-2 px-3 py-2 rounded-md text-base font-medium btn-primary" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
             </div>
           </div>
        )}
      </div>
    </header>
  );
}
