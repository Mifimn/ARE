// src/pages/TeamsManagementPage.jsx (FIXED - Using standard Tailwind colors for guaranteed display)

import { useState } from 'react';
import { Link } from 'react-router-dom'; // Ensure Link is imported
import { PlusCircle, Eye, Users, ArrowRight, X, Image, Gamepad, Edit3, Settings, Trash2 } from 'lucide-react'; // Added needed icons
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Data ---
const userTeams = [
    // Added 'id' property matching the structure needed for the dynamic link
    { id: 'lagos-lions-1', name: 'Lagos Lions', logo: '/images/team_ll.png', game: 'FIFA 24', members: 5, wins: 55, role: 'Member' },
    { id: 'accra-avengers-4', name: 'Accra Avengers', logo: '/images/team_aa.png', game: 'Valorant', members: 5, wins: 61, role: 'Captain' },
    { id: 'kigali-kings-6', name: 'Kigali Kings', logo: '/images/team_kk.png', game: 'Apex Legends', members: 6, wins: 22, role: 'Member' },
];


// --- Component for a single team in the list ---
const TeamListItem = ({ team, delay }) => (
    <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:bg-dark-700/70">
        {/* Team Info */}
        <div className="flex items-center flex-grow w-full sm:w-auto">
            <img
                src={team.logo.startsWith('/') ? team.logo : '/images/placeholder_team.png'}
                alt={`${team.name} logo`}
                className="w-12 h-12 rounded-lg object-cover mr-4 border border-primary-500/30 flex-shrink-0"
            />
            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white">{team.name}</h3>
                <p className="text-sm text-gray-400">{team.game} &bull; {team.members} Members</p>
                {/* Display role if available */}
                {team.role && <p className="text-xs text-primary-300 mt-1">Your Role: {team.role}</p>}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row sm:flex-col lg:flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end flex-shrink-0">
            {/* UPDATED: Link to dynamic /team/:teamId route */}
            <Link
                to={`/team/${team.id}`} // Corrected path using team.id
                className="btn-secondary text-xs px-3 py-1.5 flex items-center justify-center hover:bg-dark-600 flex-1 sm:flex-initial"
                title="View Team Page"
            >
                <Eye size={14} className="mr-1" /> View
            </Link>
            <Link
                to={`/manage-team/${team.id}`} // Link to manage page
                className="btn-primary text-xs px-3 py-1.5 flex items-center justify-center hover:bg-primary-700 flex-1 sm:flex-initial"
                title="Manage Team Settings"
            >
                <Settings size={14} className="mr-1" /> Manage
            </Link>
            {/* Optional Delete Button (needs handler) */}
            {/* <button className="btn-danger text-xs px-3 py-1.5 flex items-center justify-center flex-1 sm:flex-initial" title="Delete Team"><Trash2 size={14} className="mr-1"/> Delete</button> */}
        </div>
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
        // Using provided dark theme colors
        <AnimatedSection delay={0} className="p-6 bg-dark-800 rounded-xl border-2 border-primary-600 shadow-2xl relative text-white">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors z-20"
                aria-label="Close form"
            >
                <X size={24} />
            </button>
            <h2 className="text-3xl font-extrabold text-primary-400 mb-6 flex items-center">
                <Edit3 className="mr-3" size={24} /> New Team Registration
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Team Name */}
                <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Users size={16} className="mr-2 text-primary-400" /> Team Name
                    </label>
                    <input
                        type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g., Cyber Ninjas, Alpha Squad" required
                        // Using input-field class from your App.css
                        className="input-field w-full p-3 placeholder-gray-500"
                    />
                </div>

                {/* Game Title */}
                <div>
                    <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Gamepad2 size={16} className="mr-2 text-primary-400" /> Primary Game Title
                    </label>
                    <input
                        type="text" id="gameTitle" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)}
                        placeholder="e.g., Valorant, League of Legends" required
                        // Using input-field class
                        className="input-field w-full p-3 placeholder-gray-500"
                    />
                </div>

                {/* Team Logo Upload */}
                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Image size={16} className="mr-2 text-primary-400" /> Team Logo
                    </label>
                    <input
                        type="file" id="logo" accept="image/*" onChange={handleFileChange}
                        // Styling the file input button using Tailwind utilities
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600/20 file:text-primary-300 hover:file:bg-primary-600/30 cursor-pointer"
                    />
                    {logoPreview && (
                        <div className="mt-4 flex items-center">
                            <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-lg object-cover border-2 border-primary-500" />
                            <span className="ml-4 text-sm text-gray-400">Logo preview ready.</span>
                        </div>
                    )}
                </div>

                {/* Submit Button using btn-primary */}
                <button type="submit" className="btn-primary w-full py-3 px-4 rounded-lg flex items-center justify-center text-lg transition-colors mt-8">
                    <PlusCircle className="mr-2" size={18} /> Register Team
                </button>
            </form>
        </AnimatedSection>
    );
};


export default function TeamsManagementPage() {
    const [isCreating, setIsCreating] = useState(false);

    return (
        // Using dark theme background
        <div className="bg-dark-900 text-white min-h-screen">
             {/* Padding handled by App.jsx main */}
            <div className="space-y-8">

                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 mr-3" /> Team Management Hub
                    </h1>
                    <p className="text-center text-gray-400">
                        Manage your squads, create new teams, and view their performance.
                    </p>
                </AnimatedSection>

                {/* --- Action Card: Create New Team --- */}
                <AnimatedSection
                    delay={100}
                    className="bg-gradient-to-r from-primary-700/30 to-dark-800/50 p-6 rounded-xl border border-primary-500/50 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01] cursor-pointer"
                    onClick={() => setIsCreating(true)}
                >
                    <div>
                        <div className="flex items-center mb-2">
                            <PlusCircle className="w-6 h-6 mr-3 text-primary-300" />
                            <h2 className="text-2xl font-bold text-white">Create a New Team</h2>
                        </div>
                        <p className="text-gray-300">Start your own legacy. Assemble your squad today!</p>
                    </div>
                    <button className="btn-primary font-semibold py-2 px-4 rounded-lg text-sm flex items-center w-fit pointer-events-none">
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
                        <h2 className="text-2xl font-bold mb-4 text-primary-400 border-b border-dark-700 pb-2">
                            Your Active Teams ({userTeams.length})
                        </h2>

                        <div className="space-y-4">
                            {userTeams.length > 0 ? (
                                userTeams.map((team, index) => (
                                    <TeamListItem key={team.id} team={team} delay={250 + index * 50} />
                                ))
                            ) : (
                                <div className="bg-dark-800 p-6 rounded-xl text-center border border-yellow-700/50">
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
                    <Link to="/players?view=teams" className="text-gray-400 hover:text-primary-400 flex items-center justify-center text-sm font-medium">
                        Looking for other teams? Go to the Team Directory Search <ArrowRight size={16} className="ml-1" />
                    </Link>
                </AnimatedSection>
            </div>
        </div>
    );
}