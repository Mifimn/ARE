// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

// --- Page Imports ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
// ... other existing page imports ...
import ContactPage from './pages/ContactPage';
import RulesPage from './pages/RulesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FreeFirePage from './pages/FreeFirePage';
import CODPage from './pages/CODPage';
import Farlight84Page from './pages/Farlight84Page';
import MobileLegendsPage from './pages/MobileLegendsPage';
import BloodstrikePage from './pages/BloodstrikePage';
import NewsPage from './pages/NewsPage'; // Added just in case
import ProfilePage from './pages/ProfilePage'; // Added just in case
import EditProfilePage from './pages/EditProfilePage'; // Added just in case
import TeamsManagementPage from './pages/TeamsManagementPage'; // Added just in case
import ManageTeamPage from './pages/ManageTeamPage'; // Added just in case
import CreateTournamentPage from './pages/CreateTournamentPage'; // Added just in case
import TournamentsPage from './pages/TournamentsPage'; // Added just in case
import TournamentDetailsPage from './pages/TournamentDetailsPage'; // Added just in case
import UpdateTournamentPage from './pages/UpdateTournamentPage'; // Added just in case
import LeaguePage from './pages/LeaguePage'; // Added just in case
import CupPage from './pages/CupPage'; // Added just in case
import PlayersDirectoryPage from './pages/PlayersDirectoryPage'; // Added just in case
import TeamPage from './pages/TeamPage'; // Added just in case

// 👇 *** ADD THIS LINE *** 👇
import AboutPage from './pages/AboutPage.jsx';

// --- Component Imports ---
import Header from './components/Header';
import Footer from './components/Footer';
import GamesSidebar from './components/GamesSidebar';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

// ... rest of your App component code ...

export default function App() {
  // ... (Your existing App component logic) ...
  const { user, loading } = useAuth();

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
        <div className="flex flex-1 pt-16">
          {user && (
            <aside className="w-20 hidden lg:block bg-dark-800 p-3 shadow-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0">
              <GamesSidebar selectedGame={'all'} onGameSelect={() => {}} />
            </aside>
          )}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                 {/* 👇 Ensure AboutPage is used correctly here 👇 */}
                 <Route path="/about" element={<AboutPage />} />
                 <Route path="/contact" element={<ContactPage />} />
                 <Route path="/rules" element={<RulesPage />} />
                 <Route path="/terms" element={<TermsPage />} />
                 <Route path="/privacy" element={<PrivacyPage />} />
                 <Route path="/freefire" element={<FreeFirePage />} />
                 <Route path="/cod" element={<CODPage />} />
                 <Route path="/farlight84" element={<Farlight84Page />} />
                 <Route path="/mobilelegends" element={<MobileLegendsPage />} />
                 <Route path="/bloodstrike" element={<BloodstrikePage />} />
                 <Route path="/news" element={<NewsPage />} />

                {/* --- Private Routes --- */}
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
                <Route path="/my-teams" element={<PrivateRoute><TeamsManagementPage /></PrivateRoute>} />
                <Route path="/manage-team/:teamId" element={<PrivateRoute><ManageTeamPage /></PrivateRoute>} />
                <Route path="/create-tournament" element={<PrivateRoute><CreateTournamentPage /></PrivateRoute>} />
                <Route path="/tournaments" element={<PrivateRoute><TournamentsPage selectedGameFilter={'all'} /></PrivateRoute>} />
                <Route path="/tournament/:tournamentId" element={<PrivateRoute><TournamentDetailsPage /></PrivateRoute>} />
                <Route path="/update-tournament/:tournamentId" element={<PrivateRoute><UpdateTournamentPage /></PrivateRoute>} />
                 <Route path="/league/:leagueId" element={<PrivateRoute><LeaguePage /></PrivateRoute>} />
                 <Route path="/cup/:cupId" element={<PrivateRoute><CupPage /></PrivateRoute>} />
                 <Route path="/players" element={<PrivateRoute><PlayersDirectoryPage selectedGameFilter={'all'} /></PrivateRoute>} />
                 <Route path="/team/:teamId" element={<PrivateRoute><TeamPage /></PrivateRoute>} /> {/* Added missing TeamPage Route */}
              </Routes>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}