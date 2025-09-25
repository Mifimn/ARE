
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DashboardPage from './pages/DashboardPage';
import TeamPage from './pages/TeamPage';
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
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-white">
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/team/:id" element={<TeamPage />} />
            <Route path="/create-tournament" element={<CreateTournamentPage />} />
            <Route path="/tournaments" element={<TournamentsPage />} />
            <Route path="/tournament/:id" element={<TournamentDetailsPage />} />
            <Route path="/update-tournament/:id" element={<UpdateTournamentPage />} />
            <Route path="/league/:id" element={<LeaguePage />} />
            <Route path="/cup/:id" element={<CupPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/players" element={<PlayersDirectoryPage />} />
            <Route path="/rules" element={<RulesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
