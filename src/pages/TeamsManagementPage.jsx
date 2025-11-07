// src/pages/TeamsManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Added Mail, Check, XCircle, Loader2, LogOut icons
import { PlusCircle, Eye, Users, ArrowRight, X, Image, Gamepad2, Edit3, Settings, AlertCircle, Loader2, Mail, Check as CheckIcon, XCircle as XCircleIcon, LogOut, Info, CheckCircle as CheckCircleIcon, X as CloseIcon } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection.jsx'; //
import { supabase } from '../lib/supabaseClient.js'; //
import { useAuth } from '../contexts/AuthContext.jsx'; //
import { useTeamUpdate } from '../contexts/TeamUpdateContext.jsx'; // <<< NEW IMPORT >>>


// --- Custom Modal Component (Added to this file) ---
const CustomModal = ({ isOpen, onClose, title, children, confirmText = 'OK', onConfirm, showCancel = true, isLoading = false }) => {
    if (!isOpen) return null;

    const Icon = (title && title.toLowerCase().includes('error')) ? AlertCircle : (title && title.toLowerCase().includes('success')) ? CheckCircleIcon : Info;
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
// --- End Custom Modal ---


// --- TeamListItem Component ---
const TeamListItem = ({ team, delay, authUser, refreshTeams, openModal, closeModal }) => { // Added modal handlers
    // --- USE NEW CONTEXT ---
    const { triggerTeamUpdate } = useTeamUpdate(); 
    const isOwner = authUser && team.owner_id === authUser.id;
    const [isLeaving, setIsLeaving] = useState(false); // State for leave button loading

    // Check if team has pending invites for notification badge
    const hasPendingInvites = team.pending_invites > 0;

    // Function for leaving team (Uses CustomModal)
    const handleLeaveTeam = () => {
        if (!authUser || isOwner) return; // Prevent owner from leaving via this button

        openModal({
            title: `Confirm Leave Team`,
            message: `Are you sure you want to leave the team "${team.name}"? You will need an invite to rejoin.`,
            confirmText: 'Yes, Leave Team',
            showCancel: true,
            onConfirm: async () => {
                setIsLeaving(true);
                try {
                    // Delete the member entry from team_members table
                    const { error } = await supabase
                        .from('team_members')
                        .delete()
                        .eq('team_id', team.id)
                        .eq('user_id', authUser.id);

                    if (error) throw error;

                    closeModal(); // Close modal on success
                    alert(`You have left ${team.name}.`); // Use native alert for final feedback
                    if (authUser?.id) { 
                     refreshTeams(authUser.id);
                     triggerTeamUpdate(); // <-- 🟢 TRIGGER GLOBAL REFRESH
                    }

                } catch (err) {
                    closeModal();
                    openModal({ title: "Error", message: `Failed to leave team: ${err.message}`, showCancel: false });
                } finally {
                    setIsLeaving(false); // Reset loading state
                }
            }
        });
    };

    return (
        <AnimatedSection tag="div" delay={delay} className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:bg-dark-700/70">
            {/* Team Info */}
            <div className="flex items-center flex-grow w-full sm:w-auto">
                <img
                    src={team.logo_url || '/images/placeholder_team.png'} // Use logo_url
                    alt={`${team.name} logo`}
                    className="w-12 h-12 rounded-lg object-cover mr-4 border border-primary-500/30 flex-shrink-0"
                />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white">{team.name}</h3>
                    <p className="text-sm text-gray-400">{team.game}</p>
                    {/* Display 'Owner' role if applicable */}
                    {isOwner && <p className="text-xs text-yellow-400 mt-1">Role: Owner</p>}
                </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-row sm:flex-col lg:flex-row gap-2 w-full sm:w-auto justify-center sm:justify-end flex-shrink-0">
                <Link to={`/team/${team.id}`} className="btn-secondary text-xs px-3 py-1.5 flex items-center justify-center hover:bg-dark-600 flex-1 sm:flex-initial" title="View Team Page">
                    <Eye size={14} className="mr-1" /> View
                </Link>
                {/* Conditionally render Manage or Leave button (WITH BADGE) */}
                {isOwner ? (
                    <Link to={`/manage-team/${team.id}`} className="relative btn-primary text-xs px-3 py-1.5 flex items-center justify-center hover:bg-primary-700 flex-1 sm:flex-initial" title="Manage Team Settings">
                        <Settings size={14} className="mr-1" /> Manage
                        {hasPendingInvites && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                <span className="relative z-10">{team.pending_invites}</span>
                            </div>
                        )}
                    </Link>
                ) : (
                    // Show Leave button if user is authenticated but not the owner
                    authUser && (
                         <button
                            onClick={handleLeaveTeam}
                            disabled={isLeaving}
                            className="btn-danger text-xs px-3 py-1.5 flex items-center justify-center hover:bg-red-700 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Leave Team">
                             {isLeaving ? <Loader2 className="animate-spin h-4 w-4 mr-1"/> : <LogOut size={14} className="mr-1 rotate-180" />}
                             {isLeaving ? 'Leaving...' : 'Leave'}
                        </button>
                    )
                )}
            </div>
        </AnimatedSection>
    );
};

// --- CreateTeamForm Component ---
const CreateTeamForm = ({ onClose, onTeamCreated, openModal, closeModal }) => {
    const { user: authUser } = useAuth();
    const { triggerTeamUpdate } = useTeamUpdate(); 
    const availableGames = ['Free Fire', 'Farlight84', 'COD Warzone', 'Bloodstrike', 'Mobile Legends'].sort(); 
    const [teamName, setTeamName] = useState('');
    const [gameTitle, setGameTitle] = useState(availableGames[0]);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    let logoUrl = null;

     const handleFileChange = (e) => {
        setError(null);
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            if (!file.type.startsWith('image/')) { setError('Please select an image file (PNG, JPG, etc.).'); return; }
            setLogoFile(file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoFile(null);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!authUser) { setError("You must be logged in to create a team."); return; }
        setIsSubmitting(true);
        logoUrl = null;

        try {
            // Logo Upload
            if (logoFile) {
                const fileExt = logoFile.name.split('.').pop();
                const uniqueFileName = `${Date.now()}_${teamName.replace(/\s+/g, '_')}.${fileExt}`;
                const filePath = `${authUser.id}/${uniqueFileName}`;
                const bucketName = 'team-logos';

                const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, logoFile);
                if (uploadError) throw new Error(`Logo upload failed: ${uploadError.message}`);

                const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
                if (!urlData?.publicUrl) throw new Error("Could not get public URL for uploaded logo.");
                logoUrl = urlData.publicUrl;
            }

            // Insert Team Data
            const newTeamData = { name: teamName, game: gameTitle, logo_url: logoUrl, owner_id: authUser.id };
            const { data, error: insertError } = await supabase.from('teams').insert([newTeamData]).select().single();

            if (insertError) { 
                 if (insertError.message.includes('team_name_owner_unique')) { throw new Error(`You already have a team named "${teamName}".`); } 
                throw new Error(`Team creation failed: ${insertError.message}`); 
            }

            openModal({title: "Success!", message: `Team "${data.name}" created successfully!`, showCancel: false});
            if (logoPreview && logoUrl === logoPreview) URL.revokeObjectURL(logoPreview); 
            onTeamCreated(data); 
            triggerTeamUpdate(); 
            onClose(); 

        } catch (err) { 
            setError(err.message || "An unexpected error occurred."); 
        } finally { 
             setIsSubmitting(false); 
        }
    };

    // Cleanup object URL on unmount
    React.useEffect(() => { return () => { if (logoPreview) URL.revokeObjectURL(logoPreview); }; }, [logoPreview]);


    return (
        <AnimatedSection delay={0} className="p-6 bg-dark-800 rounded-xl border-2 border-primary-600 shadow-2xl relative text-white">
            <button onClick={onClose} disabled={isSubmitting} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors z-20 disabled:opacity-50" aria-label="Close form"> <X size={24} /> </button>
            <h2 className="text-3xl font-extrabold text-primary-400 mb-6 flex items-center"> <Edit3 className="mr-3" size={24} /> New Team Registration </h2>
            {error && ( <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start"> <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5"/> <span>{error}</span> </div> )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Name */}
                <div> <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"> <Users size={16} className="mr-2 text-primary-400" /> Team Name </label> <input type="text" id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="e.g., Cyber Ninjas, Alpha Squad" required disabled={isSubmitting} className="input-field w-full p-3 placeholder-gray-500 disabled:opacity-60"/> </div>
                {/* Game Title */}
                <div> <label htmlFor="gameTitle" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"> <Gamepad2 size={16} className="mr-2 text-primary-400" /> Primary Game Title </label> <select id="gameTitle" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} required disabled={isSubmitting} className="input-field w-full p-3 placeholder-gray-500 appearance-none disabled:opacity-60"> {availableGames.map(game => ( <option key={game} value={game}> {game} </option> ))} </select> </div>
                {/* Team Logo */}
                <div> <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-2 flex items-center"> <Image size={16} className="mr-2 text-primary-400" /> Team Logo (Optional) </label> <input type="file" id="logo" accept="image/*,.png,.jpg,.jpeg,.webp" onChange={handleFileChange} disabled={isSubmitting} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600/20 file:text-primary-300 hover:file:bg-primary-600/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"/> {logoPreview && ( <div className="mt-4 flex items-center"> <img src={logoPreview} alt="Logo Preview" className="w-16 h-16 rounded-lg object-cover border-2 border-primary-500" /> <span className="ml-4 text-sm text-gray-400">Logo preview ready.</span> </div> )} </div>
                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3 px-4 rounded-lg flex items-center justify-center text-lg transition-colors mt-8 disabled:opacity-60 disabled:cursor-not-allowed"> {isSubmitting ? ( <> <Loader2 className="animate-spin h-5 w-5 mr-3"/> Registering... </> ) : ( <> <PlusCircle className="mr-2" size={18} /> Register Team </> )} </button>
            </form>
        </AnimatedSection>
    );
};

// --- Invite Item Component ---
const InviteItem = ({ invite, onAccept, onDecline, openModal, closeModal }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAccept = () => {
        openModal({
            title: `Accept Invite`,
            message: `Do you want to join ${invite.teams?.name}? You will be added to the team roster immediately.`,
            confirmText: 'Accept Join',
            showCancel: true,
            onConfirm: async () => {
                setIsProcessing(true);
                await onAccept(invite.id, invite.teams?.id, invite.invited_user_id); // The onAccept handles closing the modal and resetting state globally
                setIsProcessing(false);
            }
        });
    };

    const handleDecline = () => {
        openModal({
            title: `Decline Invite`,
            message: `Are you sure you want to decline the invitation to join ${invite.teams?.name}?`,
            confirmText: 'Decline Invite',
            showCancel: true,
            onConfirm: async () => {
                setIsProcessing(true);
                await onDecline(invite.id); // The onDecline handles closing the modal and resetting state globally
                setIsProcessing(false);
            }
        });
    };

    return (
        <AnimatedSection
            tag="div"
            className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
            {/* Invite Info */}
            <div className="flex items-center flex-grow w-full sm:w-auto">
                 <Mail className="w-10 h-10 text-primary-400 mr-4 flex-shrink-0 bg-dark-700 p-2 rounded-lg" />
                 <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white"> Invite to join {invite.teams?.name || 'a team'} </h3>
                    <p className="text-sm text-gray-400"> Game: {invite.teams?.game || 'N/A'} </p>
                    <p className="text-xs text-gray-500"> Invited by: {invite.inviter?.username || 'Unknown'} </p>
                    <p className="text-xs text-gray-500"> Received: {new Date(invite.created_at).toLocaleDateString()} </p>
                 </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 w-full sm:w-auto justify-end flex-shrink-0">
                 <button onClick={handleDecline} disabled={isProcessing} className="btn-danger btn-sm flex items-center justify-center px-4 py-2 disabled:opacity-50" title="Decline Invite"> {isProcessing ? <Loader2 className="animate-spin h-4 w-4"/> : <XCircleIcon size={16} />} <span className="ml-1.5">Decline</span> </button>
                 <button onClick={handleAccept} disabled={isProcessing} className="btn-success btn-sm flex items-center justify-center px-4 py-2 disabled:opacity-50" title="Accept Invite"> {isProcessing ? <Loader2 className="animate-spin h-4 w-4"/> : <CheckIcon size={16} />} <span className="ml-1.5">Accept</span> </button>
            </div>
        </AnimatedSection>
    );
};


// --- TeamsManagementPage Component ---
export default function TeamsManagementPage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const { teamUpdateKey, triggerTeamUpdate } = useTeamUpdate(); 
    const [isCreating, setIsCreating] = useState(false);
    const [userTeamsList, setUserTeamsList] = useState([]);
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [fetchTeamsError, setFetchTeamsError] = useState(null);
    const [invites, setInvites] = useState([]);
    const [loadingInvites, setLoadingInvites] = useState(true);
    const [fetchInvitesError, setFetchInvitesError] = useState(null);

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const openModal = (content) => { setModalContent(content); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setModalContent({}); };
    // --- END MODAL STATE ---


    // --- Fetch User's Owned AND Member Teams (MODIFIED FOR BADGE COUNT) ---
    const fetchUserTeams = async (userId) => {
        if (!userId) return; 
        setLoadingTeams(true);
        setFetchTeamsError(null);

        try {
            // 1. Fetch owned teams and members
            const { data: ownedTeamsData, error: ownedError } = await supabase.from('teams').select('*').eq('owner_id', userId);
            if (ownedError) throw ownedError;

            const { data: memberEntries, error: memberError } = await supabase.from('team_members').select('team_id').eq('user_id', userId);
            if (memberError) throw memberError;

            // 2. Process owned teams and count pending invites for each
            let ownedTeams = ownedTeamsData || [];
            if (ownedTeams.length > 0) {
                // Fetch pending invite count for ALL owned teams in one query
                const ownedTeamIds = ownedTeams.map(t => t.id);
                const { data: inviteCounts } = await supabase
                    .from('team_invites')
                    .select('team_id', { count: 'exact' })
                    .in('team_id', ownedTeamIds)
                    .eq('status', 'pending');

                const countsMap = (inviteCounts || []).reduce((acc, curr) => {
                    acc[curr.team_id] = curr.count;
                    return acc;
                }, {});

                ownedTeams = ownedTeams.map(team => ({
                    ...team,
                    // Attach the pending invite count to the team object
                    pending_invites: countsMap[team.id] || 0
                }));
            }

            // 3. Process member teams (no badge needed for member teams)
            const memberTeamIds = memberEntries?.map(entry => entry.team_id) || [];
            let memberTeams = [];
            const ownedTeamIds = ownedTeams.map(t => t.id);
            const uniqueMemberTeamIds = memberTeamIds.filter(id => !ownedTeamIds.includes(id));
            if (uniqueMemberTeamIds.length > 0) {
                 const { data: fetchedMemberTeams, error: memberTeamsError } = await supabase.from('teams').select('*').in('id', uniqueMemberTeamIds);
                 if (memberTeamsError) throw memberTeamsError;
                 memberTeams = fetchedMemberTeams || [];
            }

            const combinedTeams = [...ownedTeams, ...memberTeams.map(t => ({...t, pending_invites: 0}))];
            const uniqueTeams = Array.from(new Map(combinedTeams.map(team => [team.id, team])).values());
            uniqueTeams.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 

            setUserTeamsList(uniqueTeams); 

        } catch (err) {
            console.error("Error fetching teams:", err.message);
            setFetchTeamsError(`Failed to load your teams: ${err.message}`);
            setUserTeamsList([]);
        } finally {
            setLoadingTeams(false);
        }
    };

    // --- useEffect for fetching teams (Now depends on teamUpdateKey) ---
    useEffect(() => {
        let isMounted = true;
        if (!authLoading && authUser) {
            fetchUserTeams(authUser.id); // Call fetch function
        } else if (!authLoading && !authUser) {
             setUserTeamsList([]); setLoadingTeams(false);
        }
        return () => { isMounted = false; }; // Cleanup on unmount
    }, [authUser, authLoading, teamUpdateKey]); // <<< Added teamUpdateKey dependency

    // --- Fetch Pending Invites (UNMODIFIED) ---
    useEffect(() => {
        let isMounted = true;
        if (!authLoading && authUser) {
            const fetchInvites = async () => {
                if (!isMounted) return;
                setLoadingInvites(true); setFetchInvitesError(null);
                try {
                    const { data, error } = await supabase
                        .from('team_invites')
                        .select(`*, teams ( name, game, logo_url ), inviter:profiles!inviter_user_id ( username )`)
                        .eq('invited_user_id', authUser.id)
                        .eq('status', 'pending')
                        .order('created_at', { ascending: true });
                    if (error) throw error;
                    if (isMounted) { setInvites(data || []); }
                } catch (err) {
                    if (isMounted) setFetchInvitesError(`Failed to load invites: ${err.message}`);
                } finally { if (isMounted) setLoadingInvites(false); }
            };
            fetchInvites();
        } else if (!authLoading && !authUser) {
             setInvites([]); setLoadingInvites(false);
        }
        return () => { isMounted = false; };
    }, [authUser, authLoading]);

    // --- Add New Team Locally ---
    const handleTeamCreated = (newTeam) => { 
        setUserTeamsList(prevTeams => [newTeam, ...prevTeams].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))); 
    };

    // --- Invite Action Handlers (MODIFIED: Integrates modal feedback) ---
    const handleAcceptInvite = async (inviteId, teamId, userId) => {
        setFetchInvitesError(null);
        try {
            // Call the Supabase RPC function (assumes you have deployed the 'accept_team_invite' RPC)
            const { error: rpcError } = await supabase.rpc('accept_team_invite', { 
                invite_id_to_accept: inviteId 
            });
            if (rpcError) { 
                if (rpcError.message.includes('Invite not found')) { throw new Error("This invite is no longer valid."); } 
                throw rpcError; 
            }

            // UI Update on Success
            setInvites(prev => prev.filter(inv => inv.id !== inviteId)); 
            closeModal();
            openModal({title: "Success!", message: "Invitation accepted. Welcome to the team!", showCancel: false});

            if(authUser) await fetchUserTeams(authUser.id);
            triggerTeamUpdate(); 

        } catch (err) { 
            closeModal();
            openModal({title: "Acceptance Failed", message: `Error: ${err.message}`, showCancel: false, title: "Error"});
        }
    };

    const handleDeclineInvite = async (inviteId) => { 
        setFetchInvitesError(null);
        try {
            // Delete the invite row
            const { error } = await supabase.from('team_invites').delete().eq('id', inviteId); 
            if (error) throw error; 

            // UI Update on Success
            setInvites(prev => prev.filter(inv => inv.id !== inviteId)); 
            closeModal();
            openModal({title: "Declined", message: "The invitation has been declined.", showCancel: false});

        } catch (err) { 
            closeModal();
            openModal({title: "Decline Failed", message: `Error: ${err.message}`, showCancel: false, title: "Error"});
        }
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="space-y-10 p-4 sm:p-6 lg:p-8">

                {/* --- RENDER MODAL --- */}
                <CustomModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={modalContent.title}
                    confirmText={modalContent.confirmText}
                    onConfirm={modalContent.onConfirm}
                    showCancel={modalContent.showCancel}
                    isLoading={false} // Use false or manage loading state within the modal's context if necessary
                >
                    {modalContent.message}
                </CustomModal>


                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 flex items-center justify-center mb-2"> <Users className="w-8 h-8 mr-3" /> Team Management Hub </h1>
                    <p className="text-center text-gray-400"> Manage your squads, create new teams, respond to invites, and view performance. </p>
                </AnimatedSection>

                {/* --- Pending Invites Section --- */}
                {!isCreating && (
                    <AnimatedSection delay={150}>
                        <h2 className="text-2xl font-bold mb-4 text-yellow-400 border-b border-yellow-700/50 pb-2 flex items-center">
                            <Mail size={22} className="mr-3"/> Pending Invitations ({loadingInvites ? '...' : invites.length})
                        </h2>
                        {loadingInvites && ( <div className="flex justify-center items-center py-6"> <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" /> <p className="ml-3 text-gray-400">Loading invites...</p> </div> )}
                        {!loadingInvites && fetchInvitesError && ( <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/50 text-center text-red-300"> <p>{fetchInvitesError}</p> </div> )}
                        {!loadingInvites && !fetchInvitesError && (
                             <div className="space-y-4">
                                {invites.length > 0 ? (
                                    invites.map((invite) => (
                                        <InviteItem 
                                            key={invite.id} 
                                            invite={invite} 
                                            onAccept={handleAcceptInvite} 
                                            onDecline={handleDeclineInvite}
                                            openModal={openModal}
                                            closeModal={closeModal}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-dark-800 p-6 rounded-xl text-center border border-dark-700"> <Mail className="w-8 h-8 mx-auto text-gray-500 mb-3" /> <p className="text-gray-500">You have no pending team invitations.</p> </div>
                                )}
                             </div>
                        )}
                    </AnimatedSection>
                )}

                {/* --- Action Card: Create New Team --- */}
                 {!isCreating && (
                    <div onClick={() => setIsCreating(true)} className="cursor-pointer">
                        <AnimatedSection delay={100} className="bg-gradient-to-r from-primary-700/30 to-dark-800/50 p-6 rounded-xl border border-primary-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between transition-transform hover:scale-[1.01]">
                             <div className='mb-4 sm:mb-0'>
                                <div className="flex items-center mb-2"> <PlusCircle className="w-6 h-6 mr-3 text-primary-300" /> <h2 className="text-2xl font-bold text-white">Create a New Team</h2> </div>
                                <p className="text-gray-300 max-w-lg">Start your own legacy. Assemble your squad today!</p>
                             </div>
                             <div className="btn-primary font-semibold py-2 px-4 rounded-lg text-sm flex items-center w-full sm:w-fit justify-center pointer-events-none"> Create Team <PlusCircle size={16} className="ml-2" /> </div>
                        </AnimatedSection>
                    </div>
                )}

                {/* --- Conditional Form Display --- */}
                {isCreating && ( 
                    <CreateTeamForm 
                        onClose={() => setIsCreating(false)} 
                        onTeamCreated={handleTeamCreated} 
                        openModal={openModal}
                        closeModal={closeModal}
                    /> 
                )}

                {/* --- Your Teams List (Hidden when creating) --- */}
                {!isCreating && (
                    <AnimatedSection delay={200}>
                        <h2 className="text-2xl font-bold mb-4 text-primary-400 border-b border-dark-700 pb-2"> Your Active Teams ({loadingTeams ? '...' : userTeamsList.length}) </h2>
                        {loadingTeams && ( <div className="flex justify-center items-center py-10"> <Loader2 className="w-8 h-8 text-primary-400 animate-spin" /> <p className="ml-3 text-gray-400">Loading your teams...</p> </div> )}
                        {!loadingTeams && fetchTeamsError && ( <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/50 text-center text-red-300"> <p>{fetchTeamsError}</p> </div> )}
                        {!loadingTeams && !fetchTeamsError && (
                            <div className="space-y-4">
                                {userTeamsList.length > 0 ? (
                                    userTeamsList.map((team, index) => (
                                        <TeamListItem
                                            key={team.id}
                                            team={team}
                                            delay={index * 50}
                                            authUser={authUser} // Pass authUser
                                            refreshTeams={fetchUserTeams} // Pass refresh function
                                            openModal={openModal}
                                            closeModal={closeModal}
                                        />
                                    ))
                                ) : (
                                    <div className="bg-dark-800 p-6 rounded-xl text-center border border-yellow-700/50"> <Eye className="w-6 h-6 mx-auto text-yellow-500 mb-3" /> <p className="text-yellow-300"> You haven't created or joined any teams yet. </p> </div>
                                )}
                            </div>
                        )}
                    </AnimatedSection>
                )}

                {/* Link to Team Directory */}
                <AnimatedSection delay={isCreating ? 200 : 500} className="text-center pt-4">
                    <Link to="/players?view=teams" className="text-gray-400 hover:text-primary-400 flex items-center justify-center text-sm font-medium"> Looking for other teams? Go to the Team Directory Search <ArrowRight size={16} className="ml-1" /> </Link>
                </AnimatedSection>
            </div>
        </div>
    );
}