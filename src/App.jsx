// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import TeamPage from './pages/TeamPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import GuidancePage from './pages/GuidancePage.jsx'; 
import AdminGuidePage from './pages/AdminGuidePage.jsx'; 
import StorePage from './pages/StorePage.jsx';

// --- NEW SCRIMS PAGE IMPORTS ---
import CreateScrimPage from './pages/CreateScrimPage.jsx';
import ManageScrimPage from './pages/ManageScrimPage.jsx';
import ManageScrimsListPage from './pages/ManageScrimsListPage.jsx';
import ScrimDetailsPage from './pages/ScrimDetailsPage.jsx';
import FreeFireScrimsPage from './pages/FreeFireScrimsPage.jsx';
import MobileLegendsScrimsPage from './pages/MobileLegendsScrimsPage.jsx';
import Farlight84ScrimsPage from './pages/Farlight84ScrimsPage.jsx';
// --- END NEW SCRIMS PAGE IMPORTS ---

// --- Component Imports ---
import Header from './components/Header';
import Footer from './components/Footer';
import GamesSidebar from './components/GamesSidebar';
import PrivateRoute from './components/PrivateRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AdminRoute from './components/AdminRoute'; 
import { TeamUpdateProvider } from './contexts/TeamUpdateContext.jsx'; 

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
  const { loading } = useAuth(); 

   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900 text-white">
        {/* You can use a simple loader here, or a more complex one */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Header />
        {/* --- WRAP CONTENT IN TEAM UPDATE CONTEXT --- */}
        <TeamUpdateProvider>
          <LayoutWrapper> {/* Use the wrapper */}
            <Routes>
              {/* --- Public-Only Routes (Redirects if logged in) --- */}
              <Route 
                path="/" 
                element={
                  <PublicOnlyRoute>
                    <LandingPage />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicOnlyRoute>
                    <LoginPage />
                  </PublicOnlyRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicOnlyRoute>
                    <SignUpPage />
                  </PublicOnlyRoute>
                } 
              />

              {/* --- Other Public Routes --- */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/guidance" element={<GuidancePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/freefire" element={<FreeFirePage />} />
              <Route path="/cod" element={<CODPage />} />
              <Route path="/farlight84" element={<Farlight84Page />} />
              <Route path="/mobilelegends" element={<MobileLegendsPage />} />
              <Route path="/bloodstrike" element={<BloodstrikePage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/team/:teamId" element={<TeamPage />} />
              <Route path="/tournament/:tournamentId" element={<TournamentDetailsPage />} />
              <Route path="/cup/:cupId" element={<CupPage />} />
              <Route path="/players" element={<PlayersDirectoryPage />} />
              <Route path="/store" element={<StorePage />} />


              {/* --- NEW PUBLIC SCRIMS ROUTES --- */}
              <Route path="/scrim/:scrimId" element={<ScrimDetailsPage />} /> 
              <Route path="/freefire/scrims" element={<FreeFireScrimsPage />} />
              <Route path="/mobilelegends/scrims" element={<MobileLegendsScrimsPage />} />
              <Route path="/farlight84/scrims" element={<Farlight84ScrimsPage />} />
              {/* --- END NEW PUBLIC SCRIMS ROUTES --- */}


              {/* --- Private Routes (For Any Logged-in User) --- */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/edit-profile" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
              <Route path="/my-teams" element={<PrivateRoute><TeamsManagementPage /></PrivateRoute>} />
              <Route path="/manage-team/:teamId" element={<PrivateRoute><ManageTeamPage /></PrivateRoute>} />

              {/* --- ADMIN-ONLY Routes --- */}
              <Route 
                path="/admin/manage-scrims" 
                element={<AdminRoute><ManageScrimsListPage /></AdminRoute>} 
              />
              <Route 
                path="/admin/create-scrim" 
                element={<AdminRoute><CreateScrimPage /></AdminRoute>} 
              />
              <Route 
                path="/admin/manage-scrim/:scrimId" 
                element={<AdminRoute><ManageScrimPage /></AdminRoute>} 
              />
              <Route 
                path="/create-tournament" 
                element={<AdminRoute><CreateTournamentPage /></AdminRoute>} 
              />
              <Route 
                path="/update-tournament/:tournamentId" 
                element={<AdminRoute><UpdateTournamentPage /></AdminRoute>} 
              />
              <Route 
                path="/leagues" 
                element={<AdminRoute><LeaguePage /></AdminRoute>} 
              />
              <Route 
                path="/admin-guide" 
                element={<AdminRoute><AdminGuidePage /></AdminRoute>} 
              />

            </Routes>
          </LayoutWrapper>
        </TeamUpdateProvider>
        <Footer />
      </div>
    </BrowserRouter>
  );
}