// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import GamesSidebar from './components/GamesSidebar';

// Import Pages
// ... (keep all existing page imports)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DashboardPage from './pages/DashboardPage';
import TeamPage from './pages/TeamPage';
import TeamsManagementPage from './pages/TeamsManagementPage';
import ManageTeamPage from './pages/ManageTeamPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailsPage from './pages/TournamentDetailsPage';
import UpdateTournamentPage from './pages/UpdateTournamentPage';
import LeaguePage from './pages/LeaguePage';
import CupPage from './pages/CupPage';
import NewsPage from './pages/NewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PlayersDirectoryPage from './pages/PlayersDirectoryPage';
import RulesPage from './pages/RulesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import FreeFirePage from './pages/FreeFirePage';
import CODPage from './pages/CODPage';
import Farlight84Page from './pages/Farlight84Page';
import BloodstrikePage from './pages/BloodstrikePage'; // *** IMPORT NEW PAGE ***


import './App.css';

export default function App() {
  const [selectedGame, setSelectedGame] = useState('all');

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    console.log("Selected game filter:", game);
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white flex flex-col">
        <Header />
        <div className="flex flex-1 pt-16">
          <aside className="w-20 hidden lg:block bg-dark-800 p-3 shadow-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0">
            <GamesSidebar selectedGame={selectedGame} onGameSelect={handleGameSelect} />
          </aside>
          <main className="flex-1 overflow-y-auto">
             <div className="p-4 sm:p-6 lg:p-8">
                <Routes>
                  {/* ... (keep all existing routes) ... */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/edit-profile" element={<EditProfilePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/team/:teamId" element={<TeamPage />} />
                  <Route path="/my-teams" element={<TeamsManagementPage />} />
                  <Route path="/manage-team/:teamId" element={<ManageTeamPage />} />
                  <Route path="/create-tournament" element={<CreateTournamentPage />} />
                  <Route path="/tournaments" element={<TournamentsPage selectedGameFilter={selectedGame} />} />
                  <Route path="/tournament/:tournamentId" element={<TournamentDetailsPage />} />
                  <Route path="/update-tournament/:tournamentId" element={<UpdateTournamentPage />} />
                  <Route path="/league/:leagueId" element={<LeaguePage />} />
                  <Route path="/cup/:cupId" element={<CupPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/players" element={<PlayersDirectoryPage selectedGameFilter={selectedGame} />} />
                  <Route path="/rules" element={<RulesPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  {/* Game Specific Hub Pages */}
                  <Route path="/freefire" element={<FreeFirePage />} />
                  <Route path="/cod" element={<CODPage />} />
                  <Route path="/farlight84" element={<Farlight84Page />} />
                  <Route path="/bloodstrike" element={<BloodstrikePage />} /> {/* *** ADD NEW ROUTE *** */}
                  {/* Add routes for other games like /mobilelegends */}

                </Routes>
             </div>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}