// src/pages/TeamsManagementPage.jsx

import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Users, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Data ---
const userTeams = [
    { id: 1, name: 'Lagos Lions', logo: '/images/team_ll.png', game: 'FIFA 24', members: 5, wins: 55 },
    { id: 4, name: 'Accra Avengers', logo: '/images/team_aa.png', game: 'Valorant', members: 5, wins: 61 },
    { id: 6, name: 'Kigali Kings', logo: '/images/team_kk.png', game: 'Apex Legends', members: 6, wins: 22 },
];


// --- Component for a single team in the list ---
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

        {/* 🔑 Link to the generic /team page */}
        <Link to="/team" className="btn-primary-sm flex items-center group">
            View Team 
            <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
    </AnimatedSection>
);


export default function TeamsManagementPage() {
    return (
        <div className="pt-8 min-h-screen bg-dark-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 flex items-center justify-center mb-2">
                        <Users className="w-8 h-8 mr-3" /> Team Management Hub
                    </h1>
                    <p className="text-center text-gray-400">
                        Manage your squads, create new teams, and view their performance.
                    </p>
                </AnimatedSection>

                {/* --- Action Card: Create New Team --- */}
                <AnimatedSection delay={100} className="bg-green-900/40 p-6 rounded-xl border border-green-700 shadow-xl flex items-center justify-between transition-transform hover:scale-[1.01]">
                    <div>
                        <div className="flex items-center mb-2">
                            <PlusCircle className="w-6 h-6 mr-3 text-green-300" />
                            <h2 className="text-2xl font-bold text-white">Create a New Team</h2>
                        </div>
                        <p className="text-gray-300">Start your own legacy. Assemble your squad today!</p>
                    </div>
                    {/* 🔑 Link to the generic /team page (often used for both viewing and creation in simplified setups) */}
                    <Link to="/team" className="btn-primary text-sm flex items-center w-fit">
                        Create Team <PlusCircle size={16} className="ml-2" />
                    </Link>
                </AnimatedSection>

                {/* --- Your Teams List --- */}
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

                {/* Optional: Link to the general Teams Directory / Search */}
                 <AnimatedSection delay={500} className="text-center pt-4">
                    <Link to="/players?view=teams" className="text-gray-400 hover:text-primary-400 flex items-center justify-center text-sm font-medium">
                        Looking for other teams? Go to the Team Directory Search <ArrowRight size={16} className="ml-1" />
                    </Link>
                </AnimatedSection>
            </div>
        </div>
    );
}