// src/pages/TeamsManagementPage.jsx (FIXED - Using standard Tailwind colors for guaranteed display)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Users, ArrowRight, X, Image, Gamepad, Edit3 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Data ---
const userTeams = [
    { id: 1, name: 'Lagos Lions', logo: '/images/team_ll.png', game: 'FIFA 24', members: 5, wins: 55 },
    { id: 4, name: 'Accra Avengers', logo: '/images/team_aa.png', game: 'Valorant', members: 5, wins: 61 },
    { id: 6, name: 'Kigali Kings', logo: '/images/team_kk.png', game: 'Apex Legends', members: 6, wins: 22 },
];


// --- Component for a single team in the list (Unchanged) ---
const TeamListItem = ({ team, delay }) => (
    <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center justify-between transition-colors hover:bg-dark-700/70">
        <div className="flex items-center">
            <img 
                src={team.logo.startsWith('/') ? team.logo : '/images/placeholder_team.png'}
                alt={`${team.name} logo`} 
                className="w-10 h-10 rounded-lg object-cover mr-4 border border-primary-500/30"
            />
            <div>
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-sm text-gray-400">{team.game} &bull; {team.members} Members</p>
            </div>
        </div>

        <Link to="/team" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center group transition-colors">
            View Team 
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
    </AnimatedSection>
);

// --- New Component: Create Team Form (STYLES REVISED for guaranteed display) ---
const CreateTeamForm = ({ onClose }) => {
    const [teamName, setTeamName] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New Team Data:', { teamName, gameTitle, logo: logoPreview });
        alert(`Team "${teamName}" created! (Simulated)`);
        onClose(); // Close the form after submission
    };

    return (
        // 🔑 FIX: Using standard black/white/blue colors to guarantee visibility.
        <AnimatedSection delay={0} className="p-6 bg-gray-800 rounded-xl border-2 border-blue-600 shadow-2xl relative text-white">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors z-20"
                aria-label="Close form"
            >
                <X size={24} />
            </button>
            <h2 className="text-3xl font-extrabold text-blue-400 mb-6 flex items-center">
                <Edit3 className="mr-3" size={24} /> New Team Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Team Name */}
                <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Users size={16} className="mr-2 text-blue-400" /> Team Name
                    </label>
                    <input
                        type="text"
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g., Cyber Ninjas, Alpha Squad"
                        required
                        // 🔑 FIX: Using standard gray/white classes for guaranteed input display
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Game Title */}
                <div>
                    <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Gamepad size={16} className="mr-2 text-blue-400" /> Primary Game Title
                    </label>
                    <input
                        type="text"
                        id="gameTitle"
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                        placeholder="e.g., Valorant, League of Legends"
                        required
                        // 🔑 FIX: Using standard gray/white classes for guaranteed input display
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Team Logo Upload */}
                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Image size={16} className="mr-2 text-blue-400" /> Team Logo
                    </label>
                    <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        // 🔑 FIX: Using standard blue classes
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30"
                    />
                    {logoPreview && (
                        <div className="mt-4 flex items-center">
                            <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-lg object-cover border-2 border-blue-500" />
                            <span className="ml-4 text-sm text-gray-400">Logo preview ready.</span>
                        </div>
                    )}
                </div>

                {/* 🔑 FIX: Using standard blue classes for the button */}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center text-lg transition-colors mt-8">
                    <PlusCircle className="mr-2" size={18} /> Register Team
                </button>
            </form>
        </AnimatedSection>
    );
};


export default function TeamsManagementPage() {
    const [isCreating, setIsCreating] = useState(false);

    return (
        // 🔑 Using standard Tailwind colors as a visual fix for the background
        <div className="pt-8 min-h-screen bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <AnimatedSection delay={0}>
                    {/* 🔑 FIX: Using standard blue classes for title */}
                    <h1 className="text-4xl font-extrabold text-center text-blue-400 flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 mr-3" /> Team Management Hub
                    </h1>
                    <p className="text-center text-gray-400">
                        Manage your squads, create new teams, and view their performance.
                    </p>
                </AnimatedSection>

                {/* --- Action Card: Create New Team --- */}
                {/* 🔑 FIX: Using standard green classes */}
                <AnimatedSection 
                    delay={100} 
                    className="bg-green-700/40 p-6 rounded-xl border border-green-500 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01] cursor-pointer" 
                    onClick={() => setIsCreating(true)}
                >
                    <div>
                        <div className="flex items-center mb-2">
                            <PlusCircle className="w-6 h-6 mr-3 text-green-300" />
                            <h2 className="text-2xl font-bold text-white">Create a New Team</h2>
                        </div>
                        <p className="text-gray-300">Start your own legacy. Assemble your squad today!</p>
                    </div>
                    {/* 🔑 FIX: Using standard green button */}
                    <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center w-fit pointer-events-none">
                        Create Team <PlusCircle size={16} className="ml-2" />
                    </button>
                </AnimatedSection>

                {/* --- Conditional Form Display --- */}
                {isCreating && (
                    <CreateTeamForm onClose={() => setIsCreating(false)} />
                )}

                {/* --- Your Teams List (Hidden when creating a team) --- */}
                {!isCreating && (
                    <AnimatedSection delay={200}>
                        {/* 🔑 FIX: Using standard blue classes for title */}
                        <h2 className="text-2xl font-bold mb-4 text-blue-400 border-b border-gray-700 pb-2">
                            Your Active Teams ({userTeams.length})
                        </h2>

                        <div className="space-y-4">
                            {userTeams.length > 0 ? (
                                userTeams.map((team, index) => (
                                    <TeamListItem key={team.id} team={team} delay={250 + index * 50} />
                                ))
                            ) : (
                                <div className="bg-gray-800 p-6 rounded-xl text-center border border-yellow-700/50">
                                    <Eye className="w-6 h-6 mx-auto text-yellow-500 mb-3" />
                                    <p className="text-yellow-300">
                                        You are not currently listed as a member or manager of any team.
                                    </p>
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                )}


                {/* Optional: Link to the general Teams Directory / Search */}
                <AnimatedSection delay={!isCreating ? 500 : 800} className="text-center pt-4">
                    <Link to="/players?view=teams" className="text-gray-400 hover:text-blue-400 flex items-center justify-center text-sm font-medium">
                        Looking for other teams? Go to the Team Directory Search <ArrowRight size={16} className="ml-1" />
                    </Link>
                </AnimatedSection>
            </div>
        </div>
    );
}