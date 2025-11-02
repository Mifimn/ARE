// src/pages/UpdateTournamentPage.jsx (Full Supabase Integration)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Settings, Trash2, Edit3, ListChecks, Shuffle, CalendarCheck, Eye, ArrowLeft, Users, AlertTriangle, Save,
    X, HelpCircle, Info, TrendingUp, Zap, Upload, CheckCircle, Target, Trophy, Swords, Send, BarChart2, Calendar, Clock, Edit, Loader2
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; // --- IMPORT SUPABASE ---
import { useAuth } from '../contexts/AuthContext'; // --- IMPORT AUTH ---

// --- SCORING ENGINE (BR - Free Fire Standard) ---
const calculatePlacementPoints = (placement) => {
    if (placement < 1 || placement > 12) return 0;
    return 39 - (3 * (placement - 1)); 
};
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// --- HELPER: Round Robin Schedule Generator ---
const generateRoundRobinSchedule = (teams, totalWeeks) => {
    if (teams.length < 2) return [];
    const N = teams.length;
    const isOdd = N % 2 !== 0;
    const teamsToSchedule = isOdd ? [...teams, { id: 'BYE', name: 'BYE', isBye: true }] : teams;
    const numTeams = teamsToSchedule.length;
    const rounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;
    const schedule = [];

    const pivot = teamsToSchedule[0]; 
    let rotatingTeams = teamsToSchedule.slice(1); 
    let matchCounter = 1;

    for (let round = 1; round <= rounds; round++) {
        if (round > totalWeeks) break;
        for (let i = 0; i < matchesPerRound; i++) {
            const team1 = i === 0 ? pivot : rotatingTeams[i - 1];
            const team2 = rotatingTeams[numTeams - 2 - i];
            if (team1.isBye || team2.isBye) continue; 

            schedule.push({
                matchNumber: matchCounter - 1,
                round: round,
                team1_id: team1.id, // Use participant_id
                team2_id: team2.id, // Use participant_id
            });
            matchCounter++;
        }
        if (rotatingTeams.length > 0) {
            const lastTeam = rotatingTeams.pop();
            rotatingTeams.unshift(lastTeam);
        }
    }
    return schedule;
};


// --- HELPER: Custom Modal ---
const CustomModal = ({ isOpen, onClose, title, children, promptLabel, onPromptSubmit, showCancel = true, confirmText = 'OK', onConfirm, customBody, large = false, isLoading = false }) => {
    const [inputValue, setInputValue] = useState('');
    useEffect(() => { if (isOpen) setInputValue(''); }, [isOpen, promptLabel]);
    if (!isOpen) return null;
    const isPrompt = !!promptLabel;

    const handleConfirm = () => {
        if (isPrompt && onPromptSubmit) onPromptSubmit(inputValue);
        else if (onConfirm) onConfirm();
        // Let the onConfirm handler close the modal
    };

    const Icon = isPrompt ? HelpCircle : (title && title.toLowerCase().includes('error')) ? AlertCircle : Info;
    const iconColor = (title && title.toLowerCase().includes('error')) ? 'text-red-400' : 'text-primary-400';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !isLoading && onClose()}>
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full ${large ? 'max-w-4xl' : 'max-w-md'} border border-dark-600 relative animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${iconColor}`} /> <h3 className="text-lg font-semibold text-white">{title || (isPrompt ? 'Input Required' : 'Alert')}</h3> </div>
                    <button onClick={() => !isLoading && onClose()} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors disabled:opacity-50" disabled={isLoading}> <X size={20} /> </button>
                </div>
                {customBody ? customBody : (
                    <div className="p-6 space-y-4">
                        {children && <div className="text-gray-300 text-sm">{children}</div>}
                        {isPrompt && ( <div> <label htmlFor="promptInput" className="block text-sm font-medium text-gray-300 mb-2">{promptLabel}</label> <input id="promptInput" type="number" min="2" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input-field w-full" autoFocus /> </div> )}
                    </div>
                )}
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    {showCancel && (<button onClick={() => !isLoading && onClose()} className="btn-secondary text-sm disabled:opacity-50" disabled={isLoading}>Cancel</button>)}
                    <button onClick={handleConfirm} className="btn-primary text-sm flex items-center justify-center disabled:opacity-50" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                        {isPrompt ? 'Submit' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- NEW RE-USABLE COMPONENT: Participant List ---
const ParticipantList = ({ participants, maxParticipants }) => (
    <div className="card bg-dark-700/50 p-6 rounded-xl shadow-lg border border-dark-600">
        <h3 className="text-xl font-bold text-primary-300 mb-4 flex items-center justify-between">
            <span>
                <Users className="mr-2 inline" size={20} />
                Registered Teams
            </span>
            <span className="text-lg font-bold text-white">
                {participants.length} / {maxParticipants}
            </span>
        </h3>
        {participants.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                {participants.map(team => (
                    <Link 
                        to={`/team/${team.team_id}`} // <-- Links to team page
                        key={team.id} 
                        className="flex items-center bg-dark-800 p-3 rounded-lg hover:bg-dark-700 hover:border-primary-500/50 border border-dark-600 transition-all"
                        target="_blank" // Open in new tab
                    >
                        <img 
                            src={team.team_logo_url || `https://via.placeholder.com/30x30/FFA500/000000?text=${team.team_name.charAt(0)}`} 
                            alt={team.team_name}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                        <span className="text-white font-medium truncate">{team.team_name}</span>
                        <Eye className="w-4 h-4 text-gray-500 ml-auto" />
                    </Link>
                ))}
            </div>
        ) : (
            <p className="text-gray-500 text-center py-4">No teams have joined this tournament yet.</p>
        )}
    </div>
);


// ------------------------------------------------------------------------------------
// FORMAT 1: Grouped BR Stage Management (Free Fire Demo)
// ------------------------------------------------------------------------------------
const GroupedBRStageView = ({ tournament, participants, matches, results, onDataUpdate, openModal, setModalLoading }) => {
    const { stages, current_stage } = tournament;
    const currentStageDetails = stages.find(s => s.id === current_stage);

    const [viewMode, setViewMode] = useState('overview'); 
    const [selectedMatch, setSelectedMatch] = useState(null); 
    const [editingMatchId, setEditingMatchId] = useState(null); 

    const teamsForThisStage = current_stage === 1 
        ? participants 
        : participants.filter(p => p.status === `adv_stage_${current_stage}`);

    const groupNames = useMemo(() => {
        return [...new Set(teamsForThisStage.map(t => t.current_group))].filter(g => g !== null).sort();
    }, [teamsForThisStage]);

    const matchesForThisStage = useMemo(() => {
        return matches.filter(m => m.stage_id === current_stage);
    }, [matches, current_stage]);

    // --- LIVE STANDINGS CALCULATION (Per Group) ---
    const groupedStandings = useMemo(() => {
        if (participants.length === 0) return {};
        const standings = {};
        teamsForThisStage.forEach(team => {
            const groupName = team.current_group;
            if (!groupName) return; 
            if (!standings[groupName]) { standings[groupName] = []; }
            standings[groupName].push({
                team: team, mapsPlayed: 0, placementPoints: 0, killPoints: 0, totalPoints: 0, wins: 0,
            });
        });
        results.forEach(result => {
            const teamStat = Object.values(standings).flat().find(s => s.team.id === result.participant_id);
            if (teamStat) {
                const groupName = teamStat.team.current_group;
                const stats = standings[groupName].find(s => s.team.id === result.participant_id);
                if (stats) {
                    stats.mapsPlayed += 1;
                    const pPoints = calculatePlacementPoints(result.placement);
                    const kPoints = calculateKillPoints(result.kills);
                    const tPoints = pPoints + kPoints;
                    stats.placementPoints += pPoints;
                    stats.killPoints += kPoints;
                    stats.totalPoints += tPoints;
                    if (result.placement === 1) stats.wins += 1;
                }
            }
        });
        Object.keys(standings).forEach(groupName => {
            standings[groupName].sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                if (b.killPoints !== a.killPoints) return b.killPoints - a.killPoints;
                return b.wins - a.wins;
            });
        });
        return standings;
    }, [results, teamsForThisStage, participants.length]);

    // --- ACTION HANDLERS (DATABASE) ---

    // 1. Grouping
    const handleGroupDraw = () => {
        if (groupNames.length > 0) {
            openModal({ title: "Groups Already Set", message: `Stage ${current_stage} groups are already set.`, showCancel: false }); return;
        }
        if (teamsForThisStage.length < currentStageDetails.totalTeams) {
            openModal({ title: "Missing Teams", message: `Cannot start stage. Only ${teamsForThisStage.length} teams available, need ${currentStageDetails.totalTeams}.`, showCancel: false }); return;
        }

        openModal({
            title: `Confirm Group Draw for ${currentStageDetails.name}`,
            message: `This will split ${teamsForThisStage.length} teams into ${currentStageDetails.groups} groups and generate ${currentStageDetails.matchesPerGroup * currentStageDetails.groups} matches. This cannot be undone.`,
            confirmText: 'Execute Draw & Create Schedule',
            onConfirm: async () => {
                setModalLoading(true);
                const shuffledTeams = [...teamsForThisStage].sort(() => 0.5 - Math.random());
                const participantsToUpdate = [];
                const matchParticipantsToInsert = [];

                // Assign groups and create matches
                for (let gIndex = 0; gIndex < currentStageDetails.groups; gIndex++) {
                    const groupName = `Group ${String.fromCharCode(65 + gIndex)}`;
                    const groupTeams = shuffledTeams.slice(gIndex * currentStageDetails.groupSize, (gIndex + 1) * currentStageDetails.groupSize);

                    groupTeams.forEach(team => {
                        participantsToUpdate.push({ id: team.id, current_group: groupName });
                    });

                    for (let mIndex = 0; mIndex < currentStageDetails.matchesPerGroup; mIndex++) {
                        const newMatch = {
                            tournament_id: tournament.id,
                            stage_id: current_stage,
                            group_name: groupName,
                            match_number: mIndex + 1,
                            status: 'Scheduled',
                            scheduled_time: new Date(Date.now() + 24*60*60*1000).toISOString()
                        };

                        const { data: matchData, error: matchError } = await supabase.from('tournament_matches').insert(newMatch).select('id').single();
                        if (matchError) throw matchError;

                        groupTeams.forEach(team => {
                            matchParticipantsToInsert.push({
                                match_id: matchData.id,
                                participant_id: team.id
                            });
                        });
                    }
                }

                const { error: updateError } = await supabase.from('tournament_participants').upsert(participantsToUpdate);
                if (updateError) throw updateError;

                const { error: matchPartError } = await supabase.from('match_participants').insert(matchParticipantsToInsert);
                if (matchPartError) throw matchPartError;

                await onDataUpdate(); 
                setModalLoading(false);
                openModal({ title: "Draw & Schedule Complete", message: `Teams successfully drawn and matches scheduled.`, showCancel: false, onClose: () => setViewMode('schedule') });
            }
        });
    };

    // 2. Schedule Editing
    const handleUpdateSchedule = async (matchId, newDateTime) => {
        const { error } = await supabase.from('tournament_matches').update({ scheduled_time: newDateTime, status: 'Scheduled' }).eq('id', matchId);
        if (error) openModal({ title: 'Error', message: error.message, showCancel: false });
        else await onDataUpdate('matches'); 
        setEditingMatchId(null);
    };

    // 3. Open Results Entry
    const handleOpenResultsEntry = (match) => {
        const matchParticipants = teamsForThisStage.filter(p => p.current_group === match.group_name);
        const existingResults = results.filter(r => r.match_id === match.id);

        const initialResults = matchParticipants.map(p => {
            const existing = existingResults.find(r => r.participant_id === p.id);
            return { participant_id: p.id, teamName: p.team_name, placement: existing?.placement || null, kills: existing?.kills || 0 };
        });

        setSelectedMatch({...match, matchResults: initialResults});
        setViewMode('resultsEntry');
    };

    // 4. Submit Results
    const handleSubmitResults = (updatedResults) => {
        const placements = updatedResults.map(r => r.placement).filter(p => p !== null && p > 0);
        const uniquePlacements = new Set(placements);
        if (placements.length !== uniquePlacements.size || placements.length !== selectedMatch.matchResults.length) {
            openModal({ title: "Validation Error", message: `Duplicate or missing placements. All ${selectedMatch.matchResults.length} teams must have a unique placement number.`, showCancel: false });
            return;
        }

        openModal({
            title: 'Confirm Results',
            message: `Are you sure you want to submit these results for ${selectedMatch.id}?`,
            confirmText: 'Submit',
            onConfirm: async () => {
                setModalLoading(true);

                const resultsToInsert = updatedResults.map(r => {
                    const pPoints = calculatePlacementPoints(r.placement);
                    const kPoints = calculateKillPoints(r.kills);
                    return {
                        match_id: selectedMatch.id,
                        participant_id: r.participant_id,
                        placement: parseInt(r.placement),
                        kills: parseInt(r.kills),
                        total_points: pPoints + kPoints
                    };
                });

                const { error: resultsError } = await supabase.from('match_results').upsert(resultsToInsert, { onConflict: 'match_id, participant_id' });
                if (resultsError) throw resultsError;
                const { error: matchError } = await supabase.from('tournament_matches').update({ status: 'Completed' }).eq('id', selectedMatch.id);
                if (matchError) throw matchError;

                await onDataUpdate(); 
                setModalLoading(false);
                setViewMode('schedule');
                setSelectedMatch(null);
                openModal({ title: "Results Submitted", message: `Results for Match ${selectedMatch.id} successfully recorded.`, showCancel: false });
            }
        });
    };

    // 5. Advancement
    const handleAdvanceTeams = () => {
        openModal({ title: "Advancement Logic", message: "This function will calculate standings, advance winners, and update the tournament to the next stage.", showCancel: false });
    };


    // --- UI RENDER ---

    // 1. Results Entry Modal Content
    const ResultsEntryModalContent = () => {
        const [results, setResults] = useState(selectedMatch?.matchResults || []);
        const lobbySize = selectedMatch.matchResults.length;

        const handleResultChange = (participant_id, field, value) => {
            setResults(prev => prev.map(r => 
                r.participant_id === participant_id ? { ...r, [field]: value } : r
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

        return (
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full max-w-4xl border border-dark-600 relative`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <h3 className="text-xl font-semibold text-white flex items-center"><Upload className='mr-2 size-5'/> Results Entry: {selectedMatch.id}</h3>
                    <button onClick={() => setViewMode('schedule')} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-400">Group {selectedMatch.group_name} - Match {selectedMatch.match_number}. {lobbySize} Teams.</p>
                        <button onClick={handleSimulate} className="btn-secondary btn-xs flex items-center bg-blue-900/30 text-blue-300 border-blue-700/50 hover:bg-blue-900/50">
                            <Zap size={14} className="mr-1"/> Simulate Match Results
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[60vh]">
                        <table className="min-w-full divide-y divide-dark-700">
                            <thead className="bg-dark-700/70 sticky top-0">
                                <tr>
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
                                    const pPoints = calculatePlacementPoints(placement);
                                    const kPoints = calculateKillPoints(kills);
                                    const tPoints = pPoints + kPoints;

                                    return (
                                        <tr key={teamResult.participant_id} className="hover:bg-dark-700/50 transition-colors">
                                            <td className="px-3 py-2 font-medium text-white">{teamResult.teamName}</td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="number" min="1" max={lobbySize}
                                                    value={teamResult.placement || ''}
                                                    onChange={(e) => handleResultChange(teamResult.participant_id, 'placement', e.target.value)}
                                                    className="input-field input-field-sm w-16 text-center"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="number" min="0"
                                                    value={teamResult.kills}
                                                    onChange={(e) => handleResultChange(teamResult.participant_id, 'kills', e.target.value)}
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

    // 2. Schedule View
    const ScheduleView = () => {
        const schedule = matchesForThisStage;
        const totalMaps = currentStageDetails.groups * currentStageDetails.matchesPerGroup;
        const completedMaps = schedule.filter(m => m.status === 'Completed').length;

        return (
            <div className="space-y-6">
                <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                    <h3 className="text-xl font-bold text-white flex items-center"><Calendar size={20} className='mr-2 text-primary-400'/> Match Schedule</h3>
                    <div className="text-sm text-gray-300">
                        Progress: <span className='font-bold text-primary-400'>{completedMaps}</span> / {totalMaps} Maps Completed
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {schedule.map(match => (
                        <div key={match.id} className={`bg-dark-700/50 p-4 rounded-lg border ${match.status === 'Completed' ? 'border-green-600/50' : 'border-dark-600'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-lg font-semibold text-white">{match.group_name} - Match {match.match_number}</span>
                                    <p className="text-xs text-gray-400">ID: {match.id.slice(0, 8)}...</p>

                                    {editingMatchId === match.id ? (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <input
                                                type="datetime-local"
                                                defaultValue={new Date(match.scheduled_time).toISOString().slice(0, 16)} 
                                                id={`dt-${match.id}`}
                                                className="input-field input-field-sm w-48"
                                            />
                                            <button onClick={() => { const newDateTime = document.getElementById(`dt-${match.id}`).value; handleUpdateSchedule(match.id, newDateTime); }} className="btn-primary btn-xs"> <Save size={14}/> </button>
                                            <button onClick={() => setEditingMatchId(null)} className="bg-red-600/20 hover:bg-red-500/30 text-red-400 font-bold py-1 px-2 rounded transition-colors text-xs"> <X size={14}/> </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2 mt-1">
                                            <p className="text-sm font-medium text-primary-400 flex items-center">
                                                <Clock size={14} className='mr-1'/> {new Date(match.scheduled_time).toLocaleString()}
                                            </p>
                                            <button onClick={() => setEditingMatchId(match.id)} className="text-gray-500 hover:text-primary-400 transition-colors" title="Edit Date/Time"> <Edit size={14}/> </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${match.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
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
                <button onClick={() => setViewMode('standings')} className="btn-secondary flex items-center"> <BarChart2 size={16} className="mr-2" /> View Group Standings </button>
            </div>
        );
    };

    // 3. Grouped Standings View
    const GroupedStandingsView = () => (
        <div className="space-y-6">
            <div className='bg-dark-700 p-4 rounded-lg flex justify-between items-center border border-dark-600'>
                <h3 className="text-xl font-bold text-white flex items-center"><BarChart2 size={20} className='mr-2 text-primary-400'/> Stage Standings: Per Group</h3>
                <button onClick={() => setViewMode('schedule')} className="btn-secondary btn-xs flex items-center"> <Calendar size={16} className="mr-1" /> View Schedule </button>
            </div>
            {groupNames.map(groupName => {
                const standings = groupedStandings[groupName] || [];
                return (
                    <div key={groupName} className='bg-dark-700 rounded-lg shadow-xl border border-dark-600'>
                        <h4 className='text-lg font-bold text-white p-3 border-b border-dark-600 bg-dark-600/50'>{groupName} <span className='text-sm text-gray-400 font-normal'>({standings.length} Teams)</span></h4>
                        <div className='overflow-x-auto'>
                            <table className="min-w-full divide-y divide-dark-700">
                                <thead className="bg-dark-600/70">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-12">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Maps</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-yellow-400 uppercase tracking-wider">P. Pts</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-red-400 uppercase tracking-wider">K. Pts</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-primary-400 uppercase tracking-wider">Total Pts</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-green-400 uppercase tracking-wider">Wins</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-700">
                                    {standings.map((stat, index) => (
                                        <tr key={stat.team.id} className={`transition-colors hover:bg-dark-700`}>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-primary-400">{index + 1}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">{stat.team.team_name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{stat.mapsPlayed}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-yellow-300">{stat.placementPoints}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-red-300">{stat.killPoints}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-extrabold text-primary-300">{stat.totalPoints}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-green-400">{stat.wins}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
            <div className="flex justify-between items-center border-t border-dark-700 pt-4">
                 <button onClick={handleAdvanceTeams} className="btn-primary flex items-center">
                    <Send size={16} className="mr-2" /> Advance Top Teams to Stage {current_stage + 1}
                </button>
            </div>
        </div>
    );

    // --- Main View Renderer ---
    const renderStageView = () => {
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

        if (matchesForThisStage.length === 0) {
            return (
                <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                    <div className="flex items-center text-lg font-bold"><Shuffle size={20} className="mr-2"/> Status: {currentStageDetails.name} Group Draw Pending</div>
                    <p>The **{teamsForThisStage.length} teams** are ready. Run the group draw to generate the schedule for this stage.</p>
                    <button onClick={handleGroupDraw} className="btn-primary flex items-center">
                        <Shuffle size={16} className="mr-2" /> Run Group Draw & Schedule
                    </button>
                </div>
            );
        }

        switch (viewMode) {
            case 'schedule': return <ScheduleView />;
            case 'standings': return <GroupedStandingsView />;
            case 'overview':
            default:
                return (
                    <div className='space-y-6'>
                         <div className='bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-300'>
                            <h3 className="font-bold mb-2 flex items-center"><Info size={16} className='mr-2'/> Stage {current_stage} Management</h3>
                            <p>Groups and schedule are set. Manage match times and enter results to calculate standings.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setViewMode('schedule')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                <CalendarCheck size={20} className='mr-2 text-primary-400'/> Manage Schedule & Results
                            </button>
                            <button onClick={() => setViewMode('standings')} className='btn-secondary py-3 flex items-center justify-center text-lg font-bold hover:bg-dark-600 border-primary-500/50'>
                                <BarChart2 size={20} className='mr-2 text-primary-400'/> View Group Standings
                            </button>
                        </div>
                    </div>
                );
        }
    };

    if (viewMode === 'resultsEntry') {
        return <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">{renderStageView()}</AnimatedSection>;
    }

    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-bold text-primary-300 flex items-center border-b border-dark-700 pb-3">
                <TrendingUp className="mr-3" size={24}/> {tournament.name}
            </h2>
            <p className="text-gray-400">
                Current Stage: <span className='font-bold text-primary-400'>{currentStageDetails?.name || 'Error'}</span>. Teams in Stage: **{teamsForThisStage.length}**
            </p>

            {/* --- NEW: Participant List Added --- */}
            <ParticipantList participants={participants} maxParticipants={tournament.max_participants} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {stages.map((stage) => {
                    const isCurrent = stage.id === current_stage;
                    const isCompleted = stage.id < current_stage;
                    const statusColor = isCompleted ? 'bg-green-600' : isCurrent ? 'bg-primary-600' : 'bg-dark-600';
                    return (
                        <div key={stage.id} className={`p-4 rounded-lg shadow-lg border-2 ${isCurrent ? 'border-primary-500 bg-dark-700' : isCompleted ? 'border-green-500/50 bg-green-900/10' : 'border-dark-600 bg-dark-700/50'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm font-semibold text-white px-2 py-0.5 rounded ${statusColor}`}>{stage.name}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{stage.totalTeams} <span className="text-base text-primary-400 font-normal">Teams</span></h3>
                            <p className="text-sm text-gray-300"><BarChart2 size={14} className='inline mr-1 text-yellow-400'/> {stage.groups} groups of {stage.groupSize}. {stage.matchesPerGroup} matches.</p>
                        </div>
                    );
                 })}
            </div>

            {renderStageView()}

        </AnimatedSection>
    );
};


// ------------------------------------------------------------------------------------
// FORMAT 2: League BR Stage Management (Farlight 84 Demo)
// ------------------------------------------------------------------------------------
const LeagueBRStageView = ({ tournament, participants, matches, results, onDataUpdate, openModal, setModalLoading }) => {
    const { stages, current_stage } = tournament;
    const currentStageDetails = stages.find(s => s.id === current_stage);
    const [viewMode, setViewMode] = useState('overview'); 

    const handleScheduleGeneration = () => {
        openModal({
            title: `Confirm Schedule Generation for ${currentStageDetails.name}`,
            message: `This will generate ${currentStageDetails.matchesPerWeek} matches with random lobbies.`,
            confirmText: 'Generate Schedule',
            onConfirm: async () => {
                setModalLoading(true);
                // ... Supabase logic ...
                await onDataUpdate();
                setModalLoading(false);
                openModal({ title: "Schedule Generated", message: "Schedule created successfully.", showCancel: false });
            }
        });
    };

    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-bold text-primary-300 flex items-center border-b border-dark-700 pb-3">
                <TrendingUp className="mr-3" size={24}/> {tournament.name}
            </h2>
            <p className="text-gray-400">Current Stage: <span className='font-bold text-primary-400'>{currentStageDetails?.name}</span></p>

            {/* --- NEW: Participant List Added --- */}
            <ParticipantList participants={participants} maxParticipants={tournament.max_participants} />

            <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                <div className="flex items-center text-lg font-bold"><CalendarCheck size={20} className="mr-2"/> Status: {currentStageDetails.name} Schedule Pending</div>
                <p>The **{participants.length} teams** are ready. Generate the **{currentStageDetails.matchesPerWeek} matches** for this week's league play. </p>
                <button onClick={handleScheduleGeneration} className="btn-primary flex items-center">
                    <CalendarCheck size={16} className="mr-2" /> Generate Match Schedule
                </button>
            </div>
        </AnimatedSection>
    );
};


// ------------------------------------------------------------------------------------
// FORMAT 3: MOBA League Management (Mobile Legends Demo)
// ------------------------------------------------------------------------------------
const MLBBManagementView = ({ tournament, participants, matches, results, onDataUpdate, openModal, setModalLoading }) => {
    const { stages, current_stage, format } = tournament;
    const currentStageDetails = stages.find(s => s.id === current_stage);
    const [viewMode, setViewMode] = useState('overview'); 

    const handleGenerateLeagueSchedule = () => {
        openModal({
            title: `Confirm League Schedule Generation`,
            message: `This will generate a Round-Robin schedule for ${participants.length} teams across ${currentStageDetails.rounds} rounds.`,
            confirmText: 'Generate Schedule',
            onConfirm: async () => {
                setModalLoading(true);

                const generatedPairs = generateRoundRobinSchedule(participants, currentStageDetails.rounds);
                const matchesToInsert = generatedPairs.map(pair => ({
                    tournament_id: tournament.id,
                    stage_id: 1,
                    round_number: pair.round,
                    match_number: pair.matchNumber,
                    status: 'Scheduled',
                    scheduled_time: new Date(Date.now() + 24*60*60*1000 * pair.round).toISOString()
                }));

                const { data: newMatches, error: matchError } = await supabase.from('tournament_matches').insert(matchesToInsert).select('id, match_number');
                if (matchError) throw matchError;

                const matchParticipantsToInsert = [];
                newMatches.forEach(match => {
                    const pair = generatedPairs.find(p => p.matchNumber === match.match_number);
                    if(pair) {
                        matchParticipantsToInsert.push(
                            { match_id: match.id, participant_id: pair.team1_id },
                            { match_id: match.id, participant_id: pair.team2_id }
                        );
                    }
                });

                const { error: matchPartError } = await supabase.from('match_participants').insert(matchParticipantsToInsert);
                if (matchPartError) throw matchPartError;

                await onDataUpdate();
                setModalLoading(false);
                openModal({ title: "Schedule Complete", message: `Successfully generated ${newMatches.length} Round Robin matches.`, showCancel: false, onClose: () => setViewMode('schedule') });
            }
        });
    };

    return (
        <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-bold text-primary-300 flex items-center border-b border-dark-700 pb-3">
                <Swords className="mr-3" size={24}/> {tournament.name}
            </h2>
            <p className="text-gray-400">Current Stage: <span className='font-bold text-primary-400'>{currentStageDetails?.name}</span></p>

            {/* --- NEW: Participant List Added --- */}
            <ParticipantList participants={participants} maxParticipants={tournament.max_participants} />

            <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 text-sm text-yellow-300 space-y-4'>
                <div className="flex items-center text-lg font-bold"><CalendarCheck size={20} className="mr-2"/> Status: League Schedule Pending</div>
                <p>The **{participants.length} teams** are registered. Generate the **Round Robin** schedule to begin the League stage.</p>
                <button onClick={handleGenerateLeagueSchedule} className="btn-primary flex items-center">
                    <CalendarCheck size={16} className="mr-2" /> Generate League Schedule
                </button>
            </div>
        </AnimatedSection>
    );
};


// ------------------------------------------------------------------------------------
// --- MAIN PAGE COMPONENT ---
// ------------------------------------------------------------------------------------
export default function UpdateTournamentPage() {
    const { tournamentId } = useParams(); // Can be "manage" or a UUID
    const { user } = useAuth();
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState('loading'); // 'loading', 'list', 'manage', 'error'
    const [tournamentsList, setTournamentsList] = useState([]);
    const [currentTournamentData, setCurrentTournamentData] = useState({
        tournament: null,
        participants: [],
        matches: [],
        results: []
    });
    const [error, setError] = useState(null);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [isModalLoading, setModalLoading] = useState(false);

    const openModal = (content) => { 
        setModalContent(content); 
        setIsModalOpen(true); 
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setModalLoading(false);
        setModalContent({});
    };

    // --- Data Fetching ---
    const fetchTournamentData = useCallback(async (id) => {
        console.log("Fetching data for tournament:", id);
        setViewMode('loading');
        setError(null);

        try {
            // 1. Fetch main tournament record
            const { data: tourneyData, error: tourneyError } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', id)
                .single();

            if (tourneyError) throw tourneyError;
            if (!tourneyData) throw new Error("Tournament not found.");

            // 2. Fetch all participants, matches in parallel
            const [partRes, matchRes] = await Promise.all([
                supabase.from('tournament_participants').select('*').eq('tournament_id', id),
                supabase.from('tournament_matches').select('*').eq('tournament_id', id)
            ]);

            if (partRes.error) throw partRes.error;
            if (matchRes.error) throw matchRes.error;

            const participants = partRes.data || [];
            const matches = matchRes.data || [];

            // 3. Fetch results based on the matches we found
            let results = [];
            const matchIds = matches.map(m => m.id);
            if (matchIds.length > 0) {
                const { data: resultsData, error: resultsError } = await supabase
                    .from('match_results')
                    .select('*')
                    .in('match_id', matchIds);

                if (resultsError) throw resultsError;
                results = resultsData || [];
            }

            // 4. Set all data
            setCurrentTournamentData({
                tournament: tourneyData,
                participants: participants,
                matches: matches,
                results: results
            });
            setViewMode('manage');

        } catch (err) {
            console.error("Error fetching tournament data:", err.message);
            setError(err.message);
            setViewMode('error');
        }
    }, []);

    const fetchTournamentsList = useCallback(async (userId) => {
        console.log("Fetching tournament list for user:", userId);
        setViewMode('loading');
        setError(null);
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('id, name, game, format, status, max_participants')
                .eq('organizer_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setTournamentsList(data || []);
            setViewMode('list');

        } catch (err) {
            console.error("Error fetching tournaments list:", err.message);
            setError(err.message);
            setViewMode('error');
        }
    }, []);

    // --- Main useEffect to route fetching ---
    useEffect(() => {
        if (!user) {
            if (!useAuth.loading) {
                setViewMode('error');
                setError("You must be logged in to manage tournaments.");
            }
            return;
        }

        if (tournamentId === 'manage') {
            fetchTournamentsList(user.id);
        } else if (tournamentId) {
            fetchTournamentData(tournamentId);
        }
    }, [tournamentId, user, fetchTournamentData, fetchTournamentsList]);

    // --- Data Refresh Function ---
    const handleDataUpdate = async (dataType = 'all') => {
        if (viewMode === 'manage' && tournamentId !== 'manage') {
            await fetchTournamentData(tournamentId);
        }
    };

    // --- RENDER FUNCTIONS ---

    const renderListView = () => (
        <AnimatedSection delay={100} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-primary-300 border-b border-dark-700 pb-3">Your Tournaments ({tournamentsList.length})</h2>
            {tournamentsList.length > 0 ? (
                <div className="space-y-6">
                    {tournamentsList.map((t, index) => {
                        let formatText = t.format.replace(/-/g, ' ');
                        let formatColor = 'text-primary-400';
                        if (t.format === 'grouped-multi-stage-br') formatColor = 'text-orange-400';
                        if (t.format === 'multi-stage-br') formatColor = 'text-purple-400';
                        if (t.format === 'round-robin-to-bracket') formatColor = 'text-green-400';

                        return ( 
                            <AnimatedSection key={t.id} delay={150 + index * 100} className="bg-dark-700/50 rounded-lg p-4 border border-dark-600 hover:border-primary-500/30 transition-colors duration-200"> 
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4"> 
                                    <div className="flex-grow"> 
                                        <h3 className="text-xl font-semibold text-white mb-1">{t.name}</h3> 
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400"> 
                                            <span>Game: <span className="text-white">{t.game}</span></span> 
                                            <span>Format: <span className={`font-bold capitalize ${formatColor}`}>{formatText}</span></span>
                                            <span>Status: <span className="font-medium">{t.status}</span></span> 
                                        </div> 
                                    </div> 
                                    <div className="flex flex-wrap gap-2 flex-shrink-0"> 
                                        <Link to={`/update-tournament/${t.id}`} className="btn-primary btn-xs flex items-center" title="Manage Stages"><TrendingUp size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Manage</span></Link>
                                    </div> 
                                </div> 
                            </AnimatedSection> 
                        ); 
                    })} 
                </div>
            ) : ( <p className="text-gray-500 text-center py-6">You haven't created any tournaments yet.</p> )}
            <div className="text-center mt-8 border-t border-dark-700 pt-6"> <Link to="/create-tournament" className="btn-primary"> Create New Tournament </Link> </div>
        </AnimatedSection>
    );

    const renderManagementView = () => {
        const { tournament, participants, matches, results } = currentTournamentData;

        if (!tournament) return null; // Should be handled by loading state

        // --- Main Router for Management Views ---
        switch (tournament.format) {
            case 'grouped-multi-stage-br':
                return <GroupedBRStageView 
                            tournament={tournament} 
                            participants={participants} 
                            matches={matches} 
                            results={results} 
                            onDataUpdate={handleDataUpdate} 
                            openModal={openModal}
                            setModalLoading={setModalLoading}
                        />;
            case 'multi-stage-br':
                return <LeagueBRStageView 
                            tournament={tournament} 
                            participants={participants} 
                            matches={matches} 
                            results={results} 
                            onDataUpdate={handleDataUpdate} 
                            openModal={openModal} 
                            setModalLoading={setModalLoading}
                        />;
            case 'round-robin-to-bracket':
                return <MLBBManagementView 
                            tournament={tournament} 
                            participants={participants} 
                            matches={matches} 
                            results={results} 
                            onDataUpdate={handleDataUpdate} 
                            openModal={openModal} 
                            setModalLoading={setModalLoading}
                        />;
            default:
                return (
                    <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6">
                        <h2 className="text-2xl font-bold mb-4 text-primary-300">Management for: {tournament.name}</h2>
                        <div className='bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-sm text-yellow-300 flex items-center'>
                            <AlertTriangle size={18} className="mr-2"/> Management view for this format ({tournament.format}) is not supported.
                        </div>
                    </AnimatedSection>
                );
        }
    };

    const renderContent = () => {
        if (viewMode === 'loading') {
            return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="w-16 h-16 text-primary-500 animate-spin" /></div> );
        }

        if (viewMode === 'error') {
            return (
                <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6 text-center">
                    <AlertTriangle size={48} className="mx-auto text-red-500" />
                    <h2 className="text-2xl font-bold mb-4 text-red-400">An Error Occurred</h2>
                    <p className="text-gray-300">{error}</p>
                    <Link to="/tournaments" className="btn-secondary inline-flex items-center mt-6"> <ArrowLeft size={16} className="mr-2" /> Back to Tournaments </Link>
                </AnimatedSection>
            );
        }

        if (viewMode === 'list') {
            return renderListView();
        }

        if (viewMode === 'manage') {
            return renderManagementView();
        }

        return null;
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 mb-2 flex items-center justify-center"> <Settings className="w-8 h-8 mr-3" /> Tournament Management </h1>
                    <p className="text-center text-gray-400"> Oversee tournaments, manage participants, schedules, and results. </p>
                </AnimatedSection>

                {renderContent()}

                {/* --- Re-usable Modal --- */}
                <CustomModal
                    isOpen={isModalOpen} 
                    onClose={closeModal} 
                    title={modalContent.title}
                    onConfirm={modalContent.onConfirm} 
                    confirmText={modalContent.confirmText}
                    showCancel={modalContent.showCancel} 
                    customBody={modalContent.customBody} 
                    large={modalContent.large}
                    isLoading={isModalLoading}
                >
                    {modalContent.message}
                </CustomModal>

            </div>
        </div>
    );
}