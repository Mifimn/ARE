// src/pages/AdminGuidePage.jsx

import { HelpCircle, Trophy, Layers, Workflow, ListChecks, ArrowLeft, UserCheck, Lock, Send, BarChart, FileText, Gamepad2, Plus } from 'lucide-react';
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
                    {/* --- Section 1: Standard Tournaments --- */}
                    <GuideSection title="Standard Tournaments (One-Offs)" icon={Trophy}>
                        <p>Use this for simple, single events like a **Free Fire** qualifier or a basic **Mobile Legends** Round Robin.</p>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>Go to <Link to="/create-tournament" className="text-primary-400 hover:underline">Create Tournament</Link>.</li>
                            <li>Select the game (e.g., "Free Fire" or "Mobile Legends").</li>
                            <li>Fill in all details (name, dates, prize pool, etc.).</li>
                            <li>Configure the **Stage Configuration** (e.g., "Qualifier Matches per Group" for FF).</li>
                            <li>Click "Create" and you will be taken to the management page.</li>
                            <li>On the <Code>UpdateTournamentPage</Code>, you can run group draws, schedule matches, and enter results.</li>
                        </ol>
                    </GuideSection>

                    {/* --- Section 2: Pro League & Seeding System --- */}
                    <GuideSection title="The Pro League & Seeding System" icon={Layers}>
                        <p>This is the advanced 3-Season system for **"Mobile Legends (Pro League)"**. It requires three parts: creating the "League," creating the "Tournaments," and "Linking" them together.</p>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Part A: The Logic (Your 16 + 48 Model)</h3>
                        <p>
                            This is a **hybrid format**. The "Seeded" teams and "New" teams start at the same time, in the same stage.
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-2">
                            <li><strong className="text-white">"Seeding"</strong> = An **automatic registration slot** for the next season. It is a reward, <strong className="text-red-400">NOT a stage skip</strong>.</li>
                            <li><strong>Season 1:</strong> You run a 64-team tournament. The Top 16 are identified.</li>
                            <li><strong>Season 2:</strong> You "Seed" the Top 16 from S1. They get 16 of the 64 slots. You open registration for the **remaining 48 slots**. All 64 teams start together in Stage 1.</li>
                            <li><strong>Season 3:</strong> You "Seed" the Top 16 from S2. The same process repeats.</li>
                            <li><strong>MASC Cup:</strong> The Top 16 from S3 are "seeded" into the final MASC cup, which *is* their qualification.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">Part B: How to Create a New League (e.g., "AML 2025")</h3>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>
                                <strong>Step 1: Create the "League" (The Folder)</strong>
                                <ul className="list-disc list-inside pl-6">
                                    <li>Go to the <Link to="/leagues" className="text-primary-400 hover:underline">League Management</Link> page.</li>
                                    <li>In the "Create New League" form, enter the name (e.g., "AML 2025") and select the game "Mobile Legends (Pro League)".</li>
                                    <li>Click "Create League".</li>
                                </ul>
                            </li>
                            <li>
                                <strong>Step 2: Create the "Tournaments" (The Files)</strong>
                                <ul className="list-disc list-inside pl-6">
                                    <li>Go to <Link to="/create-tournament" className="text-primary-400 hover:underline">Create Tournament</Link> **four separate times**.</li>
                                    <li>Create "AML 2025 - Season 1" (Select "Mobile Legends (Pro League)").</li>
                                    <li>Create "AML 2025 - Season 2" (Select "Mobile Legends (Pro League)").</li>
                                    <li>Create "AML 2025 - Season 3" (Select "Mobile Legends (Pro League)").</li>
                                    <li>Create "MASC 2025" (Select "Mobile Legends (Pro League)", set Max Participants to 16).</li>
                                    <li>For S1, S2, and S3, set the **"S1: Qualifier Teams"** to **48**. This is the number of *new* teams you will accept.</li>
                                </ul>
                            </li>
                             <li>
                                <strong>Step 3: Link Tournaments to the League</strong>
                                <ul className="list-disc list-inside pl-6">
                                    <li>Go back to the <Link to="/leagues" className="text-primary-400 hover:underline">League Management</Link> page.</li>
                                    <li>Find your "AML 2025" league.</li>
                                    <li>In the "Season 1" dropdown, find and select "AML 2025 - Season 1". Click "Link".</li>
                                    <li>In the "Season 2" dropdown, find and select "AML 2025 - Season 2". Click "Link".</li>
                                    <li>Repeat for "Season 3" and "MASC Cup".</li>
                                </ul>
                            </li>
                        </ol>
                        <p className="font-bold text-white">Your league is now fully set up and the "Seed Next Season" button will work automatically.</p>
                    </GuideSection>

                    {/* --- Section 3: Managing the League --- */}
                    <GuideSection title="How to Manage a Pro League Season" icon={Workflow}>
                        <h3 className="text-xl font-semibold text-primary-300">1. Running Season 1</h3>
                        <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>Go to <Link to="/update-tournament/manage" className="text-primary-400 hover:underline">Manage Tournaments</Link> and open "AML 2025 - Season 1".</li>
                            <li>Wait for teams to register. You can accept up to 64.</li>
                            <li>Go to the "Stage 1: Open Qualifiers" tab.</li>
                            <li>Click the <span className="font-bold text-red-400 p-1 rounded bg-dark-900"><Lock size={14} className="inline-block mr-1"/> Lock Registration</span> button. You can do this even with fewer than 64 teams (e.g., 50 teams).</li>
                            <li>Click the <span className="font-bold text-primary-400 p-1 rounded bg-dark-900"><Workflow size={14} className="inline-block mr-1"/> Generate Bracket</span> button. The system will automatically calculate and assign "Byes" (free wins to Stage 2) to balance the bracket to 64.</li>
                            <li>Run all 5 stages of the tournament by entering scores and clicking "Advance Winners".</li>
                            <li>When the tournament is finished, set its status to "Completed".</li>
                        </ol>

                        <div className="p-4 bg-dark-900/50 border border-yellow-700/50 rounded-lg">
                            <h4 className="font-bold text-yellow-400 flex items-center"><AlertCircle size={16} className="mr-2"/> Important Manual Step</h4>
                            <p className="text-sm text-yellow-300">
                                The seeder needs to know the Top 16. Before clicking "Seed", you MUST manually enter the final 16 teams into the <Code>tournament_standings</Code> table in the Supabase dashboard.
                                (We will build a UI for this later).
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">2. Seeding Season 2</h3>
                         <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>Go to the "Stage 5: Grand Finals" tab of your **completed "Season 1"** tournament.</li>
                            <li>Click the <span className="font-bold text-white p-1 rounded bg-dark-900"><Send size={14} className="inline-block mr-1"/> Seed Top 16 to Next Season</span> button.</li>
                            <li>The system will automatically find "AML 2025 - Season 2" (because you linked it!) and register the Top 16 teams with the "Seeded" tag.</li>
                        </ol>

                        <h3 className="text-xl font-semibold text-primary-300 pt-4 border-t border-dark-600">3. Running Season 2 (The 16 + 48 Flow)</h3>
                         <ol className="list-decimal list-inside space-y-2 pl-2">
                            <li>Go to the public `TournamentDetailsPage` for "Season 2". You will see 16 teams are already registered.</li>
                            <li>The page will correctly show only **48 open slots** for new teams.</li>
                            <li>Once 48 new teams join, go to the `UpdateTournamentPage` for "Season 2".</li>
                            <li>You will see all **64 teams** in the participant list (16 "Seeded" and 48 "New").</li>
                            <li>Click <span className="font-bold text-red-400 p-1 rounded bg-dark-900"><Lock size={14} className="inline-block mr-1"/> Lock Registration</span>.</li>
                            <li>Click <span className="font-bold text-primary-400 p-1 rounded bg-dark-900"><Workflow size={14} className="inline-block mr-1"/> Generate Bracket</span>. A full 64-team bracket will be created for *all* teams (no Byes needed).</li>
                            <li>Repeat the process to run the tournament and seed Season 3.</li>
                        </ol>
                    </GuideSection>
                </div>
            </div>
        </div>
    );
}