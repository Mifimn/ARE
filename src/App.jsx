// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer'; 
import GamesSidebar from './components/GamesSidebar';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DashboardPage from './pages/DashboardPage';
import TeamPage from './pages/TeamPage';
import TeamsManagementPage from './pages/TeamsManagementPage'; 
// 🔑 Existing Import
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

// 🔑 NEW IMPORT: The game-specific hub page
import FreeFirePage from './pages/FreeFirePage';

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

{/* Sidebar */}
<aside className="w-20 hidden lg:block bg-dark-800 p-3 shadow-lg sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex-shrink-0">
<GamesSidebar
selectedGame={selectedGame}
onGameSelect={handleGameSelect}
/>
</aside>

{/* Page Content */}
<main className="flex-1 overflow-y-auto">
<div className="p-4 sm:p-6 lg:p-8">
<Routes>
{/* General User Routes */}
<Route path="/" element={<LandingPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/signup" element={<SignUpPage />} />
<Route path="/profile" element={<ProfilePage />} />
<Route path="/edit-profile" element={<EditProfilePage />} />
<Route path="/dashboard" element={<DashboardPage />} />

{/* Team Routes (No IDs) */}
<Route path="/team" element={<TeamPage />} />
<Route path="/my-teams" element={<TeamsManagementPage />} /> 
<Route path="/manage-team" element={<ManageTeamPage />} /> 

{/* Tournament Routes (No IDs) */}
<Route path="/create-tournament" element={<CreateTournamentPage />} />
<Route path="/tournaments" element={<TournamentsPage selectedGameFilter={selectedGame} />} />
<Route path="/tournament" element={<TournamentDetailsPage />} />
<Route path="/update-tournament" element={<UpdateTournamentPage />} />

{/* 🔑 NEW DYNAMIC ROUTE for Game Hub Pages */}
                    {/* This route catches URLs like /game/free-fire and /game/valorant */}
                    {/* For now, we only point it to FreeFirePage as requested. */}
                    {/* In a real app, you'd check the slug and load the correct component. */}
                    <Route path="/game/:gameSlug" element={<FreeFirePage />} />

{/* Competition Routes (No IDs) */}
<Route path="/league" element={<LeaguePage />} />
<Route path="/cup" element={<CupPage />} />

{/* Directory and Info Pages */}
<Route path="/news" element={<NewsPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/contact" element={<ContactPage />} />
<Route path="/players" element={<PlayersDirectoryPage selectedGameFilter={selectedGame} />} />
<Route path="/rules" element={<RulesPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="/privacy" element={<PrivacyPage />} />
</Routes>
</div>
</main>

</div> {/* End Main content area flex wrapper */}

<Footer />
</div>
</Router>
);
}