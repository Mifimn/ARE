// src/pages/PlayersDirectoryPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
// *** Add Heart to imports ***
import { User, Search, MapPin, Gamepad2, PlusCircle, Eye, ArrowRight, Star, AlertTriangle, Users, Loader2, Heart } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

// --- Data & Filters ---
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

const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends', 'Free Fire', 'Bloodstrike', 'Farlight 84'].sort();

// --- Player Card Component ---
const PlayerCard = ({ player, delay }) => (
    <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-5 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg relative h-full flex flex-col">
        <Link to={`/profile/${player.username}`} className="group block flex-grow">
            <div className="flex items-center flex-col text-center mb-4">
                <img
                    src={player.avatar_url || '/images/ava_m_1.png'}
                    alt={`${player.username}'s avatar`}
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-primary-500/30 group-hover:border-primary-400/70 transition-colors"
                />
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{player.username}</h3>
                <p className="text-sm text-gray-400">{player.full_name || 'N/A'}</p>
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
                        {player.country || 'N/A'}
                    </span>
                    <span className="text-green-400 font-semibold">{player.total_wins ?? 0} Wins</span>
                </div>
                {player.favorite_games && player.favorite_games.length > 0 && (
                     <div className="flex items-center justify-between">
                        <span className="flex items-center">
                            <Gamepad2 size={14} className="mr-2 text-primary-400" />
                            {player.favorite_games[0]}
                        </span>
                    </div>
                )}
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
    <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-5 rounded-xl border border-dark-700 hover:border-primary-500/50 transition-all duration-300 shadow-lg h-full flex flex-col">
        <Link to={`/team/${team.id}`} className="group block flex-grow">
            <div className="flex items-center mb-4">
                <img
                    src={team.logo_url || '/images/placeholder_team.png'}
                    alt={`${team.name} logo`}
                    className="w-12 h-12 rounded-lg object-cover mr-4 border-2 border-primary-500/30 group-hover:border-primary-400/70 transition-colors"
                />
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{team.name}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-primary-400" />
                    {team.country || 'N/A'}
                </div>
                <div className="flex items-center">
                    <Gamepad2 size={14} className="mr-2 text-primary-400" />
                    {team.game || 'N/A'}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
                    <span className="flex items-center">
                        <Users size={14} className="mr-2 text-primary-400" />
                        ? Members {/* Placeholder */}
                    </span>
                    {/* *** Use Heart Icon here *** */}
                    <span className="text-red-400 font-semibold flex items-center"><Heart size={14} className="mr-1 fill-current"/> {team.likes ?? 0}</span>
                </div>
            </div>
            <div className="mt-4 text-primary-400 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                View Team Profile
                <ArrowRight size={14} className="ml-1" />
            </div>
        </Link>
    </AnimatedSection>
);


// --- Main Page Component ---
export default function PlayersDirectoryPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentView = searchParams.get('view') || 'players';

    // State for data, loading, error, filters
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('All');
    const [filterGame, setFilterGame] = useState('All');

    // Placeholder: Teams user is associated with
    const userTeams = [{ id: 1, name: 'Lagos Lions' }, { id: 2, name: 'Accra Avengers' }];

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setResults([]);

            try {
                let query;
                if (currentView === 'players') {
                    console.log("Fetching players...");
                    query = supabase
                        .from('profiles')
                        .select('id, username, full_name, avatar_url, country, verified, total_wins, favorite_games')
                        .order('username', { ascending: true });

                    if (searchTerm) {
                        query = query.or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
                    }
                    if (filterCountry !== 'All') {
                        query = query.eq('country', filterCountry);
                    }
                    if (filterGame !== 'All') {
                         query = query.contains('favorite_games', [filterGame]);
                    }

                } else { // currentView === 'teams'
                    console.log("Fetching teams...");
                    query = supabase
                        .from('teams')
                        .select('id, name, game, logo_url, country, likes') // Include likes
                        .order('name', { ascending: true });

                    if (searchTerm) {
                        query = query.ilike('name', `%${searchTerm}%`);
                    }
                    if (filterCountry !== 'All') {
                        query = query.eq('country', filterCountry);
                    }
                    if (filterGame !== 'All') {
                        query = query.eq('game', filterGame);
                    }
                }

                const { data, error: fetchError } = await query;
                if (fetchError) throw fetchError;

                console.log(`Fetched ${currentView}:`, data);
                setResults(data || []);

            } catch (err) {
                console.error(`Error fetching ${currentView}:`, err);
                setError(`Failed to load ${currentView}. ${err.message}`);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentView, searchTerm, filterCountry, filterGame]);


    // --- Helper Functions ---
    const setView = (view) => {
        setSearchTerm('');
        setFilterCountry('All');
        setFilterGame('All');
        setSearchParams({ view });
    };


    return (
        <div className="bg-dark-900 text-white min-h-screen">
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
                        <button onClick={() => setView('players')} className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-colors duration-200 ${ currentView === 'players' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-dark-700' }`} > <User className="w-5 h-5 mr-2" /> Players </button>
                        <button onClick={() => setView('teams')} className={`px-6 py-3 rounded-lg flex items-center font-semibold transition-colors duration-200 ${ currentView === 'teams' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-dark-700' }`} > <Users className="w-5 h-5 mr-2" /> Teams </button>
                     </div>
                </div>

                {/* --- Section 1: Team Actions --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* View My Teams Card */}
                     <AnimatedSection tag="div" delay={100} className="bg-primary-900/40 p-6 rounded-xl border border-primary-700 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]">
                         <div> <div className="flex items-center mb-2"> <Eye className="w-6 h-6 mr-3 text-primary-300" /> <h2 className="text-2xl font-bold text-white">Your Teams ({userTeams.length})</h2> </div> <p className="text-gray-300 mb-4">Quickly access the teams you're a member of.</p> <Link to="/my-teams" className="btn-secondary text-sm flex items-center w-fit"> View Teams <ArrowRight size={16} className="ml-2" /> </Link> </div>
                    </AnimatedSection>
                    {/* Create New Team Card */}
                    <AnimatedSection tag="div" delay={200} className="bg-green-900/40 p-6 rounded-xl border border-green-700 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]">
                         <div> <div className="flex items-center mb-2"> <PlusCircle className="w-6 h-6 mr-3 text-green-300" /> <h2 className="text-2xl font-bold text-white">Create New Team</h2> </div> <p className="text-gray-300 mb-4">Start your own legacy. Assemble your squad today!</p> <Link to="/my-teams" className="btn-primary text-sm flex items-center w-fit"> Create Team <PlusCircle size={16} className="ml-2" /> </Link> </div>
                    </AnimatedSection>
                </div>

                {/* --- Section 2: Search and Filters --- */}
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
                            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="input-field w-full appearance-none" > <option value="All">All African Countries</option> {africanCountries.map(country => ( <option key={country} value={country}>{country}</option> ))} </select>
                        </div>
                        {/* Game Filter */}
                        <div>
                             <select value={filterGame} onChange={(e) => setFilterGame(e.target.value)} className="input-field w-full appearance-none" > <option value="All">All Games</option> {availableGames.map(game => ( <option key={game} value={game}>{game}</option> ))} </select>
                        </div>
                    </div>
                </AnimatedSection>

                {/* --- Section 3: Results List --- */}
                <AnimatedSection tag="div" delay={400}>
                    <h2 className="text-2xl font-bold mb-6 text-primary-400 border-b border-dark-700 pb-2">
                        {currentView === 'players' ? 'Registered Players' : 'Available Teams'} ({loading ? '...' : results.length})
                    </h2>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                            <p className="ml-3 text-gray-400">Loading {currentView}...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-red-900/20 p-6 rounded-xl text-center border border-red-700/50">
                            <AlertTriangle className="w-6 h-6 mx-auto text-red-500 mb-3" />
                            <p className="text-red-300"> {error} </p>
                        </div>
                    )}

                    {/* Results Grid */}
                    {!loading && !error && results.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map((item, index) => (
                                currentView === 'players'
                                    ? <PlayerCard key={item.id} player={item} delay={index * 50} />
                                    : <TeamCard key={item.id} team={item} delay={index * 50} />
                            ))}
                        </div>
                    )}

                    {/* No Results Message */}
                    {!loading && !error && results.length === 0 && (
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