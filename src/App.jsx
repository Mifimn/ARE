// src/App.jsx
import React, { useState } from 'react'; // Added useState
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from './contexts/AuthContext.jsx';

// --- Page Imports ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import RulesPage from './pages/RulesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FreeFirePage from './pages/FreeFirePage';
import CODPage from './pages/CODPage';
import Farlight84Page from './pages/Farlight84Page';
import MobileLegendsPage from './pages/MobileLegendsPage';
import BloodstrikePage from './pages/BloodstrikePage';
import NewsPage from './pages/NewsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import TeamsManagementPage from './pages/TeamsManagementPage';
import ManageTeamPage from './pages/ManageTeamPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailsPage from './pages/TournamentDetailsPage';
import UpdateTournamentPage from './pages/UpdateTournamentPage';
import LeaguePage from './pages/LeaguePage';
import CupPage from './pages/CupPage';
import PlayersDirectoryPage from './pages/PlayersDirectoryPage';
import TeamPage from './pages/TeamPage';
import AboutPage from './pages/AboutPage.jsx';

// --- Component Imports ---
import Header from './components/Header';
import Footer from './components/Footer';
import GamesSidebar from './components/GamesSidebar';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

// Component to handle sidebar logic based on route
function LayoutWrapper({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    const [selectedGame, setSelectedGame] = useState('all'); // Add state for sidebar

    // Determine if sidebar should be shown (user logged in AND not on specific pages)
    const showSidebar = user && !['/', '/login', '/signup'].includes(location.pathname);

    return (
        <div className="flex flex-1 pt-16">
            {showSidebar && (
                <aside className="w-20 hidden lg:block bg-dark-800 p-3 shadow-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0">
                    <GamesSidebar selectedGame={selectedGame} onGameSelect={setSelectedGame} />
                </aside>
            )}
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}


export default function App() {
  const { loading } = useAuth(); // Only need loading here now

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900 text-white">
        <h2 className="text-2xl">Loading Authentication...</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Header />
        <LayoutWrapper> {/* Use the wrapper */}
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/news" element={<NewsPage />} />
            {/* Game Hubs are Public */}
            <Route path="/freefire" element={<FreeFirePage />} />
            <Route path="/cod" element={<CODPage />} />
            <Route path="/farlight84" element={<Farlight84Page />} />
            <Route path="/mobilelegends" element={<MobileLegendsPage />} />
            <Route path="/bloodstrike" element={<BloodstrikePage />} />
            {/* Main Games/Tournaments Page */}
            <Route path="/tournaments" element={<TournamentsPage />} /> {/* Changed this to be potentially public */}
            {/* Public view of player and team profiles */}
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/team/:teamId" element={<TeamPage />} />
            {/* Public view of tournament details, cups, leagues */}
            <Route path="/tournament/:tournamentId" element={<TournamentDetailsPage />} />
            <Route path="/cup/:cupId" element={<CupPage />} />
            <Route path="/league/:leagueId" element={<LeaguePage />} />
            {/* Player Directory potentially public */}
            <Route path="/players" element={<PlayersDirectoryPage />} />


            {/* --- Private Routes --- */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            {/* Route for logged-in user's own profile */}
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
            <Route path="/my-teams" element={<PrivateRoute><TeamsManagementPage /></PrivateRoute>} />
            <Route path="/manage-team/:teamId" element={<PrivateRoute><ManageTeamPage /></PrivateRoute>} />
            <Route path="/create-tournament" element={<PrivateRoute><CreateTournamentPage /></PrivateRoute>} />
            <Route path="/update-tournament/:tournamentId" element={<PrivateRoute><UpdateTournamentPage /></PrivateRoute>} />
            {/* Add any other strictly private routes here */}

          </Routes>
        </LayoutWrapper>
        <Footer />
      </div>
    </BrowserRouter>
  );
}