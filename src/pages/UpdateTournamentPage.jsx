// src/pages/UpdateTournamentPage.jsx (FINAL INTEGRATED DEMO)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Settings, Trash2, Edit3, ListChecks, Shuffle, CalendarCheck, Eye, ArrowLeft, Users, AlertTriangle, Save,
    X, HelpCircle, Info, TrendingUp, Zap, Upload, CheckCircle, Target, Trophy, Swords, Send, BarChart2, Calendar, Clock, Edit
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- Placeholder Tournament Data (FINAL CONFIGURATION) ---
const teamTemplate = (id, name, logo) => ({ 
    id, name, logo, 
    score: 0, kills: 0, placement: 0, 
    group: null, advanced: false 
});

// Helper for generating round-robin matches
const generateRoundRobinSchedule = (teams, totalWeeks) => {
    if (teams.length < 2) return [];
    
    // Ensure even number of teams for a clean schedule
    const N = teams.length;
    const isOdd = N % 2 !== 0;
    const teamsToSchedule = isOdd ? [...teams, { id: 'BYE', name: 'BYE', isBye: true }] : teams;
    const numTeams = teamsToSchedule.length;
    const rounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;
    const schedule = [];

    // 'Pivot' team remains stationary
    const pivot = teamsToSchedule[0]; 
    // Remaining teams rotate
    let rotatingTeams = teamsToSchedule.slice(1); 

    let matchCounter = 1;
    for (let round = 1; round <= rounds; round++) {
        // Only run for the specified number of weeks/rounds
        if (round > totalWeeks) break;
        
        for (let i = 0; i < matchesPerRound; i++) {
            const team1 = i === 0 ? pivot : rotatingTeams[i - 1];
            const team2 = rotatingTeams[numTeams - 2 - i];

            // Skip BYE match if necessary
            if (team1.isBye || team2.isBye) continue; 
            
            schedule.push({
                id: `RR${round}_M${matchCounter++}`,
                stage: 'Round Robin League',
                matchNumber: matchCounter - 1,
                round: round,
                teams: [{ id: team1.id, name: team1.name, score: null, win: false }, { id: team2.id, name: team2.name, score: null, win: false }],
                status: 'Scheduled', 
                dateTime: `2026-05-${round * 7 + (i)}T18:00`, // Example date/time
                results: []
            });
        }
        // Rotate teams (move the last team to the beginning of the rotating array)
        if (rotatingTeams.length > 0) {
            const lastTeam = rotatingTeams.pop();
            rotatingTeams.unshift(lastTeam);
        }
    }
    return schedule;
};


// 30 Teams for MLBB (Max 64, example 30)
const mlbbTeams = Array.from({ length: 30 }, (_, i) => teamTemplate(3000 + i, `MLBB Squad ${i + 1}`, `https://via.placeholder.com/30x30/1E90FF/000000?text=M${i+1}`));

const initialTournamentsData = [
    {
        // Tournament 1: COD/Free Fire Placeholder
        id: 1, name: 'African COD Warzone Championship (Free Fire Format)', game: 'COD Warzone (BR)', startDate: '2026-03-15', status: 'In Progress', participants: 96, maxParticipants: 128, registrationDeadline: '2026-03-10',
        participantsList: Array.from({ length: 96 }, (_, i) => teamTemplate(1000 + i, `COD Team ${i + 1}`, `https://via.placeholder.com/30x30/cccccc/000000?text=C${i+1}`)),
        format: 'multi-stage-br', // Use BR for management view consistency (it will show the unsupported message)
        groupingFinalized: false, bracketFinalized: false, 
    },
    {
        // Tournament 2: Farlight 84 League (Fully Managed BR League Demo)
        id: 2, name: "ARE X FL84 MENA LEAGUE (4-Week Cycle)", game: 'Farlight 84 (League BR)', startDate: '2025-10-20', status: 'Draft', participants: 20, maxParticipants: 20, registrationDeadline: '2025-10-18', 
        participantsList: Array.from({ length: 20 }, (_, i) => teamTemplate(2000 + i, `FL84 Squad ${i + 1}`, `https://via.placeholder.com/30x30/FF4500/000000?text=L${i+1}`)),
        format: 'multi-stage-br', 
        stages: [
            { id: 1, name: 'Week 1', status: 'Setup', totalTeams: 20, matchesPerWeek: 5, advanceRule: 'Points accumulate for 4-week cycle rewards.' },
            { id: 2, name: 'Week 2', status: 'Pending', totalTeams: 20, matchesPerWeek: 5, advanceRule: 'Points accumulate for 4-week cycle rewards.' },
            { id: 3, name: 'Week 3', status: 'Pending', totalTeams: 20, matchesPerWeek: 5, advanceRule: 'Points accumulate for 4-week cycle rewards.' },
            { id: 4, name: 'Week 4 - Final Points', status: 'Pending', totalTeams: 20, matchesPerWeek: 5, advanceRule: 'Final standings determine 1000 Diamond rewards.' },
        ],
        currentStage: 1,
        stageData: {
            1: { schedule: [], results: [], teamsAdvanced: 0, status: 'Setup' },
            2: { schedule: [], results: [], teamsAdvanced: 0, status: 'Pending' },
            3: { schedule: [], results: [], teamsAdvanced: 0, status: 'Pending' },
            4: { schedule: [], results: [], teamsAdvanced: 0, status: 'Pending' },
        }
    },
    {
        // Tournament 3: Mobile Legends League (Round-Robin to Bracket Demo)
        id: 3, name: 'African Mobile Legends League - Season 1 (AML)', game: 'Mobile Legends: Bang Bang', startDate: '2026-05-01', status: 'Draft', participants: 30, maxParticipants: 32, registrationDeadline: '2026-04-20', 
        participantsList: mlbbTeams,
        format: 'round-robin-to-bracket', // New Format Tag
        teamsToPlayoffs: 8, // Teams advancing to the next stage
        
        stages: [
            { id: 1, name: 'Group Stage (Round Robin)', totalTeams: 30, rounds: 5, type: 'League', pointsPerWin: 2, pointsPerLoss: 0 },
            { id: 2, name: 'Playoff Bracket', totalTeams: 8, type: 'Single Elimination', advancementRule: 'Top 8 seeded into BO3 bracket.' }
        ],
        currentStage: 1,
        stageData: {
            1: { schedule: [], results: [], teamsAdvanced: [], status: 'Setup' },
            2: { bracket: [], teamsSeeded: [], status: 'Pending' },
        }
    },
];

// Helper: Custom Modal (Keep unchanged for functionality)
const CustomModal = ({ isOpen, onClose, title, children, promptLabel, onPromptSubmit, showCancel = true, confirmText = 'OK', onConfirm, customBody, large = false }) => {
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
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full ${large ? 'max-w-4xl' : 'max-w-md'} border border-dark-600 relative animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${isPrompt ? 'text-blue-400' : 'text-yellow-400'}`} /> <h3 className="text-lg font-semibold text-white">{title || (isPrompt ? 'Input Required' : 'Alert')}</h3> </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                {customBody ? customBody : (
                    <div className="p-6 space-y-4">
                        {children && <div className="text-gray-300 text-sm">{children}</div>}
                        {isPrompt && ( <div> <label htmlFor="promptInput" className="block text-sm font-medium text-gray-300 mb-2">{promptLabel}</label> <input id="promptInput" type="number" min="2" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input-field w-full" autoFocus /> </div> )}
                    </div>
                )}
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    {showCancel && (<button onClick={onClose} className="btn-secondary text-sm">Cancel</button>)}
                    <button onClick={handleConfirm} className="btn-primary text-sm">{isPrompt ? 'Submit' : confirmText}</button>
                </div>
            </div>
        </div>
    );
};


// ------------------------------------------------------------------------------------
// SCORING ENGINE FUNCTIONS (BR - Free Fire Standard)
// ------------------------------------------------------------------------------------

/**
 * Calculates placement points using a 3-point decrement system (Free Fire standard).
 * (1st: 39, 2nd: 36, 3rd: 33, ... 12th: 6)
 * Note: Only calculates for the 12 teams in the simulated lobby.
 */
const calculatePlacementPoints = (placement) => {
    if (placement < 1 || placement > 12) return 0;
    // Formula: 39 - (3 * (placement - 1))
    return 39 - (3 * (placement - 1)); 
};

/**
 * Calculates kill points. Stays at 2 points per kill.
 */
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// ------------------------------------------------------------------------------------
// CORE COMPONENT 1: BR League Management View (Farlight 84 Demo)
// ------------------------------------------------------------------------------------

const BRStageManagementView = ({ tournament, onBack, onTournamentUpdate, openModal }) => {
    const { stages, currentStage, participantsList, stageData } = tournament;
    const currentStageDetails = stages.find(s => s.id === currentStage);
    const currentStageState = stageData[currentStage];
    
    const [viewMode, setViewMode] = useState('overview'); 
    const [selectedMatch, setSelectedMatch] = useState(null); 
    const [editingMatchId, setEditingMatchId] = useState(null); 
    
    const allLeagueTeams = participantsList;

    // --- STANDINGS CALCULATION (Overall) ---
    const overallStandings = useMemo(() => {
        const standingsMap = allLeagueTeams.reduce((acc, team) => {
            acc[team.id] = { team: team, mapsPlayed: 0, placementPoints: 0, killPoints: 0, totalPoints: 0, wins: 0 };
            return acc;
        }, {});
        
        currentStageState.results.forEach(match => {
            match.matchResults.forEach(result => {
                const teamId = result.teamId;
                if (standingsMap[teamId]) {
                    const stats = standingsMap[teamId];
                    stats.mapsPlayed += 1;
                    const pPoints = calculatePlacementPoints(result.placement);
                    const kPoints = calculateKillPoints(result.kills);
                    const tPoints = pPoints + kPoints;
                    stats.placementPoints += pPoints;
                    stats.killPoints += kPoints;
                    stats.totalPoints += tPoints;
                    if (result.placement === 1) stats.wins += 1;
                }
            });
        });
        
        // Sort: Total Points (Primary) -> Kill Points (Secondary) -> Wins (Tertiary)
        const sortedStandings = Object.values(standingsMap).sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            if (b.killPoints !== a.killPoints) return b.killPoints - a.killPoints;
            return b.wins - a.wins;
        });

        return sortedStandings;
    }, [currentStageState.results, allLeagueTeams]);


    // --- ACTION HANDLERS (Farlight 84 League) ---

    // 1. Schedule Generation
    const handleScheduleGeneration = () => {
        if (currentStageState.schedule.length > 0) { openModal({ title: "Schedule Already Set", message: `Stage ${currentStage} schedule is already set.`, showCancel: false }); return; }
        
        openModal({
            title: `Confirm Schedule Generation for ${currentStageDetails.name}`,
            message: `You are about to generate ${currentStageDetails.matchesPerWeek} matches. Each match will contain a randomized selection of 12 teams from the 20 registered.`,
            confirmText: 'Generate Schedule',
            onConfirm: () => {
                const now = new Date();
                const defaultDateTime = new Date(now.getTime() + (1000 * 60 * 60 * 24)).toISOString().slice(0, 16); // Tomorrow's date/time
                
                const newSchedule = [];
                const shuffledTeams = [...allLeagueTeams];

                for (let i = 0; i < currentStageDetails.matchesPerWeek; i++) {
                    const lobbyTeams = shuffledTeams.sort(() => 0.5 - Math.random()).slice(0, 12);
                        
                    newSchedule.push({
                        id: `${currentStage}_M${i + 1}`, matchNumber: i + 1,
                        teams: lobbyTeams.map(t => ({ id: t.id, name: t.name })),
                        status: 'Pending', dateTime: defaultDateTime, results: []
                    });
                }

                const updatedStageData = { ...stageData, [currentStage]: { ...currentStageState, schedule: newSchedule, status: 'Schedule Set' } };
                const updatedStages = stages.map(s => s.id === currentStage ? { ...s, status: 'In Progress' } : s);
                
                onTournamentUpdate({ ...tournament, stageData: updatedStageData, stages: updatedStages });
                openModal({ title: "Schedule Complete", message: `Successfully generated ${newSchedule.length} matches. Set the exact time/date now.`, showCancel: false });
                setViewMode('schedule');
            }
        });
    };

    // 2. Schedule Editing (Sets the exact date/time)
    const handleUpdateSchedule = (matchId, newDateTime) => {
        const updatedSchedule = currentStageState.schedule.map(match => 
            match.id === matchId ? { ...match, dateTime: newDateTime, status: 'Scheduled' } : match
        );
        const updatedStageData = { ...stageData, [currentStage]: { ...currentStageState, schedule: updatedSchedule } };
        onTournamentUpdate({ ...tournament, stageData: updatedStageData });
        setEditingMatchId(null);
    };

    // 3. Open Modal for Results Entry
    const handleOpenResultsEntry = (match) => {
        const initialResults = match.results.length > 0 
            ? match.results
            : match.teams.map(t => ({ teamId: t.id, teamName: t.name, placement: null, kills: 0 }));
        
        setSelectedMatch({...match, matchResults: initialResults});
        setViewMode('resultsEntry');
    };

    // 4. Submit Results
    const handleSubmitResults = (updatedResults) => {
        // Validation: ensure 1st to Nth placement is used only once
        const placements = updatedResults.map(r => r.placement).filter(p => p !== null && p > 0);
        const uniquePlacements = new Set(placements);
        if (placements.length !== uniquePlacements.size || placements.length !== selectedMatch.teams.length) {
            alert(`Error: Duplicate or missing placements detected. All ${selectedMatch.teams.length} teams must have a unique placement number from 1 to ${selectedMatch.teams.length}.`);
            return;
        }

        const updatedSchedule = currentStageState.schedule.map(match => 
            match.id === selectedMatch.id ? { ...match, results: updatedResults, status: 'Completed' } : match
        );

        const filteredResults = currentStageState.results.filter(r => r.id !== selectedMatch.id);
        const newMatchResult = {
            id: selectedMatch.id,
            matchResults: updatedResults.map(r => ({
                teamId: r.teamId, placement: parseInt(r.placement), kills: parseInt(r.kills)
            }))
        };
        
        const updatedStageData = { ...stageData, [currentStage]: { 
            ...currentStageState, 
            schedule: updatedSchedule,
            results: [...filteredResults, newMatchResult].sort((a,b) => a.id.localeCompare(b.id)) 
        }};
        
        onTournamentUpdate({ ...tournament, stageData: updatedStageData });
        setViewMode('schedule');
        setSelectedMatch(null);
        openModal({ title: "Results Submitted", message: `Results for Match ${selectedMatch.id} successfully recorded and standings updated.`, showCancel: false, confirmText: 'Got It' });
    };

    // 5. Week Finalization
    const handleFinalizeWeek = () => {
        const totalMatchesRequired = currentStageDetails.matchesPerWeek;
        const completedMatches = currentStageState.schedule.filter(m => m.status === 'Completed').length;
        
        if (completedMatches < totalMatchesRequired) {
            openModal({ title: "Matches Incomplete", message: `Only ${completedMatches} of ${totalMatchesRequired} matches have results submitted. Please complete all matches before finalizing the Week/Stage.`, showCancel: false });
            return;
        }

        const nextStage = currentStage < 4 ? currentStage + 1 : currentStage;
        
        openModal({
            title: `Confirm Stage ${currentStage} Finalization`,
            message: `The results for ${currentStageDetails.name} are complete. Standings are locked. The tournament proceeds to the next Week/Stage.`,
            confirmText: currentStage === 4 ? 'FINALIZE TOURNAMENT' : 'PROCEED TO NEXT WEEK',
            onConfirm: () => {
                
                const updatedStageData = { 
                    ...stageData, 
                    [currentStage]: { ...currentStageState, teamsAdvanced: allLeagueTeams, status: 'Completed', results: overallStandings },
                    [nextStage]: nextStage > currentStage ? { ...stageData[nextStage], teamsToGroup: allLeagueTeams, status: 'Ready' } : stageData[nextStage],
                };
                
                const updatedStages = stages.map(s => {
                    if (s.id === currentStage) return { ...s, status: 'Completed' };
                    if (s.id === nextStage) return { ...s, status: 'In Progress' };
                    return s;
                });
                
                onTournamentUpdate({ 
                    ...tournament, 
                    stageData: updatedStageData, 
                    stages: updatedStages, 
                    currentStage: nextStage,
                    status: nextStage > 4 ? 'Completed' : 'In Progress' 
                });

                openModal({ title: currentStage === 4 ? "TOURNAMENT COMPLETE" : "Week Finalized", message: currentStage === 4 ? `The 4-Week Cycle is complete. Total points winner claims the prize!` : `${currentStageDetails.name} is complete. Proceed to setup ${stages.find(s=>s.id === nextStage).name}.`, showCancel: false });
                setViewMode('overview'); 
            }
        });
    };
    
    // --- UI Components (Same as previous Farlight 84 demo) ---

    // 1. Results Entry Modal Content
    const ResultsEntryModalContent = () => {
        const [results, setResults] = useState(selectedMatch?.matchResults || []);
        const lobbySize = selectedMatch.teams.length;
        
        const handleResultChange = (teamId, field, value) => {
            setResults(prev => prev.map(r => 
                r.teamId === teamId ? { ...r, [field]: value } : r
            ));
        };
        
        const handleSimulate = () => {
            const shuffledTeams = [...results].sort(() => 0.5 - Math.random());
            const simulated = shuffledTeams.map((team, index) => ({
                ...team,
                placement: index + 1,
                kills: Math.floor(Math.random() * 15)
            }));
            setResults(simulated);
        };
        
        const currentPlacementPoints = calculatePlacementPoints;

        return (
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full max-w-4xl border border-dark-600 relative`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-xl font-semibold text-white flex items-center"><Upload className='mr-2 size-5'/> Results Entry: {selectedMatch.id}</h3>
                    <button onClick={() => setViewMode('schedule')} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-400">
                            Match {selectedMatch.matchNumber} | Lobby Size: {lobbySize} Teams. <br/>
                            <span className='font-bold text-yellow-400'>Placement Points: 3-point decrement (e.g., 1st=39, 2nd=36, etc.). Kill Points: 2pts/kill.</span>
                        </p>
                        <button onClick={handleSimulate} className="btn-secondary btn-xs flex items-center bg-blue-900/30 text-blue-300 border-blue-700/50 hover:bg-blue-900/50">
                            <Zap size={14} className="mr-1"/> Simulate Match Results
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-dark-700">
                            <thead className="bg-dark-700/70">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Placement (1-{lobbySize})</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Kills</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">P. Points</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">K. Points</th>
                                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700 text-sm">
                                {results.map((teamResult) => {
                                    const placement = parseInt(teamResult.placement) || 0;
                                    const kills = parseInt(teamResult.kills) || 0;
                                    const pPoints = currentPlacementPoints(placement);
                                    const kPoints = calculateKillPoints(kills);
                                    const tPoints = pPoints + kPoints;
                                    
                                    return (
                                        <tr key={teamResult.teamId} className="hover:bg-dark-700/50 transition-colors">
                                            <td className="px-3 py-2 text-gray-500 font-mono">{teamResult.teamId.toString().slice(-3)}</td>
                                            <td className="px-3 py-2 font-medium text-white">{teamResult.teamName}</td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="number" min="1" max={lobbySize}
                                                    value={teamResult.placement || ''}
                                                    onChange={(e) => handleResultChange(teamId, 'placement', e.target.value)}
                                                    className="input-field input-field-sm w-16 text-center"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="number" min="0"
                                                    value={teamResult.kills}
                                                    onChange={(e) => handleResultChange(teamId, 'kills', e.target.value)}
                                                    className="input-field input-field-sm w-16 text-center"
                                                />
                                            </td>
                                            <td className={`px-3 py-2 text-center font-bold ${pPoints > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{pPoints}</td>
                                            <td className={`px-3 py-2 text-center font-bold ${kPoints > 0 ? 'text-red-400' : 'text-gray-500'}`}>{kPoints}</td>
                                            <td className="px-3 py-2 text-center font-extrabold text-primary-300">{tPoints}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    <button onClick={() => setViewMode('schedule')} className="btn-secondary text-sm">Cancel</button>
                    <button onClick={() => handleSubmitResults(results)} className="btn-primary text-sm flex items-center">
                        <Save size={14} className="mr-1"/> Save & Finalize Results
                    </button>
                </div>
            </div>
        );
    };

    // 2. Schedule View (Simplified)
    const ScheduleView = () => {
        const schedule = currentStageState.schedule;
        const totalMatches = currentStageDetails.matchesPerWeek;
        const completedMatches = schedule.filter(m => m.status === 'Completed').length;
        
        return (
            <div className="space-y-6">
                <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                    <h3 className="text-xl font-bold text-white flex items-center"><Calendar size={20} className='mr-2 text-primary-400'/> Match Schedule</h3>
                    <div className="text-sm text-gray-300">
                        Progress: <span className='font-bold text-primary-400'>{completedMatches}</span> / {totalMatches} Matches Completed
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {schedule.map(match => (
                        <div key={match.id} className={`bg-dark-700/50 p-4 rounded-lg border ${match.status === 'Completed' ? 'border-green-600/50' : 'border-dark-600'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-lg font-semibold text-white">{match.id}</span>
                                    <p className="text-xs text-gray-400">Match {match.matchNumber} | Lobby Size: {match.teams.length} Teams</p>
                                    
                                    {editingMatchId === match.id ? (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                type="datetime-local" defaultValue={match.dateTime.slice(0, 16)} id={`dt-${match.id}`}
                                                className="input-field input-field-sm w-48"
                                            />
                                            <button onClick={() => { const newDateTime = document.getElementById(`dt-${match.id}`).value; handleUpdateSchedule(match.id, newDateTime); }} className="btn-primary btn-xs"> <Save size={14}/> </button>
                                            <button onClick={() => setEditingMatchId(null)} className="bg-red-600/20 hover:bg-red-500/30 text-red-400 font-bold py-1 px-2 rounded transition-colors text-xs"> <X size={14}/> </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 mt-1">
                                            <p className="text-sm font-medium text-primary-400 flex items-center">
                                                <Clock size={14} className='mr-1'/> {new Date(match.dateTime).toLocaleString()}
                                            </p>
                                            <button onClick={() => setEditingMatchId(match.id)} className="text-gray-500 hover:text-primary-400 transition-colors" title="Edit Date/Time"> <Edit size={14}/> </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600 text-white' : match.status === 'Scheduled' ? 'bg-primary-600 text-white' : 'bg-yellow-600 text-black'}`}>
                                        {match.status}
                                    </span>
                                    <button onClick={() => handleOpenResultsEntry(match)} className="btn-primary btn-xs mt-2 flex items-center ml-auto">
                                        <ListChecks size={14} className='mr-1'/> {match.status === 'Completed' ? 'View/Edit Results' : 'Enter Results'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button onClick={() => setViewMode('standings')} className="btn-secondary flex items-center"> <BarChart2 size={16} className="mr-2" /> View Overall Standings </button>
            </div>
        );
    };

    // 3. Overall Standings View
    const OverallStandingsView = () => (
        <div className="space-y-6">
            <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                <h3 className="text-xl font-bold text-white flex items-center"><BarChart2 size={20} className='mr-2 text-primary-400'/> Stage Standings: {currentStageDetails.name}</h3>
                <button onClick={() => setViewMode('schedule')} className="btn-secondary btn-xs flex items-center"> <Calendar size={16} className="mr-1" /> View Schedule </button>
            </div>

            <div className='bg-dark-700 rounded-lg shadow-xl border border-dark-600'>
                <h4 className='text-lg font-bold text-white p-3 border-b border-dark-600 bg-dark-600/50'>Overall Leaderboard <span className='text-sm text-gray-400 font-normal'>({allLeagueTeams.length} Teams)</span></h4>
                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-dark-700">
                        <thead className="bg-dark-600/70">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Matches</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">P. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-red-400 uppercase tracking-wider">K. Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">Total Pts</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-green-400 uppercase tracking-wider">Wins</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {overallStandings.map((stat, index) => {
                                const isTopSpot = currentStage === 4 && index === 0;
                                return (
                                    <tr key={stat.team.id} className={`transition-colors ${isTopSpot ? 'bg-purple-900/20 hover:bg-purple-900/30 border-l-4 border-purple-500' : 'hover:bg-dark-700'}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{stat.team.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{stat.mapsPlayed}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-yellow-300">{stat.placementPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-red-300">{stat.killPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-extrabold text-primary-300">{stat.totalPoints}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-green-400">{stat.wins}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-dark-700 pt-4">
                 <button onClick={handleFinalizeWeek} className="btn-primary flex items-center">
                    <Send size={16} className="mr-2" /> {currentStage === 4 ? 'FINALIZE TOURNAMENT' : `PROCEED TO WEEK ${currentStage + 1}`}
                </button>
            </div>
        </div>
    );
    
    // --- Main View Renderer ---

    const renderStageView = () => {
        if (tournament.id === 1) {
            // Free Fire/COD Tournament 1 fallback
            return (
                <div className='bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-sm text-red-300 flex items-center'>
                    <AlertTriangle size={18} className="mr-2"/> Management view for **Free Fire/COD (ID 1)** is currently dedicated to demonstrating the **Farlight 84 League (ID 2)** system. Please use the Farlight 84 tournament demo for a fully functional BR results system.
                </div>
            );
        }
        
        if (currentStageState.status === 'Completed') {
            return (
                <div className='bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-sm text-green-300 space-y-4'>
                    <div className="flex items-center text-lg font-bold"><CheckCircle size={20} className="mr-2"/> Stage {currentStage} ({currentStageDetails.name}) is Completed.</div>
                    <p>Final Standings for this week are locked. You can now manage **Stage {currentStage + 1}**.</p>
                    <button onClick={() => setViewMode('standings')} className="btn-secondary btn-xs flex items-center bg-green-900/50 text-green-300 border-green-700"> <BarChart2 size={14} className="mr-1" /> View Final Standings </button>
                </div>
            );
        }

        if (currentStageState.schedule.length === 0) {
            return (
                <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                    <div className="flex items-center text-lg font-bold"><CalendarCheck size={20} className="mr-2"/> Status: {currentStageDetails.name} Schedule Pending</div>
                    <p>The **{currentStageDetails.totalTeams} teams** are ready. Generate the **{currentStageDetails.matchesPerWeek} matches** for this week's league play. </p>
                    <button onClick={handleScheduleGeneration} className="btn-primary flex items-center">
                        <CalendarCheck size={16} className="mr-2" /> Generate Match Schedule
                    </button>
                </div>
            );
        }

        switch (viewMode) {
            case 'schedule':
                return <ScheduleView />;
            case 'standings':
                return <OverallStandingsView />;
            case 'resultsEntry':
                return null;
            case 'overview':
            default:
                return (
                    <div className='space-y-6'>
                         <div className='bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-300'>
                            <h3 className="font-bold mb-2 flex items-center"><Info size={16} className='mr-2'/> Stage {currentStage} Management Menu</h3>
                            <p>Schedule is set. Proceed to manage matches and enter results to calculate the overall league standings for the current week.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setViewMode('schedule')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                <CalendarCheck size={20} className='mr-2 text-primary-400'/> Manage Schedule & Results
                            </button>
                            <button onClick={() => setViewMode('standings')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                <BarChart2 size={20} className='mr-2 text-primary-400'/> View Overall Standings
                            </button>
                        </div>
                    </div>
                );
        }
    };
    
    // Fallback UI for non-Farlight 84/non-MLBB multi-stage view
    if (tournament.format !== 'multi-stage-br' && tournament.id !== 1) return null; // Should be handled by parent
    
    if (viewMode === 'resultsEntry' && selectedMatch) {
        return (
            <AnimatedSection className="space-y-6">
                <div className='flex justify-between items-center'>
                    <button onClick={() => setViewMode('schedule')} className="btn-secondary flex items-center"> <ArrowLeft size={16} className="mr-2" /> Back to Schedule </button>
                </div>
                <ResultsEntryModalContent/>
            </AnimatedSection>
        );
    }

    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-bold text-primary-300 flex items-center border-b border-dark-700 pb-3">
                <TrendingUp className="mr-3" size={24}/> {tournament.id === 1 ? 'Free Fire/COD Management (Demo View)' : 'Farlight 84 League Management'}
            </h2>
            
            <p className="text-gray-400">
                Current Stage: <span className='font-bold text-primary-400'>{currentStageDetails?.name || 'Error'}</span>. Total Teams: **{currentStageDetails.totalTeams}** | **League BR Format**
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {stages.map((stage) => {
                    const isCurrent = stage.id === currentStage;
                    const isCompleted = stageData[stage.id]?.status === 'Completed';
                    const statusColor = isCompleted ? 'bg-green-600' : isCurrent ? 'bg-primary-600' : 'bg-dark-600';
                    const teamsIn = stage.totalTeams;
                    
                    return (
                        <div key={stage.id} className={`p-4 rounded-lg shadow-lg border-2 ${isCurrent ? 'border-primary-500 bg-dark-700' : isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-dark-600 bg-dark-700/50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm font-semibold text-white px-2 py-0.5 rounded ${statusColor}`}>{stage.name}</span>
                                <span className="text-xs text-gray-400 font-medium">{isCompleted ? 'Completed' : (isCurrent ? stage.status : 'Pending')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{teamsIn} <span className="text-base text-primary-400 font-normal">Teams Competing</span></h3>
                            <p className="text-sm text-gray-300"><CalendarCheck size={14} className='inline mr-1 text-yellow-400'/> {stage.matchesPerWeek} matches scheduled per week.</p>
                            {isCurrent && currentStageState.schedule.length > 0 && (
                                <button onClick={() => setViewMode('overview')} className="btn-secondary btn-xs mt-3">Manage Week</button>
                            )}
                        </div>
                    );
                 })}
            </div>
            
            {renderStageView()}

            <button onClick={onBack} className="btn-secondary flex items-center"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
        </AnimatedSection>
    );
};


// ------------------------------------------------------------------------------------
// CORE COMPONENT 2: Mobile Legends Management View (Round-Robin to Bracket Demo)
// ------------------------------------------------------------------------------------

const MLBBManagementView = ({ tournament, onBack, onTournamentUpdate, openModal }) => {
    const { stages, currentStage, participantsList, stageData, teamsToPlayoffs } = tournament;
    const currentStageDetails = stages.find(s => s.id === currentStage);
    const currentStageState = stageData[currentStage];
    
    const [viewMode, setViewMode] = useState('overview'); 
    const [selectedMatch, setSelectedMatch] = useState(null); 
    const [editingMatchId, setEditingMatchId] = useState(null); 
    const allTeams = participantsList;

    // --- MLBB LEAGUE STANDINGS CALCULATION ---
    const leagueStandings = useMemo(() => {
        
        // 1. Initialize stats
        const standingsMap = allTeams.reduce((acc, team) => {
            acc[team.id] = {
                team: team,
                matchesPlayed: 0,
                wins: 0,
                losses: 0,
                points: 0,
            };
            return acc;
        }, {});
        
        // 2. Aggregate results from the current stage (Round Robin)
        stageData[1].schedule.filter(m => m.status === 'Completed').forEach(match => {
            if (match.results.length === 2) {
                const result1 = match.results.find(r => r.teamId === match.teams[0].id);
                const result2 = match.results.find(r => r.teamId === match.teams[1].id);
                
                // Assuming simple 2-0 = 3 points, 1-2 = 1 point, 0-2 = 0 points for league matches (MPL style)
                let team1Points = 0;
                let team2Points = 0;
                
                if (result1.score === 2 && result2.score === 0) { // 2-0 win
                    team1Points = 3;
                    team2Points = 0;
                } else if (result1.score === 2 && result2.score === 1) { // 2-1 win
                    team1Points = 2;
                    team2Points = 1;
                } else if (result1.score === 1 && result2.score === 2) { // 1-2 loss
                    team1Points = 1;
                    team2Points = 2;
                } else if (result1.score === 0 && result2.score === 2) { // 0-2 loss
                    team1Points = 0;
                    team2Points = 3;
                }
                
                // Update stats
                const updateStats = (teamId, points, isWin) => {
                    if (standingsMap[teamId]) {
                        standingsMap[teamId].matchesPlayed += 1;
                        standingsMap[teamId].points += points;
                        if (isWin) standingsMap[teamId].wins += 1;
                        else standingsMap[teamId].losses += 1;
                    }
                };
                
                updateStats(result1.teamId, team1Points, team1Points >= team2Points);
                updateStats(result2.teamId, team2Points, team2Points >= team1Points);
            }
        });
        
        // 3. Convert map to array and sort (Primary: Total Points, Secondary: Match Wins)
        const sortedStandings = Object.values(standingsMap).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.wins - a.wins; 
        });

        return sortedStandings;

    }, [stageData[1].schedule]);


    // --- ACTION HANDLERS (MLBB League) ---
    
    // 1. Schedule Generation (Round Robin)
    const handleGenerateLeagueSchedule = () => {
        if (currentStageState.schedule.length > 0) { openModal({ title: "Schedule Already Set", message: `Stage ${currentStage} schedule is already set.`, showCancel: false }); return; }
        
        openModal({
            title: `Confirm League Schedule Generation`,
            message: `You are about to generate a Round-Robin schedule for ${allTeams.length} teams across ${currentStageDetails.rounds} rounds.`,
            confirmText: 'Generate Schedule',
            onConfirm: () => {
                const newSchedule = generateRoundRobinSchedule(allTeams, currentStageDetails.rounds);

                const updatedStageData = { 
                    ...stageData, 
                    [currentStage]: { 
                        ...currentStageState, 
                        schedule: newSchedule,
                        status: 'Schedule Set' 
                    } 
                };
                const updatedStages = stages.map(s => s.id === currentStage ? { ...s, status: 'In Progress' } : s);
                
                onTournamentUpdate({ ...tournament, stageData: updatedStageData, stages: updatedStages });
                openModal({ title: "Schedule Complete", message: `Successfully generated ${newSchedule.length} Round Robin matches.`, showCancel: false });
                setViewMode('schedule');
            }
        });
    };

    // 2. Open Results Entry (Bo3)
    const handleOpenBoXResultsEntry = (match) => {
        // Simple Bo3 for Round Robin demo
        const initialResults = match.results.length === 2
            ? match.results
            : match.teams.map(t => ({ teamId: t.id, teamName: t.name, score: 0 }));
        
        setSelectedMatch({...match, matchResults: initialResults});
        setViewMode('resultsEntry');
    };

    // 3. Submit Results (Bo3)
    const handleSubmitBoXResults = (updatedResults) => {
        const team1Score = parseInt(updatedResults[0].score);
        const team2Score = parseInt(updatedResults[1].score);

        if (team1Score + team2Score < 2 || team1Score + team2Score > 3 || team1Score === team2Score) {
            alert("Error: Invalid Bo3 Score. Scores must sum to 2 or 3, and cannot be tied (e.g., 2-0, 2-1, 1-2, 0-2).");
            return;
        }

        const updatedSchedule = stageData[1].schedule.map(match => 
            match.id === selectedMatch.id ? { 
                ...match, 
                results: updatedResults, 
                status: 'Completed' 
            } : match
        );
        
        const updatedStageData = { 
            ...stageData, 
            [1]: { ...stageData[1], schedule: updatedSchedule } 
        };
        
        onTournamentUpdate({ ...tournament, stageData: updatedStageData });
        setViewMode('schedule');
        setSelectedMatch(null);
        openModal({ title: "Results Submitted", message: `Results for Match ${selectedMatch.id} successfully recorded and league standings updated.`, showCancel: false, confirmText: 'Got It' });
    };

    // 4. Finalize League Stage and Seed Bracket
    const handleFinalizeLeague = () => {
        const totalMatchesRequired = stageData[1].schedule.length;
        const completedMatches = stageData[1].schedule.filter(m => m.status === 'Completed').length;
        
        if (completedMatches < totalMatchesRequired) {
             openModal({ title: "League Stage Incomplete", message: `Only ${completedMatches} of ${totalMatchesRequired} matches have results submitted. Please complete all matches before advancing to Playoffs.`, showCancel: false });
            return;
        }

        const advancingTeams = leagueStandings.slice(0, teamsToPlayoffs);
        
        // Simple seeding (1st vs 8th, 2nd vs 7th, 3rd vs 6th, 4th vs 5th)
        const generateBracket = (teams) => {
            const matches = [];
            for(let i = 0; i < teams.length / 2; i++) {
                matches.push({
                    id: `QF${i+1}`,
                    round: 1,
                    format: 'Bo3',
                    teams: [
                        { id: teams[i].team.id, name: teams[i].team.name, score: null, seed: i + 1 },
                        { id: teams[teams.length - 1 - i].team.id, name: teams[teams.length - 1 - i].team.name, score: null, seed: teams.length - i },
                    ],
                    status: 'Scheduled',
                    winnerId: null,
                });
            }
            return matches;
        }

        openModal({
            title: `Confirm League Finalization`,
            message: `The top ${teamsToPlayoffs} teams will now advance and be seeded into the Playoff Bracket.`,
            confirmText: 'Seed Bracket',
            onConfirm: () => {
                const initialBracket = generateBracket(advancingTeams);
                
                const updatedStageData = { 
                    ...stageData, 
                    [1]: { ...stageData[1], teamsAdvanced: advancingTeams, status: 'Completed' },
                    [2]: { bracket: initialBracket, teamsSeeded: advancingTeams, status: 'Ready' }
                };
                
                const updatedStages = stages.map(s => {
                    if (s.id === 1) return { ...s, status: 'Completed' };
                    if (s.id === 2) return { ...s, status: 'In Progress' };
                    return s;
                });
                
                onTournamentUpdate({ ...tournament, stageData: updatedStageData, stages: updatedStages, currentStage: 2 });
                openModal({ title: "Bracket Seeded", message: `The Playoff Bracket has been successfully seeded with ${teamsToPlayoffs} teams.`, showCancel: false });
                setViewMode('overview'); 
            }
        });
    };

    // --- UI Components (MLBB) ---

    // 1. League Schedule & Results
    const LeagueScheduleView = () => {
        const schedule = stageData[1].schedule;
        const totalMatches = schedule.length;
        const completedMatches = schedule.filter(m => m.status === 'Completed').length;

        return (
            <div className="space-y-6">
                <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                    <h3 className="text-xl font-bold text-white flex items-center"><Calendar size={20} className='mr-2 text-primary-400'/> Round-Robin Matches</h3>
                    <div className="text-sm text-gray-300">
                        Progress: <span className='font-bold text-primary-400'>{completedMatches}</span> / {totalMatches} Matches Completed
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {schedule.map(match => (
                        <div key={match.id} className={`bg-dark-700/50 p-4 rounded-lg border ${match.status === 'Completed' ? 'border-green-600/50' : 'border-dark-600'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-lg font-semibold text-white">Round {match.round}: {match.teams[0].name} vs {match.teams[1].name}</span>
                                    <p className="text-xs text-gray-400 mt-1">Format: Bo3</p>
                                    <p className="text-sm font-medium text-primary-400 flex items-center mt-1">
                                        <Clock size={14} className='mr-1'/> {new Date(match.dateTime).toLocaleDateString()}
                                    </p>
                                    {match.status === 'Completed' && (
                                        <p className='text-sm font-bold text-green-400 mt-1'>Result: {match.results[0].score} - {match.results[1].score}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
                                        {match.status}
                                    </span>
                                    <button 
                                        onClick={() => handleOpenBoXResultsEntry(match)}
                                        className="btn-primary btn-xs mt-2 flex items-center ml-auto"
                                    >
                                        <ListChecks size={14} className='mr-1'/> {match.status === 'Completed' ? 'View/Edit Result (Bo3)' : 'Enter Result (Bo3)'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button onClick={() => setViewMode('standings')} className="btn-secondary flex items-center"> <BarChart2 size={16} className="mr-2" /> View League Standings </button>
            </div>
        );
    };

    // 2. MLBB BoX Results Entry (Custom)
    const BoXResultsEntry = () => {
        const [results, setResults] = useState(selectedMatch?.matchResults || []);
        
        const handleScoreChange = (teamId, score) => {
            setResults(prev => prev.map(r => 
                r.teamId === teamId ? { ...r, score: parseInt(score) } : r
            ));
        };
        
        return (
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full max-w-lg border border-dark-600 relative`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-xl font-semibold text-white flex items-center"><Trophy className='mr-2 size-5'/> Enter Bo3 Match Results</h3>
                    <button onClick={() => setViewMode('schedule')} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-400 font-bold text-yellow-400">
                        Enter final game scores for a Best-of-3 series. (e.g., 2-0 or 2-1).
                    </p>
                    <div className="flex justify-between items-center bg-dark-700 p-3 rounded-lg">
                        <span className="font-semibold text-white w-1/3">{results[0].teamName}</span>
                        <input
                            type="number" min="0" max="2"
                            value={results[0].score}
                            onChange={(e) => handleScoreChange(results[0].teamId, e.target.value)}
                            className="input-field input-field-sm w-16 text-center text-lg font-bold"
                        />
                    </div>
                    <div className="flex justify-between items-center bg-dark-700 p-3 rounded-lg">
                        <span className="font-semibold text-white w-1/3">{results[1].teamName}</span>
                        <input
                            type="number" min="0" max="2"
                            value={results[1].score}
                            onChange={(e) => handleScoreChange(results[1].teamId, e.target.value)}
                            className="input-field input-field-sm w-16 text-center text-lg font-bold"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    <button onClick={() => setViewMode('schedule')} className="btn-secondary text-sm">Cancel</button>
                    <button onClick={() => handleSubmitBoXResults(results)} className="btn-primary text-sm flex items-center">
                        <Save size={14} className="mr-1"/> Save Match Result
                    </button>
                </div>
            </div>
        );
    };


    // 3. League Standings View
    const LeagueStandingsView = () => (
        <div className="space-y-6">
            <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                <h3 className="text-xl font-bold text-white flex items-center"><BarChart2 size={20} className='mr-2 text-green-400'/> AML League Standings</h3>
                <button onClick={() => setViewMode('schedule')} className="btn-secondary btn-xs flex items-center"> <Calendar size={16} className="mr-1" /> View Schedule </button>
            </div>

            <div className='bg-dark-700 rounded-lg shadow-xl border border-dark-600'>
                <h4 className='text-lg font-bold text-white p-3 border-b border-dark-600 bg-dark-600/50'>League Table ({allTeams.length} Teams)</h4>
                <div className='overflow-x-auto'>
                    <table className="min-w-full divide-y divide-dark-700">
                        <thead className="bg-dark-600/70">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Played</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-green-400 uppercase tracking-wider">WINS</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-red-400 uppercase tracking-wider">LOSSES</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">POINTS</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                            {leagueStandings.map((stat, index) => {
                                const isAdvancing = index < teamsToPlayoffs;
                                return (
                                    <tr key={stat.team.id} className={`transition-colors ${isAdvancing ? 'bg-green-900/20 hover:bg-green-900/30 border-l-4 border-green-500' : 'hover:bg-dark-700'}`}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{stat.team.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{stat.matchesPlayed}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-green-300">{stat.wins}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-red-300">{stat.losses}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-extrabold text-primary-300">{stat.points}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold">
                                            {isAdvancing && <span className='text-green-500 flex items-center justify-center'><TrendingUp size={14} className='mr-1'/> Advancing</span>}
                                            {!isAdvancing && <span className='text-gray-500'>Eliminated</span>}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="flex justify-between items-center border-t border-dark-700 pt-4">
                 <button onClick={handleFinalizeLeague} className="btn-primary flex items-center" disabled={stageData[1].schedule.filter(m => m.status !== 'Completed').length > 0}>
                    <Send size={16} className="mr-2" /> FINALIZE LEAGUE & SEED BRACKET
                </button>
            </div>
        </div>
    );
    
    // --- Bracket Management Functions and View (Simplified for Demo) ---
    const handleNextBracketRound = () => {
        // This is a DEMO of the Single Elimination advancement logic.
        const currentBracket = stageData[2].bracket;
        const round = currentBracket[0].round;
        const completedMatches = currentBracket.filter(m => m.winnerId !== null).length;
        
        if (completedMatches !== currentBracket.length) {
            openModal({ title: "Round Incomplete", message: `Please complete all ${currentBracket.length} matches in Round ${round} before proceeding to the next round.`, showCancel: false });
            return;
        }

        const winners = currentBracket.map(m => stageData[2].teamsSeeded.find(t => t.team.id === m.winnerId));
        
        if (winners.length === 1) {
            openModal({ title: "Tournament Complete", message: `The champion is: ${winners[0].team.name}!`, showCancel: false, confirmText: 'Celebrate!' });
            onTournamentUpdate({ ...tournament, currentStage: 3, status: 'Completed' });
            return;
        }
        
        // Generate next round matches (halving the number of matches)
        const newBracket = [];
        const nextRound = round + 1;
        const format = nextRound === 2 ? 'Bo5' : 'Bo7';

        for(let i = 0; i < winners.length / 2; i++) {
            newBracket.push({
                id: `R${nextRound}_M${i+1}`,
                round: nextRound,
                format: format,
                teams: [
                    { id: winners[i * 2].team.id, name: winners[i * 2].team.name, score: null, seed: winners[i * 2].seed },
                    { id: winners[i * 2 + 1].team.id, name: winners[i * 2 + 1].team.name, score: null, seed: winners[i * 2 + 1].seed },
                ],
                status: 'Scheduled',
                winnerId: null,
            });
        }
        
        const updatedStageData = { ...stageData, [2]: { ...stageData[2], bracket: newBracket, status: `Round ${nextRound} Scheduled` } };
        onTournamentUpdate({ ...tournament, stageData: updatedStageData });
        openModal({ title: "Round Advanced", message: `Round ${nextRound} (${format}) has been successfully generated.`, showCancel: false });
    };

    const handleEnterBracketMatchResult = (match) => {
        openModal({
            title: `Enter Result: ${match.id} (${match.format})`,
            message: `Enter the winning team for this **${match.format}** match.`,
            large: true,
            customBody: (
                <div className='p-6 space-y-4'>
                    <div className='bg-dark-700 p-4 rounded-lg flex justify-between'>
                        <button 
                            onClick={() => handleSaveBracketResult(match.id, match.teams[0].id)}
                            className='btn-primary w-5/12 text-center text-lg'
                        >
                            Winner: {match.teams[0].name}
                        </button>
                        <span className='text-3xl font-extrabold text-white'>VS</span>
                        <button 
                            onClick={() => handleSaveBracketResult(match.id, match.teams[1].id)}
                            className='btn-primary w-5/12 text-center text-lg'
                        >
                            Winner: {match.teams[1].name}
                        </button>
                    </div>
                </div>
            )
        });
    };

    const handleSaveBracketResult = (matchId, winnerId) => {
        const updatedBracket = stageData[2].bracket.map(match => 
            match.id === matchId ? { ...match, winnerId, status: 'Completed' } : match
        );

        const updatedStageData = { ...stageData, [2]: { ...stageData[2], bracket: updatedBracket } };
        onTournamentUpdate({ ...tournament, stageData: updatedStageData });
        closeModal();
    };


    const BracketView = () => {
        const bracket = stageData[2].bracket;
        if (bracket.length === 0) return (<div className='text-center text-gray-500 py-8'>Bracket is empty. Finalize the League Stage to seed the bracket.</div>);

        const currentRound = bracket[0]?.round || 1;
        const totalMatches = bracket.length;
        const completedMatches = bracket.filter(m => m.winnerId !== null).length;
        const isFinals = bracket.length === 1;

        return (
            <div className='space-y-6'>
                <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                    <h3 className="text-xl font-bold text-white flex items-center"><Trophy size={20} className='mr-2 text-yellow-400'/> Playoff Bracket - Round {currentRound}</h3>
                    <div className="text-sm text-gray-300">
                        Matches: <span className='font-bold text-yellow-400'>{completedMatches}</span> / {totalMatches} Completed
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bracket.map(match => (
                        <div key={match.id} className={`bg-dark-700/50 p-4 rounded-lg border ${match.status === 'Completed' ? 'border-green-600/50' : 'border-dark-600'}`}>
                            <div className="text-xs font-bold text-gray-500 mb-2">{match.id} | {match.format}</div>
                            <div className='space-y-2'>
                                <div className={`p-2 rounded ${match.winnerId === match.teams[0].id ? 'bg-green-800/50 text-white' : 'bg-dark-600/50 text-gray-300'}`}>
                                    Seed {match.teams[0].seed}: **{match.teams[0].name}**
                                </div>
                                <div className={`p-2 rounded ${match.winnerId === match.teams[1].id ? 'bg-green-800/50 text-white' : 'bg-dark-600/50 text-gray-300'}`}>
                                    Seed {match.teams[1].seed}: **{match.teams[1].name}**
                                </div>
                            </div>
                            <div className="flex justify-end mt-3">
                                <button 
                                    onClick={() => handleEnterBracketMatchResult(match)}
                                    className="btn-primary btn-xs flex items-center"
                                >
                                    <ListChecks size={14} className='mr-1'/> {match.status === 'Completed' ? 'Edit Winner' : 'Select Winner'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-center border-t border-dark-700 pt-4">
                    <button onClick={handleNextBracketRound} className="btn-primary flex items-center text-lg">
                        <Send size={18} className="mr-2" /> {isFinals ? 'FINALIZE TOURNAMENT' : `PROCEED TO ROUND ${currentRound + 1}`}
                    </button>
                </div>
            </div>
        );
    };


    // --- Main MLBB Renderer ---

    const renderMLBBView = () => {
        if (currentStage === 1) { // Round Robin Stage
            if (stageData[1].schedule.length === 0) {
                return (
                    <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                        <div className="flex items-center text-lg font-bold"><CalendarCheck size={20} className="mr-2"/> Status: League Schedule Pending</div>
                        <p>The **{allTeams.length} teams** are registered. Generate the **Round Robin** schedule to begin the League stage.</p>
                        <button onClick={handleGenerateLeagueSchedule} className="btn-primary flex items-center">
                            <CalendarCheck size={16} className="mr-2" /> Generate League Schedule
                        </button>
                    </div>
                );
            }
            
            switch (viewMode) {
                case 'schedule':
                    return <LeagueScheduleView />;
                case 'standings':
                    return <LeagueStandingsView />;
                case 'resultsEntry':
                    return <BoXResultsEntry />;
                case 'overview':
                default:
                    return (
                        <div className='space-y-6'>
                             <div className='bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-300'>
                                <h3 className="font-bold mb-2 flex items-center"><Info size={16} className='mr-2'/> League Stage Management Menu</h3>
                                <p>League matches are scheduled. Enter match results to update the league standings table and determine the Top {teamsToPlayoffs} for Playoffs.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setViewMode('schedule')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                    <CalendarCheck size={20} className='mr-2 text-primary-400'/> Manage League Matches (Bo3)
                                </button>
                                <button onClick={() => setViewMode('standings')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                    <BarChart2 size={20} className='mr-2 text-primary-400'/> View League Standings
                                </button>
                            </div>
                        </div>
                    );
            }
        } else if (currentStage === 2) { // Playoff Bracket Stage
            
            if (stageData[2].bracket.length === 0 && stageData[1].status === 'Completed') {
                return (
                    <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                        <div className="flex items-center text-lg font-bold"><Trophy size={20} className="mr-2"/> Status: Playoff Bracket Pending</div>
                        <p>The **League Stage is Complete**. Click below to seed the Top {teamsToPlayoffs} into the Playoff Bracket.</p>
                        <button onClick={handleFinalizeLeague} className="btn-primary flex items-center">
                            <Shuffle size={16} className="mr-2" /> Seed Bracket Now
                        </button>
                    </div>
                );
            }

            return (
                <div className='space-y-6'>
                    <div className='bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-300'>
                        <h3 className="font-bold mb-2 flex items-center"><Info size={16} className='mr-2'/> Playoff Bracket Management</h3>
                        <p>Manage the Single-Elimination Knockout matches (Quarters: Bo3, Semis: Bo5, Finals: Bo7) until a winner is determined.</p>
                    </div>
                    <BracketView />
                </div>
            );
        }
        
        if (currentStage > 2) {
             return (
                <div className='bg-green-900/30 border border-green-700/50 rounded-lg p-4 text-sm text-green-300 space-y-4'>
                    <div className="flex items-center text-lg font-bold"><CheckCircle size={20} className="mr-2"/> Tournament Completed!</div>
                    <p>The AML Season is complete. Final Champion determined.</p>
                </div>
            );
        }
    };


    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-bold text-primary-300 flex items-center border-b border-dark-700 pb-3">
                <Swords className="mr-3" size={24}/> Mobile Legends League Management: {tournament.name}
            </h2>
            
            <p className="text-gray-400">
                Current Stage: <span className='font-bold text-primary-400'>{currentStageDetails?.name || 'Tournament Completed'}</span>. Total Teams: **{allTeams.length}** | **Round Robin $\rightarrow$ Single Elimination**
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {stages.map((stage) => {
                    const isCurrent = stage.id === currentStage;
                    const isCompleted = stageData[stage.id]?.status === 'Completed';
                    const statusColor = isCompleted ? 'bg-green-600' : isCurrent ? 'bg-primary-600' : 'bg-dark-600';
                    
                    return (
                        <div key={stage.id} className={`p-4 rounded-lg shadow-lg border-2 col-span-2 ${isCurrent ? 'border-primary-500 bg-dark-700' : isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-dark-600 bg-dark-700/50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm font-semibold text-white px-2 py-0.5 rounded ${statusColor}`}>{stage.name}</span>
                                <span className="text-xs text-gray-400 font-medium">{isCompleted ? 'Completed' : (isCurrent ? 'In Progress' : 'Pending')}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{stage.type} <span className="text-base text-primary-400 font-normal">Format</span></h3>
                            <p className="text-sm text-gray-300"><Target size={14} className='inline mr-1 text-yellow-400'/> {stage.advancementRule || `${stage.rounds} Rounds`}</p>
                            {isCurrent && (
                                <button onClick={() => setViewMode('overview')} className="btn-secondary btn-xs mt-3">Manage Stage</button>
                            )}
                        </div>
                    );
                 })}
            </div>
            
            {renderMLBBView()}

            <button onClick={onBack} className="btn-secondary flex items-center"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
        </AnimatedSection>
    );
};


// ------------------------------------------------------------------------------------
// Main Tournament Page (Wrapper)
// ------------------------------------------------------------------------------------

export default function UpdateTournamentPage() {
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('list');
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    useEffect(() => { 
        setLoading(true); 
        setTimeout(() => { 
            // Deep clone to prevent direct state mutation issues when nested objects are updated
            setTournaments(JSON.parse(JSON.stringify(initialTournamentsData))); 
            setLoading(false); 
        }, 500); 
    }, []);

    const openModal = (content) => { setModalContent(content); setIsModalOpen(true); };
    const closeModal = () => setIsModalOpen(false);
    
    const handleTournamentUpdate = (updatedTournament) => {
        setTournaments(prev => prev.map(t =>
            t.id === updatedTournament.id ? updatedTournament : t
        ));
        setSelectedTournament(updatedTournament);
    };

    const handleDelete = (id, name) => {
        openModal({
            title: "Confirm Deletion",
            message: `Are you sure you want to delete the tournament: "${name}"? This cannot be undone.`,
            confirmText: "Delete",
            onConfirm: () => {
                setTournaments(prev => prev.filter(t => t.id !== id));
                openModal({ title: "Deleted", message: `Tournament "${name}" has been successfully deleted. (Simulated)`, showCancel: false });
            }
        });
    };

    const handleBackToList = () => { setSelectedTournament(null); setCurrentView('list'); };
    const handleSelectTournament = (view, tournament) => { setSelectedTournament(tournament); setCurrentView(view); };
    
    const renderView = () => {
        if (!selectedTournament) return null;
        
        if (selectedTournament.format === 'multi-stage-br' || selectedTournament.id === 1) { 
            // Free Fire (ID 1) and Farlight 84 (ID 2) both use the BR Management View
            return <BRStageManagementView tournament={selectedTournament} onBack={handleBackToList} onTournamentUpdate={handleTournamentUpdate} openModal={openModal} />;
        }
        
        if (selectedTournament.format === 'round-robin-to-bracket') {
            // Mobile Legends (ID 3) uses the new Round Robin Management View
            return <MLBBManagementView tournament={selectedTournament} onBack={handleBackToList} onTournamentUpdate={handleTournamentUpdate} openModal={openModal} />;
        }
        
        return (
             <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-primary-300">Management for: {selectedTournament.name}</h2>
                <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-sm text-yellow-300 flex items-center'>
                    <AlertTriangle size={18} className="mr-2"/> Management views for **{selectedTournament.format.toUpperCase()}** format are currently under development.
                </div>
                <button onClick={handleBackToList} className="btn-secondary flex items-center mt-6"> <ArrowLeft size={16} className="mr-2" /> Back to List </button>
             </AnimatedSection>
        );
    }

    if (loading) { return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div></div> ); }

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 mb-2 flex items-center justify-center"> <Settings className="w-8 h-8 mr-3" /> Tournament Management (3-System Demo)</h1>
                    <p className="text-center text-gray-400"> Oversee tournaments, manage participants, schedules, and results. </p>
                </AnimatedSection>

                {currentView === 'list' ? (
                    <AnimatedSection delay={100} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Your Tournaments ({tournaments.length})</h2>
                        {tournaments.length > 0 ? (
                            <div className="space-y-6">
                                {tournaments.map((t, index) => {
                                    const isFL84 = t.id === 2;
                                    const isMLBB = t.id === 3;
                                    const formatText = isFL84 ? `Farlight 84 League (Demo)` : isMLBB ? 'MLBB League (Demo)' : 'Free Fire/COD (Demo)';
                                    const formatColor = isFL84 ? 'text-orange-400' : isMLBB ? 'text-green-400' : 'text-primary-400';

                                    return ( 
                                        <AnimatedSection key={t.id} delay={150 + index * 100} className="bg-dark-700/50 rounded-lg p-4 border border-dark-600 hover:border-primary-500/30 transition-colors duration-200"> 
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4"> 
                                                <div className="flex-grow"> 
                                                    <h3 className="text-xl font-semibold text-white mb-1">{t.name}</h3> 
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400"> 
                                                        <span>Game: <span className="text-white">{t.game}</span></span> 
                                                        <span>Format: <span className={`font-bold ${formatColor}`}>{formatText}</span></span>
                                                        <span>Status: <span className="font-medium">{t.status}</span></span> 
                                                        <span>Players: {t.participants}/{t.maxParticipants}</span> 
                                                    </div> 
                                                </div> 
                                                <div className="flex flex-wrap gap-2 flex-shrink-0"> 
                                                    <button onClick={() => handleSelectTournament('stages', t)} className="btn-primary btn-xs flex items-center" title="Manage Weeks/Stages"><TrendingUp size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Manage Stages</span></button>
                                                    <button onClick={() => handleDelete(t.id, t.name)} className="bg-red-600/20 hover:bg-red-500/30 text-red-400 font-bold py-1 px-2 rounded transition-colors text-xs flex items-center" title="Delete Tournament"><Trash2 size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Delete</span></button> 
                                                </div> 
                                            </div> 
                                        </AnimatedSection> 
                                    ); 
                                })} 
                            </div>
                        ) : ( <p className="text-gray-500 text-center py-6">You haven't created any tournaments yet.</p> )}
                        <div className="text-center mt-8 border-t border-dark-700 pt-6"> <Link to="/create-tournament" className="btn-primary"> Create New Tournament </Link> </div>
                    </AnimatedSection>
                ) : renderView()}

                {/* Modal for all views */}
                <CustomModal
                    isOpen={isModalOpen} onClose={closeModal} title={modalContent.title}
                    promptLabel={modalContent.promptLabel} onPromptSubmit={modalContent.onPromptSubmit}
                    onConfirm={modalContent.onConfirm} confirmText={modalContent.confirmText}
                    showCancel={modalContent.showCancel} customBody={modalContent.customBody} large={modalContent.large}
                >
                    {modalContent.message} {modalContent.children}
                </CustomModal>

            </div>
            {/* Styles (Keep the same) */}
            <style jsx global>{`
                /* Global styles for dark theme look and feel */
                .bg-dark-900 { background-color: #0d1117; }
                .bg-dark-800 { background-color: #161b22; }
                .bg-dark-700 { background-color: #21262d; }
                .bg-dark-700\\/50 { background-color: rgba(33, 38, 45, 0.5); }
                .bg-dark-600 { background-color: #30363d; }
                .border-dark-700 { border-color: #30363d; }
                .border-dark-600 { border-color: #444c56; }
                .text-primary-400 { color: #58a6ff; }
                .text-primary-300 { color: #79c0ff; }
                .text-primary-500 { color: #007bff; }
                .input-field {
                    background-color: #0d1117;
                    border: 1px solid #30363d;
                    color: #c9d1d9;
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    transition: border-color 0.2s;
                }
                .input-field:focus {
                    border-color: #58a6ff;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
                }
                .input-field-sm {
                    padding: 0.3rem 0.6rem;
                    font-size: 0.8rem;
                }
                .btn-primary {
                    background-color: #238636;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #2ea043;
                }
                .btn-secondary {
                    background-color: #21262d;
                    color: #c9d1d9;
                    border: 1px solid #30363d;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: background-color 0.2s, border-color 0.2s;
                }
                .btn-secondary:hover {
                    background-color: #30363d;
                    border-color: #444c56;
                }
                .btn-xs {
                    padding: 0.3rem 0.6rem;
                    font-size: 0.75rem;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}