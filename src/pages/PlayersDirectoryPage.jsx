// src/pages/PlayersDirectoryPage.jsx

import { useState } from 'react';
import { User, Search, MapPin, Gamepad2, PlusCircle, Eye, ArrowRight, Star, AlertTriangle, Users } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

// --- Data & Filters ---

// List of African countries (for filter)
const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
  "Congo, Democratic Republic of the", "Congo, Republic of the", "Cote d'Ivoire",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
  "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho",
  "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
  "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
  "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia",
  "Uganda", "Zambia", "Zimbabwe"
].sort();

const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];

// Placeholder Player Data
const allPlayers = [
    { id: 101, username: 'ProGamer2024', fullName: 'John Doe', country: 'Nigeria', favoriteGame: 'FIFA 24', wins: 145, avatar: '/images/ava_m_1.png', verified: true },
    { id: 102, username: 'SnipeMasterZA', fullName: 'Sarah Mokoena', country: 'South Africa', favoriteGame: 'COD Warzone', wins: 98, avatar: '/images/ava_f_2.png', verified: true },
    { id: 103, username: 'DesertFox', fullName: 'Amir Hassan', country: 'Egypt', favoriteGame: 'Mobile Legends', wins: 210, avatar: '/images/ava_m_3.png', verified: false },
    { id: 104, username: 'GoldenStick', fullName: 'Kwame Agyei', country: 'Ghana', favoriteGame: 'Valorant', wins: 112, avatar: '/images/ava_m_4.png', verified: true },
    { id: 105, username: 'RabatRacer', fullName: 'Fatima El Fassi', country: 'Morocco', favoriteGame: 'FIFA 24', wins: 75, avatar: '/images/ava_f_5.png', verified: false },
    { id: 106, username: 'KigaliKilla', fullName: 'Eric Uwimana', country: 'Rwanda', favoriteGame: 'Apex Legends', wins: 55, avatar: '/images/ava_m_6.png', verified: true },
];

// Placeholder Team Data
const allTeams = [
    { id: 1, name: 'Lagos Lions', logo: '/images/team_ll.png', country: 'Nigeria', game: 'FIFA 24', members: 5, wins: 55 },
    { id: 2, name: 'Cape Titans', logo: '/images/team_ct.png', country: 'South Africa', game: 'COD Warzone', members: 4, wins: 42 },
    { id: 3, name: 'Nile Vultures', logo: '/images/team_nv.png', country: 'Egypt', game: 'Mobile Legends', members: 7, wins: 78 },
    { id: 4, name: 'Accra Avengers', logo: '/images/team_aa.png', country: 'Ghana', game: 'Valorant', members: 5, wins: 61 },
    { id: 5, name: 'Marrakech Marauders', logo: '/images/team_mm.png', country: 'Morocco', game: 'FIFA 24', members: 3, wins: 30 },
    { id: 6, name: 'Kigali Kings', logo: '/images/team_kk.png', country: 'Rwanda', game: 'Apex Legends', members: 6, wins: 22 },
];


export default function PlayersDirectoryPage() {
    // Use search params to manage the view state (players or teams)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get('view') || 'players'; 

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('All');
    const [filterGame, setFilterGame] = useState('All');

    // Placeholder: Teams the user is associated with (for the action card)
    const userTeams = [{ id: 1, name: 'Lagos Lions' }, { id: 2, name: 'Accra Avengers' }]; 

    // --- Filtering Logic ---
    let filteredResults;

    if (currentView === 'players') {
        filteredResults = allPlayers.filter(player => {
            const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase()) || player.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = filterCountry === 'All' || player.country === filterCountry;
            const matchesGame = filterGame === 'All' || player.favoriteGame === filterGame;
            return matchesSearch && matchesCountry && matchesGame;
        });
    } else { // currentView === 'teams'
        filteredResults = allTeams.filter(team => {
            const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = filterCountry === 'All' || team.country === filterCountry;
            const matchesGame = filterGame === 'All' || team.game === filterGame;
            return matchesSearch && matchesCountry && matchesGame;
        });
    }


    // --- Helper Functions ---

    const setView = (view) => {
        // Reset filters when switching views for a clean start
        setSearchTerm('');
        setFilterCountry('All');
        setFilterGame('All');
        setSearchParams({ view });
    };

    // --- Player Card Component ---
    const PlayerCard = ({ player, delay }) => (
        <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-5 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg relative">
            {/* Link to generic /profile, assuming player profile uses query params or local state */}
            <Link to={`/profile`} className="group block"> 
                <div className="flex items-center flex-col text-center mb-4">
                    <img 
                        src={player.avatar.startsWith('/') ? player.avatar : '/images/placeholder_player.png'}
                        alt={`${player.username}'s avatar`} 
                        className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary-500/30 group-hover:border-primary-400/70 transition-colors"
                    />
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{player.username}</h3>
                    <p className="text-sm text-gray-400">{player.fullName}</p>
                </div>

                {player.verified && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center border border-dark-800" title="Verified Player">
                        <Star className="w-3 h-3 text-white" />
                    </div>
                )}

                <div className="space-y-2 text-sm text-gray-300 border-t border-dark-700/50 pt-3">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center">
                            <MapPin size={14} className="mr-2 text-primary-400" />
                            {player.country}
                        </span>
                        <span className="text-green-400 font-semibold">{player.wins} Wins</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center">
                            <Gamepad2 size={14} className="mr-2 text-primary-400" />
                            {player.favoriteGame}
                        </span>
                    </div>
                </div>

                <div className="mt-4 text-primary-400 text-sm font-medium flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    View Player Profile
                    <ArrowRight size={14} className="ml-1" />
                </div>
            </Link>
        </AnimatedSection>
    );

    // --- Team Card Component ---
    const TeamCard = ({ team, delay }) => (
        <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-5 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg">
            {/* Link points to the generic /team page */}
            <Link to={`/team`} className="group block"> 
                <div className="flex items-center mb-4">
                    <img 
                        src={team.logo.startsWith('/') ? team.logo : '/images/placeholder_team.png'}
                        alt={`${team.name} logo`} 
                        className="w-12 h-12 rounded-lg object-cover mr-4 border-2 border-primary-500/30 group-hover:border-primary-400/70 transition-colors"
                    />
                    <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{team.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-primary-400" />
                        {team.country}
                    </div>
                    <div className="flex items-center">
                        <Gamepad2 size={14} className="mr-2 text-primary-400" />
                        {team.game}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
                        <span className="flex items-center">
                            <Users size={14} className="mr-2 text-primary-400" />
                            {team.members} Members
                        </span>
                        <span className="text-green-400 font-semibold">{team.wins} Wins</span>
                    </div>
                </div>
                <div className="mt-4 text-primary-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    View Team Profile
                    <ArrowRight size={14} className="ml-1" />
                </div>
            </Link>
        </AnimatedSection>
    );


    return (
        <div className="pt-20 min-h-screen bg-dark-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                <AnimatedSection tag="div" delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 mb-2 flex items-center justify-center">
                        {currentView === 'players' ? <User className="w-8 h-8 mr-3" /> : <Users className="w-8 h-8 mr-3" />} 
                        Find {currentView === 'players' ? 'Players' : 'Teams'}
                    </h1>
                    <p className="text-center text-gray-400">
                        {currentView === 'players' 
                            ? 'Discover and connect with top African esports talent.' 
                            : 'Join a winning squad or build your own esports legacy.'}
                    </p>
                </AnimatedSection>

                {/* --- Tab Navigation --- */}
                <div className="flex justify-center mb-8">
                    <div className="bg-dark-800 p-1 rounded-xl shadow-lg flex border border-dark-700">
                        <button
                            onClick={() => setView('players')}
                            className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-colors duration-200 ${
                                currentView === 'players' 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'text-gray-400 hover:bg-dark-700'
                            }`}
                        >
                            <User className="w-5 h-5 mr-2" /> Players
                        </button>
                        <button
                            onClick={() => setView('teams')}
                            className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-colors duration-200 ${
                                currentView === 'teams' 
                                    ? 'bg-primary-600 text-white shadow-md' 
                                    : 'text-gray-400 hover:bg-dark-700'
                            }`}
                        >
                            <Users className="w-5 h-5 mr-2" /> Teams
                        </button>
                    </div>
                </div>

                {/* --- Section 1: Team Actions (Links updated to /my-teams) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* View My Teams Card */}
                    <AnimatedSection tag="div" delay={100} className="bg-primary-900/40 p-6 rounded-xl border border-primary-700 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]">
                        <div>
                            <div className="flex items-center mb-2">
                                <Eye className="w-6 h-6 mr-3 text-primary-300" />
                                <h2 className="text-2xl font-bold text-white">Your Teams ({userTeams.length})</h2>
                            </div>
                            <p className="text-gray-300 mb-4">Quickly access the teams you're a member of.</p>
                            {/* Link points to the new team management hub */}
                            <Link to="/my-teams" className="btn-secondary text-sm flex items-center w-fit">
                                View Teams <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </div>
                    </AnimatedSection>

                    {/* Create New Team Card */}
                    <AnimatedSection tag="div" delay={200} className="bg-green-900/40 p-6 rounded-xl border border-green-700 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]">
                        <div>
                            <div className="flex items-center mb-2">
                                <PlusCircle className="w-6 h-6 mr-3 text-green-300" />
                                <h2 className="text-2xl font-bold text-white">Create New Team</h2>
                            </div>
                            <p className="text-gray-300 mb-4">Start your own legacy. Assemble your squad today!</p>
                            {/* Link points to the new team management hub */}
                            <Link to="/my-teams" className="btn-primary text-sm flex items-center w-fit">
                                Create Team <PlusCircle size={16} className="ml-2" />
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>

                {/* --- Section 2: Search and Filters (Dynamic based on view) --- */}
                <AnimatedSection tag="div" delay={300} className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">
                        Search {currentView === 'players' ? 'Players' : 'Teams'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Search Input */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search by ${currentView === 'players' ? 'Username or Name' : 'Team Name'}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field w-full pl-10"
                            />
                        </div>

                        {/* Country Filter */}
                        <div>
                            <select
                                value={filterCountry}
                                onChange={(e) => setFilterCountry(e.target.value)}
                                className="input-field w-full appearance-none"
                            >
                                <option value="All">All African Countries</option>
                                {africanCountries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Game Filter */}
                        <div>
                            <select
                                value={filterGame}
                                onChange={(e) => setFilterGame(e.target.value)}
                                className="input-field w-full appearance-none"
                            >
                                <option value="All">All Games</option>
                                {availableGames.map(game => (
                                    <option key={game} value={game}>{game}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </AnimatedSection>

                {/* --- Section 3: Results List (Dynamic rendering) --- */}
                <AnimatedSection tag="div" delay={400}>
                    <h2 className="text-2xl font-bold mb-6 text-primary-400 border-b border-dark-700 pb-2">
                        {currentView === 'players' ? 'Top Players' : 'Available Teams'} ({filteredResults.length})
                    </h2>

                    {filteredResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Dynamically render PlayerCard or TeamCard */}
                            {filteredResults.map((item, index) => (
                                currentView === 'players' 
                                    ? <PlayerCard key={item.id} player={item} delay={index * 100 + 500} />
                                    : <TeamCard key={item.id} team={item} delay={index * 100 + 500} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-dark-800 p-6 rounded-xl text-center border border-yellow-700/50">
                            <AlertTriangle className="w-6 h-6 mx-auto text-yellow-500 mb-3" />
                            <p className="text-yellow-300">
                                No {currentView === 'players' ? 'players' : 'teams'} found matching your filters. Try adjusting your search criteria.
                            </p>
                        </div>
                    )}
                </AnimatedSection>

            </div>
        </div>
    );
}