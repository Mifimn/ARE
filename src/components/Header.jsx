// src/components/Header.jsx

import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Check if user is authenticated (for demo purposes, check if we're not on login/signup pages)
  const isAuthenticated = !['/', '/login', '/signup'].includes(location.pathname);

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

  // UPDATED: Removed 'Teams', Renamed 'Tournaments' to 'Games'
  const publicNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/tournaments' }, // Renamed from Tournaments
    // { name: 'Teams', href: '/players' }, // Removed
    { name: 'About Us', href: '/about' },
    { name: 'News', href: '/news' },
  ];

  // UPDATED: Removed 'Teams', Renamed 'Tournaments' to 'Games'
  const authenticatedNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Games', href: '/tournaments' }, // Renamed from Tournaments
    // { name: 'Teams', href: '/players' }, // Removed
    { name: 'News', href: '/news' },
    { name: 'Create Tournament', href: '/create-tournament' },
  ];

  const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

  return (
    <header className="bg-dark-800 shadow-lg fixed w-full top-0 z-50 h-16"> {/* Ensure header has a fixed height, e.g., h-16 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16"> {/* Match header height */}
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-bold text-xl">ARE</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">Africa Rise Esports</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8"> {/* Adjusted spacing */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  // Highlight '/tournaments' when 'Games' is active
                  (location.pathname === item.href || (item.name === 'Games' && location.pathname.startsWith('/tournaments')))
                    ? 'text-primary-500 bg-dark-700'
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-2 py-1 rounded-md text-sm font-medium" // Reduced padding slightly
                >
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Profile"
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                  <span className="hidden lg:inline">ProGamer2024</span> {/* Hide username on medium screens */}
                </button>

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
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        window.location.href = '/'; // Simulate logout
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700"
                    >
                      <LogOut className="mr-2" size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary whitespace-nowrap" // Ensure button text doesn't wrap
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white p-2" // Added padding for easier tapping
            >
              <span className="sr-only">Open main menu</span> {/* Accessibility */}
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-dark-800 border-t border-dark-700 shadow-lg z-40"> {/* Position below header */}
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                     (location.pathname === item.href || (item.name === 'Games' && location.pathname.startsWith('/tournaments')))
                      ? 'text-primary-500 bg-dark-700'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-dark-600 pt-4 pb-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-3 py-2 mb-2">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                        alt="Profile"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <span className="text-white font-medium">ProGamer2024</span>
                    </div>
                    <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                    <Link to="/edit-profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                    <button onClick={() => { setIsMenuOpen(false); window.location.href = '/'; }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700">Logout</button>
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