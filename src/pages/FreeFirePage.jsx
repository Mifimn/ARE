                            // src/pages/FreeFirePage.jsx

                            import { Link } from 'react-router-dom';
                            import { Trophy, Users, ArrowRight, PlusCircle, Calendar, Gamepad2, Hash, Clock } from 'lucide-react';
                            import { useState } from 'react';
                            import AnimatedSection from '../components/AnimatedSection';

                            // --- Placeholder Data & Components ---

                            const upcomingCups = [
                                { id: 1, title: 'Free Fire Clash Squads - MYTHIC\'25', format: '4v4', entries: 47, date: '20 Oct', prize: 'R1000+' },
                                { id: 2, title: 'Free Fire Royale Squads - MYTHIC\'25', format: 'Quads', entries: 36, date: '22 Oct', prize: 'R1000+' },
                                { id: 3, title: 'Free Fire Solo Royale - MYTHIC\'25', format: 'Solos', entries: 67, date: '27 Oct', prize: 'R1000+' },
                            ];

                            const topTeams = [
                                { rank: 1, name: 'Team Zeus', points: 1500, members: 5, logo: '/images/team_z.png' },
                                { rank: 2, name: 'Elite Force', points: 1450, members: 4, logo: '/images/team_a.png' },
                                { rank: 3, name: 'Phoenix Rising', points: 1390, members: 5, logo: '/images/team_o.png' },
                                { rank: 4, name: 'Shadow Squad', points: 1210, members: 4, logo: '/images/team_l.png' },
                            ];

                            const allTeams = [
                                { name: 'Gamer Legion', members: 5, logo: '/images/team_d.png' },
                                { name: 'Raging Bulls', members: 4, logo: '/images/team_r.png' },
                                { name: 'Lagos Lions', members: 5, logo: '/images/team_s.png' },
                                { name: 'Accra Apex', members: 3, logo: '/images/team_c.png' },
                                { name: 'Kigali Kings', members: 5, logo: '/images/team_o.png' },
                            ];

                            const CupListItem = ({ cup }) => (
                                <div className="flex items-center p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors border-l-4 border-primary-500/70 shadow-md">
                                    <div className="w-16 h-16 mr-6 flex-shrink-0">
                                        <img src="/images/ff_cup_thumb.jpg" alt="Cup thumbnail" className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-base font-bold text-white mb-1">{cup.title}</p>
                                        <p className="text-sm text-gray-400">{cup.format} &bull; {cup.entries} Entries</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-6">
                                        <p className="text-xl font-extrabold text-yellow-400 leading-none">{cup.prize}</p>
                                        <p className="text-sm text-gray-500 leading-none">{cup.date} Oct</p>
                                    </div>
                                </div>
                            );


                            // --- Conditional Content Components ---

                            const CupsContent = () => (
                                <AnimatedSection delay={0} className="px-4 sm:px-6 lg:px-8 space-y-8">
                                    <h2 className="text-3xl font-bold text-primary-400 border-b border-dark-700 pb-3">Cups & Tournaments (Upcoming & Past)</h2>
                                    <p className="text-gray-400">This view displays a filterable list of all Free Fire competitions, including **Upcoming Cups** and **Archived/Past Tournaments**.</p>

                                    <div className="space-y-6">
                                        <h4 className="text-2xl font-semibold text-white flex items-center"><Clock size={20} className="mr-3 text-green-400" /> Upcoming Cups</h4>
                                        <div className="space-y-4">
                                            {upcomingCups.map(cup => <CupListItem key={cup.id} cup={cup} />)}
                                        </div>

                                        <h4 className="text-2xl font-semibold text-white pt-6 border-t border-dark-800 flex items-center"><Trophy size={20} className="mr-3 text-yellow-400" /> Past Tournaments</h4>
                                        <div className="p-6 bg-dark-800 rounded-xl text-gray-500 border border-dark-700">
                                            <p>A paginated list of all concluded Free Fire events would appear here, showing winners and final scores.</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            );

                            const LeaderboardContent = () => (
                                <AnimatedSection delay={0} className="px-4 sm:px-6 lg:px-8 space-y-6">
                                    <h2 className="text-3xl font-bold text-primary-400 border-b border-dark-700 pb-3">Top 100 Team Leaderboard</h2>
                                    <p className="text-gray-400">This view displays the **Top 100 teams** based on ranking points accumulated from official tournaments and leagues.</p>

                                    <div className="bg-dark-800 p-6 rounded-xl shadow-inner">
                                        {/* Header Row (Hidden on small screens for better vertical flow) */}
                                        <div className="hidden sm:flex justify-between items-center text-lg font-bold text-gray-400 mb-4 pb-3 border-b border-dark-700">
                                            <span className="w-1/12 text-center">#</span>
                                            <span className="w-5/12">Team Name</span>
                                            <span className="w-3/12 text-center">Members</span>
                                            <span className="w-3/12 text-right">Points</span>
                                        </div>

                                        {/* Team Blocks (List) */}
                                        <div className="space-y-3">
                                            {topTeams.map((team) => (
                                                // 🔑 MOBILE FIX: Changed to flex-wrap on small screens to prevent overflow
                                                <div key={team.rank} className="flex flex-wrap sm:flex-nowrap items-center p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors border-l-4 border-yellow-500/50">

                                                    {/* Rank & Team Info - Takes full width on mobile, then 6/12 on large screens */}
                                                    <div className="flex items-center space-x-3 w-full sm:w-6/12 pb-2 sm:pb-0">
                                                        <span className="text-center font-extrabold text-xl text-yellow-400 w-8 flex-shrink-0">{team.rank}</span>
                                                        <img src={team.logo || '/images/team_placeholder.png'} alt={team.name} className="w-10 h-10 rounded-full object-cover border border-primary-500/50 flex-shrink-0" />
                                                        <div className="flex-grow">
                                                            <p className="font-semibold text-white text-base leading-tight">{team.name}</p>
                                                            <Link to={`/team/${team.name.toLowerCase().replace(/\s/g, '-')}`} className="text-xs text-primary-400 hover:text-primary-300">View Team</Link>
                                                        </div>
                                                    </div>

                                                    {/* Members & Points - Now wrap to a new line on mobile */}
                                                    <div className="flex justify-end space-x-4 sm:space-x-0 w-full sm:w-6/12 text-sm">
                                                        {/* Members */}
                                                        <div className="w-1/2 sm:w-3/12 text-left sm:text-center text-gray-400 flex items-center justify-start sm:justify-center">
                                                            <Users size={16} className="mr-1" />
                                                            <span>{team.members} / 5</span>
                                                        </div>

                                                        {/* Points */}
                                                        <span className="w-1/2 sm:w-3/12 text-right font-bold text-base sm:text-xl text-yellow-400">{team.points.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            <p className="text-center text-sm text-gray-500 pt-4">... Showing top {topTeams.length} of 100 Teams</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            );

                            const TeamsContent = () => (
                                <AnimatedSection delay={0} className="px-4 sm:px-6 lg:px-8 space-y-6">
                                    <h2 className="text-3xl font-bold text-primary-400 border-b border-dark-700 pb-3">All Free Fire Teams Directory</h2>
                                    <p className="text-gray-400">This view provides a directory of **all registered Free Fire teams**. Use the search bar (conceptual) to find specific teams.</p>

                                    {/* Conceptual Search Bar */}
                                    <div className="p-4 bg-dark-700 rounded-lg flex items-center border border-dark-600">
                                        <input 
                                            type="text" 
                                            placeholder="Search all 250+ registered teams..." 
                                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                                        />
                                    </div>

                                    {/* Team Blocks (List) */}
                                    <div className="space-y-4">
                                        {allTeams.map((team, index) => (
                                            // 🔑 MOBILE FIX: Use flex-wrap on mobile and adjust widths
                                            <div key={index} className="flex flex-wrap items-center p-4 sm:p-5 bg-dark-800 rounded-xl hover:bg-dark-700 transition-colors shadow-lg">

                                                {/* Team Logo and Name - Takes full width on mobile, then 5/12 on large screens */}
                                                <div className="flex items-center w-full sm:w-5/12 space-x-4 pb-2 sm:pb-0">
                                                    <img src={team.logo || '/images/team_placeholder.png'} alt={team.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/50" />
                                                    <p className="font-bold text-white text-lg sm:text-xl">{team.name}</p>
                                                </div>

                                                {/* Members - Hidden on base mobile view, shown on small screens and up */}
                                                <div className="hidden sm:flex w-4/12 items-center text-gray-400 text-base">
                                                    <Users size={20} className="mr-2 text-primary-400" />
                                                    <span>{team.members} Team Members</span>
                                                </div>

                                                {/* View Team Button - Takes full width on mobile, pushes to the right on large screens */}
                                                <div className="w-full sm:w-3/12 text-right pt-2 sm:pt-0">
                                                    <Link 
                                                        to={`/team/${team.name.toLowerCase().replace(/\s/g, '-')}`}
                                                        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-5 rounded-lg text-sm sm:text-base transition-colors flex items-center justify-center sm:justify-end w-full"
                                                    >
                                                        View Team <ArrowRight size={18} className="ml-2" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AnimatedSection>
                            );


                            export default function FreeFirePage() {
                                const [activeTab, setActiveTab] = useState('rundown'); 

                                const navTabs = [
                                    { name: 'RUNDOWN', path: 'rundown' },
                                    { name: 'CUPS', path: 'cups' },
                                    { name: 'LEADERBOARD', path: 'leaderboard' },
                                    { name: 'TEAMS', path: 'teams' },
                                ];

                                const recentMatches = [
                                    { winner: 'Mr._Jostrice', loser: '94GAMER', winnerScore: 1, loserScore: 0, winnerLogo: '/images/player_j.png', loserLogo: '/images/player_94.png' },
                                    { teams: ['/images/team_a.png', '/images/team_d.png', '/images/team_c.png', '/images/team_l.png', '/images/team_r.png', '/images/team_s.png'] },
                                    { teams: ['/images/team_w.png', '/images/team_o.png', '/images/team_z.png', '/images/team_x.png', '/images/team_y.png', '/images/team_kk.png'] },
                                ];

                                // Function to render the correct content based on the active tab
                                const renderContent = () => {
                                    if (activeTab === 'cups') return <CupsContent />;
                                    if (activeTab === 'leaderboard') return <LeaderboardContent />;
                                    if (activeTab === 'teams') return <TeamsContent />;

                                    // Default: RUNDOWN Content
                                    return (
                                        // RUNDOWN content container with padding
                                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">

                                            {/* --- Left Column (Upcoming Cups - 2/3 width) --- */}
                                            <div className="lg:w-2/3 space-y-8 lg:space-y-10">
                                                <AnimatedSection delay={100} className="bg-purple-800/80 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between border-4 border-purple-600">
                                                    <div>
                                                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">MYTHIC 25</h2>
                                                        <p className="text-purple-200 text-base sm:text-lg mb-4 sm:mb-0">Featured Seasonal Championship Event</p>
                                                    </div>
                                                    <Link to="/event/mythic-25" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl flex items-center transition-colors text-base shadow-lg mt-4 sm:mt-0">
                                                        GO TO EVENT <ArrowRight size={20} className="ml-2" />
                                                    </Link>
                                                </AnimatedSection>

                                                <AnimatedSection delay={200}>
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h3 className="text-2xl font-bold text-primary-400">UPCOMING CUPS & TOURNEYS</h3>
                                                        <button onClick={() => setActiveTab('cups')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                                                            View All Cups <ArrowRight size={16} className="ml-1" />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {upcomingCups.map((cup, index) => (
                                                            <AnimatedSection key={cup.id} delay={250 + index * 50}>
                                                                <CupListItem cup={cup} />
                                                            </AnimatedSection>
                                                        ))}
                                                    </div>
                                                </AnimatedSection>
                                            </div>

                                            {/* --- Right Column (Scrims & Recent Matches - 1/3 width) --- */}
                                            <div className="lg:w-1/3 space-y-8 lg:space-y-10">
                                                <AnimatedSection delay={300} className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-2xl font-bold text-primary-400">SCRIMS</h3>
                                                        <button className="bg-green-600/30 text-green-300 hover:bg-green-600/50 font-semibold py-1.5 px-4 rounded-lg text-sm flex items-center transition-colors">
                                                            <PlusCircle size={16} className="mr-1" /> ACTIVATE SCRIM
                                                        </button>
                                                    </div>

                                                    {/* Single Scrim Entry */}
                                                    <div className="bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600">
                                                        <div>
                                                            <p className="text-base font-semibold text-white">Daily Fire Scrim</p>
                                                            <p className="text-sm text-gray-400 flex items-center">
                                                                <Calendar size={14} className="mr-1" /> Best of 1 - Free Entry
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-green-400 leading-none">18:00</p>
                                                            <p className="text-sm text-gray-500 leading-none">19 OCT</p>
                                                        </div>
                                                    </div>
                                                </AnimatedSection>

                                                <AnimatedSection delay={400} className="bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700">
                                                    <h3 className="text-2xl font-bold text-primary-400 mb-6">RECENT MATCHES</h3>

                                                    {/* Match 1 (Score-based) */}
                                                    <div className="border border-dark-700 p-4 rounded-lg mb-4">
                                                        <div className="flex items-center justify-between mb-1 text-base">
                                                            <div className="flex items-center">
                                                                <img src={'/images/player_94.png'} alt="94GAMER" className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-red-500/50" />
                                                                <span className="text-gray-300">94GAMER</span>
                                                            </div>
                                                            <span className="font-bold text-red-500">{0}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-base pt-1 border-t border-dark-700 mt-2">
                                                            <div className="flex items-center">
                                                                <img src={'/images/player_j.png'} alt="Mr._Jostrice" className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-green-500/50" />
                                                                <span className="font-bold text-white">Mr._Jostrice (W)</span>
                                                            </div>
                                                            <span className="font-bold text-green-400">{1}</span>
                                                        </div>
                                                    </div>

                                                    {/* Match 2 & 3 (Logo Grids) */}
                                                    <div className="space-y-4">
                                                        {[recentMatches[1], recentMatches[2]].map((match, idx) => (
                                                            <div key={idx} className="flex flex-wrap gap-3 p-3 bg-dark-700 rounded-lg border border-dark-600">
                                                                {match.teams.map((logo, index) => (
                                                                    <img key={index} src={logo} alt={`Team ${index}`} className="w-7 h-7 rounded-full object-cover border-2 border-dark-600" />
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="w-full mt-6 text-center text-base text-primary-400 hover:text-primary-300 transition-colors font-medium">
                                                        View All Match History
                                                    </button>
                                                </AnimatedSection>
                                            </div>
                                        </div>
                                    );
                                };


                                return (
                                    <div className="pt-8 min-h-screen bg-dark-900 text-white">
                                        {/* Main wrapper: max-w-full and px-0 for full bleed */}
                                        <div className="max-w-full mx-auto px-0 space-y-8 sm:space-y-10">

                                            {/* --- Game Header & Tabs --- */}
                                            <AnimatedSection delay={0} className="px-4 sm:px-6 lg:px-8 space-y-6">
                                                <div className="flex items-center justify-between border-b border-dark-700 pb-4">
                                                    <div className="flex items-center">
                                                        <Gamepad2 className="w-9 h-9 mr-4 text-primary-400" />
                                                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">FREE FIRE HUB</h1>
                                                    </div>
                                                    <div className="space-x-4">
                                                        <button className="bg-dark-700 hover:bg-dark-600 text-gray-300 font-semibold py-2 px-4 rounded-lg text-lg transition-colors">
                                                            <span className="text-xl">🔗</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Tabs Navigation - Added overflow-x-auto to prevent horizontal scroll from pushing page out */}
                                                <nav className="flex space-x-8 text-xl font-semibold text-gray-400 border-b border-dark-700 overflow-x-auto pb-1">
                                                    {navTabs.map((tab) => (
                                                        <button 
                                                            key={tab.name}
                                                            onClick={() => setActiveTab(tab.path)}
                                                            className={`py-3 transition-colors flex-shrink-0 ${activeTab === tab.path ? 'text-primary-400 border-b-2 border-primary-400' : 'hover:text-white'}`}
                                                        >
                                                            {tab.name}
                                                        </button>
                                                    ))}
                                                </nav>
                                            </AnimatedSection>

                                            {/* --- Main Content Area (Renders the active tab) --- */}
                                            {renderContent()}

                                        </div>
                                    </div>
                                );
                            }