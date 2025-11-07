// src/pages/ManageScrimPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
    Settings, Users, Edit3, Trash2, Save, XCircle, UserX, UserCheck, Loader2, AlertCircle, MapPin, ListChecks, ArrowLeft, PlusCircle, Shuffle, BarChart2, Calendar, Eye,
    X as CloseIcon, 
    CheckCircle as CheckCircleIcon, 
    Info 
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- SCORING ENGINE (BR - Free Fire Standard) ---
const calculatePlacementPoints = (placement) => {
    if (placement < 1 || placement > 12) return 0; // Assuming max 12 teams for simplicity
    return 39 - (3 * (placement - 1)); 
};
const calculateKillPoints = (kills) => {
    return kills * 2;
};

// --- Custom Modal ---
const CustomModal = ({ isOpen, onClose, title, children, confirmText = 'OK', onConfirm, showCancel = true, isLoading = false }) => {
    if (!isOpen) return null;

    const Icon = (title && title.toLowerCase().includes('error')) 
        ? AlertCircle 
        : (title && title.toLowerCase().includes('success')) 
        ? CheckCircleIcon
        : Info;
    const iconColor = (title && title.toLowerCase().includes('error')) ? 'text-red-400' : (title && title.toLowerCase().includes('success')) ? 'text-green-400' : 'text-primary-400';

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        else onClose(); 
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !isLoading && onClose()}>
            <div className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-md border border-dark-600 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${iconColor}`} /> <h3 className="text-lg font-semibold text-white">{title}</h3> </div>
                    <button onClick={() => !isLoading && onClose()} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" disabled={isLoading}> <CloseIcon size={20} /> </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="text-gray-300 text-sm">{children}</div>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    {showCancel && (<button onClick={() => !isLoading && onClose()} className="btn-secondary text-sm" disabled={isLoading}>Cancel</button>)}
                    <button onClick={handleConfirm} className="btn-primary text-sm flex items-center justify-center" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function ManageScrimPage() {
    const { scrimId } = useParams();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    // Data States
    const [scrimData, setScrimData] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI States
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [newTeamName, setNewTeamName] = useState('');
    const [editingMatch, setEditingMatch] = useState(null);
    const [resultsToSubmit, setResultsToSubmit] = useState([]);

    const openModal = (content) => { setModalContent(content); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setModalContent({}); };

    // --- Fetch Scrim Data ---
    const fetchData = useCallback(async () => {
        const id = scrimId;
        if (!id) return;

        setLoading(true); setError(null);
        try {
            // 1. Fetch Scrim/Tournament Data
            const { data: scrim, error: scrimError } = await supabase
                .from('tournaments')
                .select('*, max_rounds') // Fetch max_rounds column
                .eq('id', id)
                .eq('type', 'scrim') // CRITICAL FILTER
                .single();

            if (scrimError) throw scrimError;
            if (!scrim) throw new Error("Scrim not found or you lack permission.");
            setScrimData(scrim);

            // 2. Fetch Participants, Matches, and Results
            const [partRes, matchRes] = await Promise.all([
                supabase.from('tournament_participants').select('*').eq('tournament_id', id),
                supabase.from('tournament_matches').select('*').eq('tournament_id', id).order('match_number', { ascending: true }),
            ]);

            if (partRes.error) throw partRes.error;
            if (matchRes.error) throw matchRes.error;

            setParticipants(partRes.data || []);
            setMatches(matchRes.data || []);

            const matchIds = (matchRes.data || []).map(m => m.id);
            if (matchIds.length > 0) {
                 const { data: resData, error: resError } = await supabase.from('match_results').select('*').in('match_id', matchIds);
                 if (resError) throw resError;
                 setResults(resData || []);
            } else {
                 setResults([]);
            }

        } catch (err) {
            console.error("Error fetching scrim data:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [scrimId]);

    useEffect(() => {
        if (authUser) fetchData();
    }, [authUser, fetchData]);

    // --- Actions ---

    // 1. Add Team
    const handleAddTeam = async (e) => {
        e.preventDefault();
        if (scrimData.status !== 'Draft' && scrimData.status !== 'Setup') {
            setError("Cannot add teams after the scrim has started.");
            return;
        }
        if (participants.length >= scrimData.max_participants) {
             setError(`Maximum participant limit (${scrimData.max_participants}) reached.`);
             return;
        }

        setIsSaving(true);
        try {
             // Find Team by Name/ID (Simplified search needed, use TeamName for now)
            const { data: teams } = await supabase.from('teams').select('id, name, logo_url').eq('name', newTeamName.trim());
            if (!teams || teams.length === 0) throw new Error("Team not found by that name.");
            const team = teams[0];

            // Check if already participant
            if (participants.some(p => p.team_id === team.id)) throw new Error("Team is already registered.");

            const { error: insertError } = await supabase.from('tournament_participants').insert({
                tournament_id: scrimId,
                team_id: team.id,
                team_name: team.name,
                team_logo_url: team.logo_url,
                status: 'Registered'
            });

            if (insertError) throw insertError;
            setNewTeamName('');
            await fetchData();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // 2. Generate Matches (Rounds)
    const handleGenerateMatches = () => {
        if (matches.length > 0) { setError("Matches already generated."); return; }
        if (participants.length < 2) { setError("Need at least 2 teams to generate matches."); return; }

        openModal({
            title: 'Generate Scrim Matches',
            message: `This will generate ${scrimData.max_rounds} matches for the ${participants.length} registered teams.`,
            confirmText: 'Generate Matches',
            showCancel: true,
            onConfirm: async () => {
                setIsSaving(true);
                const participantsToInsert = [];
                const scheduledTime = new Date(scrimData.start_date).toISOString();

                try {
                    for (let i = 1; i <= scrimData.max_rounds; i++) {
                        const newMatch = {
                            tournament_id: scrimId,
                            stage_id: 1, // Dummy Stage 1
                            match_number: i,
                            scheduled_time: scheduledTime,
                            status: 'Scheduled',
                            group_name: `Round ${i}` // Use group_name for Round label
                        };

                        // Insert match and get the new match ID
                        const { data: matchData, error: matchError } = await supabase.from('tournament_matches').insert(newMatch).select('id').single();
                        if (matchError) throw matchError;

                        // Prepare match participants insertion
                        participants.forEach(p => {
                             participantsToInsert.push({ match_id: matchData.id, participant_id: p.id, tournament_id: scrimId });
                        });
                    }

                    // Insert all match participants in one go
                    const { error: partError } = await supabase.from('match_participants').insert(participantsToInsert);
                    if (partError) throw partError;

                    // Update tournament status
                    await supabase.from('tournaments').update({ status: 'Running' }).eq('id', scrimId);

                    closeModal();
                    await fetchData();

                } catch (err) {
                    closeModal();
                    openModal({ title: 'Generation Failed', message: err.message, showCancel: false });
                } finally {
                    setIsSaving(false);
                }
            }
        });
    };

    // 3. Results Entry Helpers
    const openResultsEntry = (match) => {
        const existingResults = results.filter(r => r.match_id === match.id);
        const teamsInMatch = participants.map(p => {
             const existing = existingResults.find(r => r.participant_id === p.id);
             return { 
                 id: p.id, 
                 teamName: p.team_name, 
                 placement: existing?.placement || null, 
                 kills: existing?.kills || 0 
             };
        });

        setResultsToSubmit(teamsInMatch);
        setEditingMatch(match);
    };

    const handleResultChange = (participant_id, field, value) => {
        setResultsToSubmit(prev => prev.map(r => {
            if (r.id === participant_id) {
                 // Use parseInt with fallback to null for placement, 0 for kills
                 let numericValue = (value === '' || value === null) ? 
                                     (field === 'kills' ? 0 : null) : 
                                     parseInt(value, 10);

                 // Enforce minimums/maximums if possible, or just ensure it's not NaN
                 if (isNaN(numericValue) && value !== '') {
                      numericValue = field === 'kills' ? 0 : null; 
                 }

                 return { ...r, [field]: numericValue };
            }
            return r;
        }));
    };

    // 4. Submit Results (CRITICAL SECTION FOR THE 400 ERROR)
    const handleSubmitResults = async () => {
        const match = editingMatch;

        // Validation check for empty placement
        const invalidResults = resultsToSubmit.filter(r => r.placement === null || r.placement <= 0 || isNaN(r.placement));
        if (invalidResults.length > 0) {
             openModal({ title: "Validation Error", message: "All teams must have a valid placement (1 or higher).", showCancel: false }); return;
        }

        setIsSaving(true);
        try {
             const resultsPayload = resultsToSubmit.map(r => ({
                match_id: match.id,
                participant_id: r.id,
                // Ensure values are integers for the database
                placement: parseInt(r.placement, 10), 
                kills: parseInt(r.kills, 10),
             }));

             // --- Supabase UPSERT operation ---
             // The ON CONFLICT must match the unique constraint on match_results table
             const { error: upsertError } = await supabase.from('match_results').upsert(resultsPayload, { onConflict: 'match_id, participant_id' });

             if (upsertError) {
                 console.error("Supabase Upsert Error:", upsertError);
                 throw new Error(`Database Error: ${upsertError.message}`);
             }
             // --- End Upsert ---

             // Update match status to Completed
             await supabase.from('tournament_matches').update({ status: 'Completed' }).eq('id', match.id);

             setEditingMatch(null);
             await fetchData();

        } catch (err) {
             openModal({ title: 'Submission Failed', message: err.message, showCancel: false });
        } finally {
            setIsSaving(false);
        }
    };

    // 5. Finalize Scrim
    const handleFinalizeScrim = async () => {
        if (matches.length < scrimData.max_rounds) {
             setError(`Not all rounds are generated (${matches.length} of ${scrimData.max_rounds}).`); return;
        }
        if (matches.some(m => m.status !== 'Completed')) {
            setError("Not all matches are completed. Please enter results for all rounds."); return;
        }

        openModal({
            title: 'Finalize Scrim',
            message: `This will mark the scrim as 'Completed'.`,
            confirmText: 'Mark Completed',
            onConfirm: async () => {
                setIsSaving(true);
                try {
                     await supabase.from('tournaments').update({ status: 'Completed' }).eq('id', scrimId);
                     closeModal();
                     await fetchData();
                } catch (err) {
                    closeModal();
                    openModal({ title: 'Finalization Failed', message: err.message });
                } finally {
                    setIsSaving(false);
                }
            }
        });
    };

    // --- Render Logic ---
    if (loading) return (<div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl text-gray-400">Loading Scrim Management...</p> </div>);
    if (error) return (<div className="text-center text-red-400 mt-10">Error: {error}</div>);
    if (!scrimData) return null;

    const totalMatches = scrimData.max_rounds;
    const completedMatches = matches.filter(m => m.status === 'Completed').length;

    // Scrim Match List
    const ScrimMatchList = () => (
        <div className="space-y-4">
             {matches.map(match => {
                const isCompleted = match.status === 'Completed';
                const matchResults = results.filter(r => r.match_id === match.id);
                 return (
                    <div key={match.id} className={`bg-dark-700/50 p-4 rounded-lg border ${isCompleted ? 'border-green-600/50' : 'border-dark-600'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-lg font-semibold text-white">{match.group_name}</span>
                                <p className="text-xs text-gray-400">Scheduled: {new Date(match.scheduled_time).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isCompleted ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
                                    {match.status}
                                </span>
                                <button onClick={() => openResultsEntry(match)} className="btn-primary btn-xs mt-2 flex items-center ml-auto">
                                    <ListChecks size={14} className='mr-1'/> {isCompleted ? 'Edit Results' : 'Enter Results'}
                                </button>
                            </div>
                        </div>
                        {isCompleted && <p className="text-xs text-gray-400 mt-2">Results: {matchResults.length} teams recorded.</p>}
                    </div>
                );
             })}
        </div>
    );

    // Results Entry Modal UI
    const ResultsEntryUI = () => (
        <CustomModal
            isOpen={!!editingMatch}
            onClose={() => setEditingMatch(null)}
            title={`Enter Results for ${editingMatch?.group_name}`}
            confirmText="Submit Results"
            showCancel={true}
            onConfirm={handleSubmitResults}
            isLoading={isSaving}
        >
            <div className='max-h-96 overflow-y-auto space-y-3'>
                <p className='text-sm text-gray-400'>Enter placement (1-{}) and kills for each team.</p>
                <div className='flex flex-col space-y-2'>
                    {resultsToSubmit.map((teamResult, index) => (
                        <div key={teamResult.id} className='flex items-center space-x-3 p-2 bg-dark-700 rounded'>
                            <span className='font-medium w-1/2 truncate'>{teamResult.teamName}</span>
                            <input 
                                type="number" 
                                min="1" 
                                max={participants.length} 
                                value={teamResult.placement || ''} 
                                onChange={(e) => handleResultChange(teamResult.id, 'placement', e.target.value)} 
                                className="input-field input-field-sm w-16 text-center" 
                                placeholder="Plac"
                            />
                            <input 
                                type="number" 
                                min="0" 
                                value={teamResult.kills || 0} 
                                onChange={(e) => handleResultChange(teamResult.id, 'kills', e.target.value)} 
                                className="input-field input-field-sm w-16 text-center" 
                                placeholder="Kills"
                            />
                            <span className='text-xs text-primary-400 ml-auto'>
                                {calculatePlacementPoints(teamResult.placement) + calculateKillPoints(teamResult.kills)} Pts
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </CustomModal>
    );

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <AnimatedSection delay={0}>
                    <div className='flex justify-between items-center mb-6'>
                        <h1 className="text-3xl font-bold flex items-center text-primary-400"><Settings className="mr-3" size={28} /> Scrim Management: {scrimData.name}</h1>
                        <Link to="/admin/create-scrim" className="btn-secondary flex items-center text-sm"> <PlusCircle className="mr-2" size={16} /> New Scrim </Link>
                    </div>
                </AnimatedSection>

                {/* Status and Actions */}
                <AnimatedSection className='grid grid-cols-1 md:grid-cols-3 gap-6' delay={100}>
                    <div className="card bg-dark-700/50 p-4 border border-dark-600">
                        <p className='text-sm text-gray-400'>Status</p>
                        <p className={`text-xl font-bold ${scrimData.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>{scrimData.status}</p>
                    </div>
                    <div className="card bg-dark-700/50 p-4 border border-dark-600">
                        <p className='text-sm text-gray-400'>Rounds</p>
                        <p className='text-xl font-bold text-primary-400'>{completedMatches} / {totalMatches}</p>
                    </div>
                    <div className="card bg-dark-700/50 p-4 border border-dark-600">
                         <p className='text-sm text-gray-400'>Teams</p>
                         <p className='text-xl font-bold text-purple-400'>{participants.length} / {scrimData.max_participants}</p>
                    </div>
                </AnimatedSection>

                {error && <p className="p-3 bg-red-900/30 text-red-400 rounded">{error}</p>}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Participants and Actions) */}
                    <AnimatedSection delay={200} className="lg:col-span-1 space-y-6">
                        <div className="card bg-dark-800 p-6">
                             <h2 className="text-xl font-bold mb-4 flex items-center"><Users className="mr-2" size={20}/> Manage Participants</h2>

                             <form onSubmit={handleAddTeam} className="space-y-3 mb-4 border-b border-dark-700 pb-4">
                                <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} className="input-field w-full" placeholder="Enter Team Name to Add" required />
                                <button type="submit" disabled={isSaving || scrimData.status === 'Completed'} className="btn-primary w-full flex items-center justify-center text-sm"> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <PlusCircle size={16} className="mr-2"/>} Add Team </button>
                             </form>

                            <h3 className='text-lg font-semibold mb-3'>Roster ({participants.length})</h3>
                             <div className='space-y-2 max-h-64 overflow-y-auto'>
                                 {participants.map(p => (
                                     <div key={p.id} className="flex items-center justify-between bg-dark-700 p-2 rounded">
                                         <p className="text-sm text-white truncate">{p.team_name}</p>
                                         <button onClick={() => { /* Add remove logic */}} disabled={scrimData.status === 'Completed'} className='text-red-400 hover:text-red-300 transition-colors'> <Trash2 size={16}/> </button>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    </AnimatedSection>

                    {/* Right Column (Schedule & Results) */}
                    <AnimatedSection delay={300} className="lg:col-span-2 space-y-6">
                        <div className="card bg-dark-800 p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center justify-between"><Calendar className="mr-2" size={20}/> Match Schedule ({completedMatches}/{totalMatches})</h2>

                            {matches.length === 0 ? (
                                <div className='p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-yellow-300'>
                                     <p className='mb-3'>Schedule pending. Click below to generate {scrimData.max_rounds} rounds.</p>
                                     <button onClick={handleGenerateMatches} disabled={isSaving || participants.length < 2} className="btn-primary flex items-center disabled:opacity-50"> <Shuffle size={16} className='mr-2'/> Generate Scrim Matches </button>
                                </div>
                            ) : (
                                <ScrimMatchList />
                            )}

                            {matches.length > 0 && scrimData.status !== 'Completed' && (
                                <div className='pt-4 mt-4 border-t border-dark-700'>
                                     <button onClick={handleFinalizeScrim} disabled={isSaving || completedMatches !== totalMatches} className="btn-primary bg-green-600 hover:bg-green-700 w-full flex items-center justify-center disabled:opacity-50"> <CheckCircleIcon size={16} className='mr-2'/> Finalize Scrim </button>
                                </div>
                            )}

                             {scrimData.status === 'Completed' && (
                                <Link to={`/scrim/${scrimId}`} className="btn-secondary w-full flex items-center justify-center mt-4">
                                     <Eye size={16} className='mr-2'/> View Scrim Page
                                </Link>
                             )}
                        </div>
                    </AnimatedSection>
                </div>

                {/* Results Entry Modal UI */}
                <ResultsEntryUI />

            </div>
            <CustomModal 
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalContent.title}
                confirmText={modalContent.confirmText}
                onConfirm={modalContent.onConfirm}
                showCancel={modalContent.showCancel}
                isLoading={isSaving}
            >
                {modalContent.message}
            </CustomModal>
        </div>
    );
}