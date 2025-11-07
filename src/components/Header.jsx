// src/components/Header.jsx (Updated to move Store link to the right side)

import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
// Import ShoppingCart
import { Menu, X, LogOut, User, Settings, Trophy, Users as UsersIcon, Layers, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth
import { supabase } from '../lib/supabaseClient'; // Import supabase client

// --- Navigation Logic Helper (REMOVED 'Store' from here) ---
const getNavigation = (isAuthenticated, profile) => {
  // Store is now handled separately outside this function

  // 1. Public/Guest Navigation (When user is null)
  const publicNav = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/tournaments' },
    { name: 'Leagues', href: '/leagues' },
    { name: 'About Us', href: '/about' },
    { name: 'News', href: '/news' },
  ];

  if (!isAuthenticated) return publicNav;

  const isAdmin = profile?.is_admin;

  // 2. Admin Navigation
  if (isAdmin) {
    return [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Games', href: '/tournaments' },
      { name: 'Leagues', href: '/leagues' },
      { name: 'Create Tournament', href: '/create-tournament' },
      { name: 'Manage Tournaments', href: '/update-tournament/manage' }, 
    ];
  }

  // 3. Standard Authenticated User Navigation
  return [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Games', href: '/tournaments' },
    { name: 'My Teams', href: '/my-teams' },
    { name: 'News', href: '/news' },
  ];
};
// --- End Navigation Logic Helper ---


export default function Header() {
  const { 
    user: authUser, 
    loading: authLoading, 
    profile: userProfile 
  } = useAuth(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  const isAuthenticated = !!authUser;

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

  // Set navigation based on user role/status
  const navigation = getNavigation(isAuthenticated, userProfile);

  const displayUsername = userProfile?.username || (authUser?.email ? authUser.email.split('@')[0] : 'User');
  const displayAvatar = userProfile?.avatar_url || '/images/ava_m_1.png';
  const profileLoading = authLoading || (isAuthenticated && !userProfile);


  return (
    <header className="bg-dark-800 shadow-lg fixed w-full top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- Logo --- */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              className="h-11 w-auto" 
              src="/images/logo.png"
              alt="Africa Rise Esports Logo"
            />
            <span className="text-white font-bold text-xl hidden sm:inline ml-3">Africa Rise Esports</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  (location.pathname === item.href || 
                   (item.name === 'Games' && location.pathname.startsWith('/tournaments')) || 
                   (item.name === 'Leagues' && location.pathname.startsWith('/leagues')) || 
                   (item.name === 'My Teams' && (location.pathname.startsWith('/my-teams') || location.pathname.startsWith('/manage-team'))) || 
                   (item.name === 'Manage Tournaments' && location.pathname.startsWith('/update-tournament')) ||
                   (item.name === 'Create Tournament' && location.pathname.startsWith('/create-tournament'))) 
                    ? 'text-primary-500 bg-dark-700'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section (Now includes Store Icon) */}
          <div className="hidden md:flex items-center space-x-4">
             {/* --- NEW: Store Icon Button (Visible to everyone) --- */}
             <Link 
                to="/store" 
                title="Merchandise Store"
                className={`p-2 rounded-full transition-colors ${
                    location.pathname === '/store' 
                        ? 'bg-primary-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-primary-400 hover:bg-dark-700'
                }`}
             >
                 <ShoppingCart size={20} />
             </Link>
             {/* --- END NEW --- */}

            {profileLoading ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
            ) : isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded-md text-sm font-medium"
                >
                    <img
                      src={displayAvatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full flex-shrink-0 object-cover" 
                    />
                  <span className="hidden lg:inline">{displayUsername}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-600 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={`/profile/${userProfile?.username || authUser.id}`} // Link to profile page
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

                    {/* Dynamic Admin Links in Dropdown (KEEP THIS ONE) */}
                    {userProfile?.is_admin && (
                         <Link
                             to="/admin-guide"
                             className="flex items-center px-4 py-2 text-sm text-yellow-400 hover:text-white hover:bg-dark-700 border-t border-dark-700 mt-1 pt-1"
                             onClick={() => setIsUserMenuOpen(false)}
                         >
                             <Trophy className="mr-2" size={16} /> Admin Guide
                         </Link>
                    )}


                    {/* Logout Button */}
                    <button
                      onClick={async () => {
                        setIsUserMenuOpen(false);
                        const { error } = await supabase.auth.signOut();
                        if (error) console.error("Logout Error:", error);
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

          {/* Mobile menu button (remains unchanged) */}
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

        {/* Mobile Navigation (includes all items, including 'Store' which we re-added here) */}
        {isMenuOpen && (
           <div className="md:hidden absolute top-16 inset-x-0 bg-dark-800 border-t border-dark-700 shadow-lg z-40">
             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               {/* Mobile Nav now includes Store because we removed it from the helper */}
               {getNavigation(isAuthenticated, userProfile).map((item) => (
                    <Link
                        key={item.name} to={item.href}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${ 
                          (location.pathname === item.href || 
                           (item.name === 'Games' && location.pathname.startsWith('/tournaments')) || 
                           (item.name === 'Leagues' && location.pathname.startsWith('/leagues')) || 
                           (item.name === 'My Teams' && (location.pathname.startsWith('/my-teams') || location.pathname.startsWith('/manage-team'))) || 
                           (item.name === 'Manage Tournaments' && location.pathname.startsWith('/update-tournament')) ||
                           (item.name === 'Create Tournament' && location.pathname.startsWith('/create-tournament'))) 
                            ? 'text-primary-500 bg-dark-700' 
                            : 'text-gray-300 hover:text-white hover:bg-dark-700' 
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                   > {item.name} </Link>
               ))}
                {/* --- Add Store link back to mobile nav list manually --- */}
                <Link 
                    to="/store"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                        location.pathname === '/store' 
                        ? 'text-primary-500 bg-dark-700'
                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Store
                </Link>
               <div className="border-t border-dark-600 pt-4 pb-3">
                   {profileLoading ? (
                       <div className="px-3 py-2 text-gray-400">Loading user...</div>
                   ) : isAuthenticated ? (
                       <>
                           <div className="flex items-center px-3 py-2 mb-2">
                               <img src={displayAvatar} alt="Profile" className="w-8 h-8 rounded-full mr-3 object-cover"/>
                               <span className="text-white font-medium">{displayUsername}</span>
                           </div>
                           <Link to={`/profile/${userProfile?.username || authUser.id}`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                           <Link to="/edit-profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Settings</Link>

                           {/* Dynamic Admin Links in Mobile Dropdown */}
                            {userProfile?.is_admin && (
                                <Link to="/admin-guide" className="block px-3 py-2 rounded-md text-base font-medium text-yellow-400 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Admin Guide</Link>
                            )}

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