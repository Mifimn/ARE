// src/pages/UpdateTournamentPage.jsx (Refactored + Custom Modal INCLUDED - CORRECTED V5 - FINAL)

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Settings, Trash2, Edit3, ListChecks, Shuffle, CalendarCheck, Eye, ArrowLeft, Users, AlertTriangle, Save,
    X, HelpCircle, Info // Added Info
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Tournament Data ---
const initialTournamentsData = [
    {
        id: 1, name: 'African COD Warzone Championship', game: 'COD Warzone', startDate: '2026-03-15', status: 'Upcoming', participants: 96, maxParticipants: 128, registrationDeadline: '2026-03-10',
        participantsList: Array.from({ length: 96 }, (_, i) => ({ id: 1000 + i, name: `COD Team ${i + 1}`, logo: `https://via.placeholder.com/30x30/cccccc/000000?text=T${i+1}` })),
        groups: [], groupingFinalized: false,
    },
    {
        id: 2, name: "Free Fire Clash Squads - MYTHIC'25", game: 'Free Fire', startDate: '2025-10-20', status: 'Upcoming', participants: 47, maxParticipants: 64, registrationDeadline: '2024-10-18', // Past deadline
        participantsList: Array.from({ length: 47 }, (_, i) => ({ id: 2000 + i, name: `FF Team ${i + 1}`, logo: `https://via.placeholder.com/30x30/FFA500/000000?text=T${i+1}` })),
        groups: [], groupingFinalized: false,
    },
    {
        id: 801, name: 'MLBB Africa Champions League - Qualifiers', game: 'Mobile Legends', startDate: '2025-11-10', status: 'Registration Open', participants: 30, maxParticipants: 64, registrationDeadline: '2025-11-08',
        participantsList: Array.from({ length: 30 }, (_, i) => ({ id: 3000 + i, name: `ML Team ${i + 1}`, logo: `https://via.placeholder.com/30x30/800080/ffffff?text=T${i+1}` })),
        groups: [], groupingFinalized: false,
    },
     {
        id: 999, name: 'Newly Created Tournament', game: 'Free Fire', startDate: '2025-11-01', status: 'Upcoming', participants: 0, maxParticipants: 64, registrationDeadline: '2025-10-25',
        participantsList: [], groups: [], groupingFinalized: false,
    },
];

// Helper: Check deadline
const isDeadlinePassed = (deadline) => {
    const now = new Date();
    return new Date(deadline) < now;
};


// --- Custom Modal ---
const CustomModal = ({ /* ... Keep CustomModal code exactly as before ... */
    isOpen, onClose, title, children, promptLabel, onPromptSubmit,
    showCancel = true, confirmText = 'OK', onConfirm,
}) => {
  const [inputValue, setInputValue] = useState('');
  useEffect(() => { if (isOpen) setInputValue(''); }, [isOpen, promptLabel]);
  if (!isOpen) return null;
  const isPrompt = !!promptLabel;
  const handleConfirm = () => {
    if (isPrompt && onPromptSubmit) onPromptSubmit(inputValue);
    else if (onConfirm) onConfirm();
    onClose();
  };
  const Icon = isPrompt ? HelpCircle : AlertTriangle;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-md border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${isPrompt ? 'text-blue-400' : 'text-yellow-400'}`} /> <h3 className="text-lg font-semibold text-white">{title || (isPrompt ? 'Input Required' : 'Alert')}</h3> </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
        </div>
        <div className="p-6 space-y-4">
          {children && <div className="text-gray-300 text-sm">{children}</div>}
          {isPrompt && ( <div> <label htmlFor="promptInput" className="block text-sm font-medium text-gray-300 mb-2">{promptLabel}</label> <input id="promptInput" type="number" min="2" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input-field w-full" autoFocus /> </div> )}
        </div>
        <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
          {showCancel && (<button onClick={onClose} className="btn-secondary text-sm">Cancel</button>)}
          <button onClick={handleConfirm} className="btn-primary text-sm">{isPrompt ? 'Submit' : confirmText}</button>
        </div>
      </div>
    </div>
  );
};


// --- Sub-Page Components ---

const ManageFeatures = ({ tournament, onBack }) => (
    <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300 flex items-center"><Settings className="mr-2" size={20}/> Set Match Features for: {tournament.name}</h2>
        <p className="text-gray-400 mb-6">This section will allow setting up round details, map pools, specific rules per stage, etc. (Functionality TBD)</p>
        <div className="bg-dark-700 p-4 rounded border border-dark-600 text-center text-gray-500"> Feature configuration options will appear here. </div>
        <button onClick={onBack} className="btn-secondary flex items-center mt-6"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
    </AnimatedSection>
);

const ManageResults = ({ tournament, onBack }) => (
    <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary-300 flex items-center"><ListChecks className="mr-2" size={20}/> Update Results for: {tournament.name}</h2>
        <p className="text-gray-400 mb-6">This section will display matches based on the schedule/groups and allow entering scores. (Functionality TBD)</p>
        <div className="bg-dark-700 p-4 rounded border border-dark-600 text-center text-gray-500"> Match list and score reporting interface will appear here. </div>
        <button onClick={onBack} className="btn-secondary flex items-center mt-6"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
    </AnimatedSection>
);

const ManageSchedule = ({ tournament, onBack, openModal }) => {
    // ... (Keep implementation from previous step) ...
    const [scheduleUpdates, setScheduleUpdates] = useState({});
    const generateMatchesFromGroups = (groups) => { /* ... */ };
    const matchesToSchedule = (tournament.groupingFinalized && Array.isArray(tournament.groups)) ? generateMatchesFromGroups(tournament.groups) : [];
    const handleDateTimeChange = (matchId, value) => { setScheduleUpdates(prev => ({ ...prev, [matchId]: value })); };
    const handleSaveSchedule = () => { console.log("Simulated Schedule Save:", scheduleUpdates); openModal({ title:"Schedule Saved", message: "Simulated saving schedule updates.", showCancel: false }); };

    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-primary-300 flex items-center"><CalendarCheck className="mr-2" size={20}/> Set Schedule for: {tournament.name}</h2>
            {!tournament.groupingFinalized || matchesToSchedule.length === 0 ? (
                 <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-center text-sm text-yellow-300 flex items-center justify-center"> <AlertTriangle size={16} className="mr-2"/> Please finalize group randomization first. </div>
            ) : (
                <>
                    <p className="text-gray-400 text-sm mb-6">Assign dates and times to the generated group stage matches.</p>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {matchesToSchedule.map((match) => (
                            <div key={match.id} className="bg-dark-700/50 p-3 rounded border border-dark-600 space-y-2">
                                <p className="text-xs font-semibold text-primary-400">{match.round} - Match ID: {match.id}</p>
                                <p className="text-sm font-medium text-center text-gray-300">
                                    <span className="flex items-center justify-center gap-1"> <img src={match.team1.logo || 'https://via.placeholder.com/30x30/777777/ffffff?text=?'} alt="" className="w-4 h-4 rounded"/> {match.team1.name} </span>
                                    <span className="text-primary-500 mx-1 text-xs">vs</span>
                                    <span className="flex items-center justify-center gap-1"> <img src={match.team2.logo || 'https://via.placeholder.com/30x30/777777/ffffff?text=?'} alt="" className="w-4 h-4 rounded"/> {match.team2.name} </span>
                                </p>
                                <input type="datetime-local" value={scheduleUpdates[match.id] || ''} onChange={(e) => handleDateTimeChange(match.id, e.target.value)} className="input-field input-field-sm w-full text-xs" />
                            </div>
                         ))}
                    </div>
                </>
            )}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-700">
                 <button onClick={onBack} className="btn-secondary flex items-center text-sm"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
                 {tournament.groupingFinalized && matchesToSchedule.length > 0 && ( <button onClick={handleSaveSchedule} className="btn-primary flex items-center text-sm"> <Save size={16} className="mr-2" /> Save Schedule </button> )}
            </div>
        </AnimatedSection>
    );
};

// ** CORRECTED V5: Restored JSX return for ManageGroups **
const ManageGroups = ({ tournament, onBack, onGroupingFinalized, openModal }) => {
    const deadlinePassed = isDeadlinePassed(tournament.registrationDeadline);
    const handleRandomizeClick = () => {
         if (tournament.groupingFinalized) { openModal({ title: "Grouping Finalized", message: "Grouping has already been finalized for this tournament.", showCancel: false }); return; }
        if (!deadlinePassed) { openModal({ title: "Cannot Randomize Yet", message: `Registration deadline (${new Date(tournament.registrationDeadline).toLocaleDateString()}) hasn't passed.`, showCancel: false }); return; }
        if (tournament.participantsList.length === 0) { openModal({ title: "No Participants", message: "No participants registered to randomize.", showCancel: false }); return; }

         openModal({
            title: `Randomize Groups for "${tournament.name}"`,
            promptLabel: `Enter number of groups (Min 2, Max ${Math.floor(tournament.participantsList.length / 2) || 1}):`,
            onPromptSubmit: (numGroupsStr) => {
                const numGroups = parseInt(numGroupsStr);
                const minGroups = 2;
                const maxGroups = Math.floor(tournament.participantsList.length / 2) || 1;

                if (isNaN(numGroups) || numGroups < minGroups || numGroups > maxGroups) {
                    openModal({ title: "Invalid Input", message: `Please enter a number between ${minGroups} and ${maxGroups}.`, showCancel: false }); return;
                }
                const teamsPerGroupApprox = Math.ceil(tournament.participantsList.length / numGroups);
                const shuffledParticipants = [...tournament.participantsList].sort(() => 0.5 - Math.random());
                const newGroups = Array.from({ length: numGroups }, () => []);
                shuffledParticipants.forEach((participant, index) => { newGroups[index % numGroups].push(participant); });
                openModal({ title: "Success", message: `Simulated randomization into ${numGroups} groups of ~${teamsPerGroupApprox} teams.`, showCancel: false });
                onGroupingFinalized(tournament.id, newGroups);
            }
        });
    };

    // ** THIS IS THE JSX THAT WAS MISSING EARLIER **
    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-dark-700 pb-4 mb-6">
                 <h2 className="text-2xl font-bold text-primary-300 flex items-center mb-3 sm:mb-0"> <Users size={22} className="mr-3"/> Participants & Groups: {tournament.name} </h2>
                <button onClick={handleRandomizeClick} className={`btn-primary btn-sm flex items-center ${!deadlinePassed || tournament.groupingFinalized ? 'opacity-50 cursor-not-allowed' : ''}`} title={tournament.groupingFinalized ? "Grouping finalized" : !deadlinePassed ? `Available after ${new Date(tournament.registrationDeadline).toLocaleDateString()}` : "Randomize Participants into Groups"} >
                    <Shuffle size={16} className="mr-2" /> Randomize Groups
                </button>
            </div>
             {!deadlinePassed && !tournament.groupingFinalized && ( <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-center text-sm text-yellow-300 flex items-center justify-center"> <AlertTriangle size={16} className="mr-2"/> Group randomization will be available after the registration deadline ({new Date(tournament.registrationDeadline).toLocaleDateString()}). </div> )}
            {tournament.groupingFinalized && tournament.groups.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-100">Finalized Groups</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tournament.groups.map((group, index) => (
                            <div key={`group-${index}`} className="bg-dark-700/50 p-4 rounded-lg border border-dark-600">
                                <h4 className="font-bold text-primary-400 mb-3 border-b border-dark-600 pb-2">Group {String.fromCharCode(65 + index)}</h4>
                                <ul className="space-y-3 text-sm">
                                    {group.map(team => ( <li key={team.id} className="flex items-center text-gray-300"> <img src={team.logo || 'https://via.placeholder.com/30x30/777777/ffffff?text=?' } alt="" className="w-5 h-5 rounded mr-2 flex-shrink-0"/> {team.name} </li> ))}
                                     {group.length === 0 && <li className="text-gray-500 italic">Empty group</li>}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-gray-100">Registered Participants ({tournament.participantsList.length})</h3>
                {tournament.participantsList.length > 0 ? (
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto bg-dark-900/30 p-3 rounded border border-dark-600">
                        {tournament.participantsList.map(p => ( <div key={p.id} className="flex items-center text-sm text-gray-300 bg-dark-700 p-1.5 rounded"> <img src={p.logo || 'https://via.placeholder.com/30x30/777777/ffffff?text=?' } alt="" className="w-5 h-5 rounded mr-2 flex-shrink-0"/> <span className="truncate">{p.name}</span> </div> ))}
                     </div>
                ) : ( <p className="text-gray-500 italic card bg-dark-700 p-4 text-center">No participants registered yet.</p> )}
            </div>
            <button onClick={onBack} className="btn-secondary flex items-center mt-8"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
        </AnimatedSection>
    );
};


// --- Main Dashboard Component ---
export default function UpdateTournamentPage() {
    // ... (Keep state, useEffect, modal functions, action handlers) ...
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('list');
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '', promptLabel: null, onPromptSubmit: null, onConfirm: null });

    useEffect(() => { setLoading(true); setTimeout(() => { setTournaments(initialTournamentsData); setLoading(false); }, 500); }, []);

    const openModal = ({ title, message, children, promptLabel, onPromptSubmit, onConfirm, confirmText = 'OK', showCancel = true }) => { setModalContent({ title, message, children, promptLabel, onPromptSubmit, onConfirm, confirmText, showCancel }); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);
    const handleDelete = (id, name) => { /* ... logic using openModal ... */ };
    const handleBackToList = () => { setSelectedTournament(null); setCurrentView('list'); };
    const handleSelectTournament = (view, tournament) => { setSelectedTournament(tournament); setCurrentView(view); };
    const handleGroupingFinalized = (tournamentId, newGroups) => { /* ... logic to update state ... */ };

     // --- Loading State ---
    if (loading) { return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> ); }

    // --- Main Render Logic ---
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header */}
                <AnimatedSection delay={0}>
                     <h1 className="text-4xl font-extrabold text-center text-primary-400 mb-2 flex items-center justify-center"> <Settings className="w-8 h-8 mr-3" /> Tournament Management </h1>
                     <p className="text-center text-gray-400"> Oversee tournaments, manage participants, schedules, and results. </p>
                </AnimatedSection>

                {/* Conditional Rendering: List or Sub-Page */}
                {currentView === 'list' ? (
                     <AnimatedSection delay={100} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                        {/* ... Tournament List JSX ... */}
                         <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Your Tournaments ({tournaments.length})</h2>
                        {tournaments.length > 0 ? (
                            <div className="space-y-6">
                                {tournaments.map((t, index) => {
                                    const deadlineHasPassed = isDeadlinePassed(t.registrationDeadline);
                                    return ( <AnimatedSection key={t.id} delay={150 + index * 100} className="bg-dark-700/50 rounded-lg p-4 border border-dark-600 hover:border-primary-500/30 transition-colors duration-200"> <div className="flex flex-col md:flex-row justify-between md:items-center gap-4"> {/* Info */} <div className="flex-grow"> <h3 className="text-xl font-semibold text-white mb-1">{t.name}</h3> <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400"> <span>Game: <span className="text-primary-400">{t.game}</span></span> <span>Starts: {new Date(t.startDate).toLocaleDateString()}</span> <span>Status: <span className="font-medium">{t.status}</span></span> <span>Players: {t.participants}/{t.maxParticipants}</span> <span>Reg. Deadline: {new Date(t.registrationDeadline).toLocaleDateString()}</span> </div> </div> {/* Actions */} <div className="flex flex-wrap gap-2 flex-shrink-0"> <Link to={`/tournament/${t.id}`} className="btn-secondary btn-xs flex items-center" title="View Details"><Eye size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">View</span></Link> <button onClick={() => handleSelectTournament('results', t)} className="btn-secondary btn-xs flex items-center" title="Update Results"><ListChecks size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Results</span></button> <button onClick={() => handleSelectTournament('groups', t)} className="btn-secondary btn-xs flex items-center" title="Manage Groups/Participants"><Users size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Groups</span></button> <button onClick={() => handleSelectTournament('schedule', t)} className="btn-secondary btn-xs flex items-center" title="Set Schedule"><CalendarCheck size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Schedule</span></button> <button onClick={() => handleDelete(t.id, t.name)} className="bg-red-600/20 hover:bg-red-500/30 text-red-400 font-bold py-1 px-2 rounded transition-colors text-xs flex items-center" title="Delete Tournament"><Trash2 size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Delete</span></button> </div> </div> </AnimatedSection> ); })} </div>
                        ) : ( <p className="text-gray-500 text-center py-6">You haven't created any tournaments yet.</p> )}
                        <div className="text-center mt-8 border-t border-dark-700 pt-6"> <Link to="/create-tournament" className="btn-primary"> Create New Tournament </Link> </div>
                    </AnimatedSection>
                ) : (
                    <>
                        {currentView === 'results' && <ManageResults tournament={selectedTournament} onBack={handleBackToList} />}
                        {currentView === 'groups' && <ManageGroups tournament={selectedTournament} onBack={handleBackToList} onGroupingFinalized={handleGroupingFinalized} openModal={openModal} />}
                        {currentView === 'schedule' && <ManageSchedule tournament={selectedTournament} onBack={handleBackToList} openModal={openModal}/>}
                        {currentView === 'features' && <ManageFeatures tournament={selectedTournament} onBack={handleBackToList} />}
                    </>
                 )}

                {/* Modal Rendering */}
                <CustomModal
                    isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}
                    promptLabel={modalContent.promptLabel} onPromptSubmit={modalContent.onPromptSubmit}
                    onConfirm={modalContent.onConfirm} confirmText={modalContent.confirmText}
                    showCancel={modalContent.showCancel}
                >
                    {modalContent.message} {modalContent.children}
                 </CustomModal>

            </div>
            {/* Styles */}
            <style jsx global>{`
                /* ... Keep styles as before ... */
             `}</style>
        </div>
    );
}