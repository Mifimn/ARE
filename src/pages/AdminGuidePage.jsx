// src/pages/AdminGuidePage.jsx

import { 
    HelpCircle, Trophy, Layers, Workflow, ListChecks, ArrowLeft, 
    UserCheck, Lock, Send, BarChart2, FileText, Gamepad2, Plus, 
    AlertCircle, Save, Calendar, Clock, Edit3, Shuffle, UsersRound, 
    Swords, Target, CheckCircle // <-- ADDED CheckCircle HERE
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

// A re-usable sub-component for styling
const GuideSection = ({ title, icon, children }) => {
    const Icon = icon;
    return (
        <AnimatedSection 
            tag="div" 
            className="card bg-dark-800 p-6 rounded-xl shadow-lg border border-dark-700"
        >
            <h2 className="text-3xl font-bold text-primary-400 mb-4 border-b border-dark-700 pb-3 flex items-center">
                <Icon size={24} className="mr-3" />
                {title}
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed text-base">
                {children}
            </div>
        </AnimatedSection>
    );
};

const Code = ({ children }) => (
    <code className="bg-dark-900 text-primary-300 font-mono px-1.5 py-0.5 rounded-md text-sm border border-dark-600">
        {children}
    </code>
);

export default function AdminGuidePage() {
    return (
        <div className="pt-20 min-h-screen bg-dark-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Page Header */}
                <AnimatedSection className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-4xl font-extrabold text-white flex items-center">
                            <HelpCircle className="mr-3 text-primary-500" size={36} />
                            Admin Guidance
                        </h1>
                        <Link to="/update-tournament/manage" className="btn-secondary flex-shrink-0">
                            <ArrowLeft size={16} className="mr-1.5" />
                            Back to Admin
                        </Link>
                    </div>
                    <p className="text-lg text-gray-400">
                        Your step-by-step guide to creating and managing all tournament and league formats.
                    </p>
                </AnimatedSection>

                <div className="space-y-8">

                    {/* --- NEW SECTION: Scrim Management --- */}
                    <GuideSection title="Scrim (Practice Match) Management" icon={UsersRound}>
                        <p>Scrims are simplified, non-tournament, round-based events (4 matches, no stages).</p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Management Flow</h3>

                        <ol className="list-decimal list-inside space-y-3 pl-2">
                            <li>**Navigate to Hub:** View all created scrims on the <Link to="/admin/manage-scrims" className="text-primary-400 hover:underline">Manage Scrims</Link> page.</li>
                            <li>**Creation:** Click **Create Scrim** and fill in the simplified form. This creates a record with <Code>type: 'scrim'</Code> in the database.</li>
                            <li>**Participant Entry:** On the Scrim Management Page, manually **Add Team** using the team's name.</li>
                            <li>**Generate Rounds:** Click **<Shuffle size={14} className="inline-block mr-1"/> Generate Scrim Matches**. This generates the fixed number of rounds (e.g., 4 matches) for the event.</li>
                            <li>**Result Entry:** For each round, click **Enter Results** and input Placement and Kills for all participating teams.</li>
                            <li>**Finalize:** After all rounds are completed, click **<CheckCircle size={14} className="inline-block mr-1"/> Finalize Scrim** to mark the event as complete.</li>
                        </ol>
                    </GuideSection>
                    {/* --- END NEW SECTION --- */}

                    {/* --- Section 1: Standard Tournament Overview --- */}
                    <GuideSection title="Tournament Creation Workflow" icon={Plus}>
                        <p>All tournaments are created via the <Link to="/create-tournament" className="text-primary-400 hover:underline">Create Tournament</Link> page, which locks the format and initial stage settings upon creation.</p>
                        <p>The core responsibility is to manage the flow of teams through stages on the <Code>/update-tournament/[id]</Code> page.</p>
                    </GuideSection>

                    {/* --- Section 2: Free Fire Management --- */}
                    <GuideSection title="Free Fire (Grouped BR) Management" icon={Target}>
                        <p className='font-bold text-white'>Game: Free Fire • Format: <Code>Grouped-Multi-Stage-BR</Code></p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Creation & Flow</h3>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Select **Free Fire**. Configure **Stage Configuration** numbers (e.g., 3 Qualifier Matches, 6 Playoff Matches).</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Stage Management</h3>
                        <ol className="list-decimal list-inside space-y-3 pl-2">
                            <li>**Initial Draw:** Click the **<Lock size={14} className="inline-block mr-1"/> Lock Registration** button. Then, click **<Shuffle size={14} className="inline-block mr-1"/> Run Group Draw & Schedule**. This divides teams into groups and creates the schedule.</li>
                            <li>**Schedule Update:** In the **Manage Schedule & Results** view, click the <Edit3 size={14} className="inline-block mx-1"/> icon to update the date/time. Click <Save size={14} className="inline-block mx-1"/> to save.</li>
                            <li>**Result Entry:** Click **Enter Results** on a scheduled match. Enter a unique **Placement** (1 to 12) and **Kills** for every team in the lobby. The system handles point calculation.</li>
                            <li>**Advancement:** After all matches are complete, click **<Send size={14} className="inline-block mr-1"/> Advance Top Teams** (from the Standings tab). The system calculates the top teams based on total points and moves them to the next stage.</li>
                        </ol>
                    </GuideSection>

                    {/* --- Section 3: Farlight 84 Management --- */}
                    <GuideSection title="Farlight 84 (League BR) Management" icon={BarChart2}>
                        <p className='font-bold text-white'>Game: Farlight 84 • Format: <Code>Multi-Stage-BR</Code></p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Weekly Management</h3>
                        <ol className="list-decimal list-inside space-y-3 pl-2">
                            <li>**Initial Setup:** Click **<Lock size={14} className="inline-block mr-1"/> Lock Registration**.</li>
                            <li>**Generate Week:** On the **Active Stage** tab, click **<Calendar size={14} className="inline-block mr-1"/> Generate Match Schedule**. This creates all matches for the current week.</li>
                            <li>**Enter Results:** Use the **BR Result Entry Modal**, logging Placement (1-20) and Kills.</li>
                            <li>**Advancement:** Click **Advance** at the end of the week. Standings are cumulative across all weeks until the Finals.</li>
                        </ol>
                    </GuideSection>

                    {/* --- Section 4: Mobile Legends (Round Robin) Management --- */}
                    <GuideSection title="Mobile Legends (Round Robin MOBA) Management" icon={Swords}>
                         <p className='font-bold text-white'>Game: Mobile Legends • Format: <Code>Round-Robin-to-Bracket</Code></p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">League Management Flow</h3>
                        <ol className="list-decimal list-inside space-y-3 pl-2">
                            <li>**Generate Schedule:** After locking registration, click **<Calendar size={14} className="inline-block mr-1"/> Generate League Schedule**. This creates all **Round Robin** matchups (Bo3 matches).</li>
                            <li>**Result Entry:** Click **Enter Results** on a match. Use the **MOBA Result Modal** to enter the **score** for Team 1 and Team 2 (e.g., 2-1).</li>
                            <li>**Advancement:** After all Round Robin matches are complete, click **Advance Winners to Playoffs**. The system ranks teams by wins/losses and creates the final bracket.</li>
                        </ol>
                    </GuideSection>

                    {/* --- Section 5: MLBB Pro Series Management --- */}
                    <GuideSection title="MLBB Pro Series (Automated Seeding)" icon={Layers}>
                         <p className='font-bold text-white'>Game: MLBB Pro League • Format: <Code>mlbb-pro-series</Code> (Seasons)</p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Creation & Seeding Flow</h3>

                        <div className="p-4 bg-dark-900/50 border border-blue-700/50 rounded-lg">
                            <h4 className="font-bold text-blue-400 flex items-center"><AlertCircle size={16} className="mr-2"/> CRITICAL: MASC Cup Creation</h4>
                            <p className="text-sm text-blue-300">
                                Create the **MASC Cup** using the **Standard Mobile Legends** format, not the Pro League format. Set **Max Participants to 16** to ensure a clean final bracket.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Finalization & Seeding Steps</h3>
                        <ol className="list-decimal list-inside space-y-3 pl-2">
                            <li>**Run Tournament (S1, S2, S3):** Complete the season tournament through all 5 stages by advancing winners.</li>
                            <li>**Finalize & Rank:** After the last match in **Stage 5 (Grand Finals)** is completed, click **<Send size={14} className="inline-block mr-1"/> Finalize & Rank**.
                                <ul className='list-disc list-inside pl-6 text-sm text-yellow-400'>
                                    <li>This automatically infers the Top 16 rankings and **saves the data** to the <Code>tournament_standings</Code> table.</li>
                                    <li>The tournament status is automatically set to **Completed**.</li>
                                </ul>
                            </li>
                            <li>**Seed Next Season:** Once the tournament status is <strong className='text-green-400'>Completed</strong>, click **<Send size={14} className="inline-block mr-1"/> Seed Top 16 to Next Season**. This action registers the Top 16 into the next tournament in the sequence (e.g., S2, S3, or the final MASC Cup).</li>
                            <li>**MASC Cup Management:** When managing the MASC Cup, click **Generate Schedule** (since it's a standard MOBA format). This creates the 16-team elimination bracket instantly, ready for play.</li>
                        </ol>
                    </GuideSection>
                </div>
            </div>
        </div>
    );
}