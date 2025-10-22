// src/pages/ManageTeamPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
    Settings, Users, Edit3, Trash2, Shield, PlusCircle, ArrowLeft, Save, XCircle, UserX, UserCheck,
    Loader2, AlertCircle, MapPin, Image, UploadCloud, Check, ChevronDown, ImagePlus // Added ImagePlus
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

// --- Constants ---
const africanCountries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
  "Congo, Democratic Republic of the", "Congo, Republic of the", "Cote d'Ivoire",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia",
  "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho",
  "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius",
  "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",
  "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia",
  "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia",
  "Uganda", "Zambia", "Zimbabwe"
].sort();
const availableGames = ['Free Fire', 'Farlight84', 'COD Warzone', 'Bloodstrike', 'Mobile Legends'].sort();
const possibleRoles = ['Captain', 'Co-Captain', 'Member', 'Substitute'];

// --- Helper: Roster Member Item ---
const RosterItem = ({ member, isOwner, onKick, onChangeRole, authUser }) => {
    // Handler for role change selection
    const handleRoleSave = (newRole) => {
        console.log(`Changing role for ${member.profiles?.username} to ${newRole}`);
        onChangeRole(member.user_id, newRole); // Call parent handler
    };

    // Handler for kick button confirmation
    const handleKick = () => {
        if (window.confirm(`Are you sure you want to remove ${member.profiles?.username || 'this user'} from the team?`)) {
            onKick(member.user_id); // Call parent handler
        }
    };

    return (
        <div className="bg-dark-700 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border border-dark-600">
            <div className="flex items-center flex-grow w-full sm:w-auto">
                 <img
                    src={member.profiles?.avatar_url || '/images/placeholder_player.png'} // Use fetched avatar
                    alt={member.profiles?.username || 'User Avatar'}
                    className="w-10 h-10 rounded-full mr-3 border border-dark-500 flex-shrink-0 object-cover"
                 />
                 <div>
                     <p className="font-semibold text-white">{member.profiles?.username || 'Loading...'}</p>
                     <p className="text-sm text-primary-400">{member.role}</p>
                     <p className="text-xs text-gray-500">Joined: {new Date(member.joined_at).toLocaleDateString()}</p>
                 </div>
            </div>
            {/* Show controls only if owner AND not viewing self */}
            {isOwner && authUser?.id !== member.user_id && (
                 <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                    {/* Role Selection Dropdown */}
                    <select
                         value={member.role}
                         onChange={(e) => handleRoleSave(e.target.value)}
                         className="input-field input-field-sm !py-1 !px-2 appearance-none text-xs w-auto bg-dark-600 border-dark-500" // Basic select styling
                     >
                         {possibleRoles.map(role => ( <option key={role} value={role}>{role}</option> ))}
                     </select>
                     {/* Kick Button */}
                    <button onClick={handleKick} className="btn-danger btn-xs flex items-center" title="Remove Member">
                        <UserX size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Kick</span>
                    </button>
                 </div>
            )}
        </div>
    );
};

// --- ManageTeamPage Component ---
export default function ManageTeamPage() {
    const { teamId } = useParams(); // Get team ID from URL
    const navigate = useNavigate();
    const { user: authUser, loading: authLoading } = useAuth(); // Get current user

    // State variables
    const [teamData, setTeamData] = useState(null); // Original fetched team data
    const [formData, setFormData] = useState({ // Data for the edit form
        name: '', game: availableGames[0], description: '', country: '', city: '',
        logo_url: '/images/placeholder_team.png', banner_url: '/images/lan_9.jpg' 
     });
    const [logoPreview, setLogoPreview] = useState('/images/placeholder_team.png'); // URL for logo preview
    const [logoFile, setLogoFile] = useState(null); // New logo file object
    const [bannerPreview, setBannerPreview] = useState('/images/lan_9.jpg'); // Banner preview
    const [bannerFile, setBannerFile] = useState(null); // New banner file object
    const [members, setMembers] = useState([]); // List of team members
    const [loading, setLoading] = useState(true); // Page loading state
    const [isSaving, setIsSaving] = useState(false); // Form saving state (used for save and delete)
    const [error, setError] = useState(null); // General error messages
    const [successMessage, setSuccessMessage] = useState(''); // Success messages
    const [isOwner, setIsOwner] = useState(false); // Is current user the owner?
    const [inviteUsername, setInviteUsername] = useState(''); // Input for inviting members
    const [inviteLoading, setInviteLoading] = useState(false); // Invite loading state

    // --- Fetch Team Data and Members ---
    useEffect(() => {
        let isMounted = true; // Prevent state updates if component unmounts
        const fetchData = async () => {
             // Wait for auth check and teamId
             if (!teamId || authLoading) return;
             // Redirect if not logged in after auth check
             if (!authUser) { if(isMounted) { setLoading(false); navigate('/login'); } return; }

            if(isMounted) setLoading(true);
            if(isMounted) setError(null);
            console.log(`ManageTeamPage: Fetching team ${teamId} & members for user ${authUser.id}`);

            try {
                // Fetch team details
                const { data: teamResult, error: teamError } = await supabase.from('teams').select('*').eq('id', teamId).single();
                if (teamError) throw teamError;
                if (!teamResult) throw new Error(`Team with ID ${teamId} not found.`);

                if (!isMounted) return; // Exit if component unmounted during fetch
                console.log("Fetched team data:", teamResult);
                setTeamData(teamResult);

                // Check ownership
                const ownerCheck = teamResult.owner_id === authUser.id;
                setIsOwner(ownerCheck);
                if (!ownerCheck) console.warn("User is not the owner.");

                // Initialize form with fetched data
                setFormData({
                    name: teamResult.name || '', game: teamResult.game || availableGames[0], description: teamResult.description || '',
                    country: teamResult.country || '', city: teamResult.city || '', 
                    logo_url: teamResult.logo_url || '/images/placeholder_team.png',
                    banner_url: teamResult.banner_url || '/images/lan_9.jpg' 
                });
                setLogoPreview(teamResult.logo_url || '/images/placeholder_team.png');
                setBannerPreview(teamResult.banner_url || '/images/lan_9.jpg'); 

                // Fetch members with profile details
                console.log("Fetching members for team:", teamId);
                const { data: membersResult, error: membersError } = await supabase
                    .from('team_members').select(`*, profiles ( username, avatar_url )`).eq('team_id', teamId).order('joined_at');
                if (membersError) throw membersError;

                if (isMounted) {
                    console.log("Fetched members:", membersResult);
                    setMembers(membersResult || []);
                }

            } catch (err) {
                console.error("Error fetching data:", err.message);
                if (isMounted) {
                    setError(`Failed to load team data: ${err.message}`);
                    setTeamData(null); setMembers([]); setIsOwner(false);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false }; // Cleanup function
    }, [teamId, authUser, authLoading, navigate]);

    // --- File Input Handlers ---
    const handleChange = (e) => { setError(null); setSuccessMessage(''); const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    // Handler for Logo file change
    const handleLogoFileChange = (e) => {
        setError(null); setSuccessMessage('');
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Logo must be an image file.'); return; }

        setLogoFile(file);
        if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
        const newPreview = URL.createObjectURL(file);
        setLogoPreview(newPreview);
        setFormData(prev => ({ ...prev, logo_url: newPreview }));
    };

    // Handler for Banner file change
    const handleBannerFileChange = (e) => {
        setError(null); setSuccessMessage('');
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Banner must be an image file.'); return; }

        setBannerFile(file);
        if (bannerPreview && bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        const newPreview = URL.createObjectURL(file);
        setBannerPreview(newPreview);
        setFormData(prev => ({ ...prev, banner_url: newPreview }));
    };

    // --- File Upload Helper Function ---
    const uploadFile = async (file, currentUrl, fileType) => {
        if (!file) return currentUrl; 

        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${fileType}_${Date.now()}_${teamData.name.replace(/\s+/g, '_')}.${fileExt}`;
        const filePath = `${teamData.id}/${uniqueFileName}`; 
        const bucketName = 'team-assets'; // Must match your Supabase bucket name

        console.log(`Uploading new ${fileType}:`, filePath);

        const { data, error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { 
             cacheControl: '3600', 
             upsert: true 
        });

        if (uploadError) {
             throw new Error(`${fileType} upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (!urlData?.publicUrl) throw new Error(`Could not get public URL for new ${fileType}.`);

        return urlData.publicUrl;
    };


    // --- Save Team Details Handler ---
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!isOwner || !teamData) return;
        setIsSaving(true); setError(null); setSuccessMessage('');

        let finalLogoUrl = teamData?.logo_url;
        let finalBannerUrl = teamData?.banner_url; 

        try {
            // 1. Handle Logo Upload
            finalLogoUrl = await uploadFile(logoFile, teamData?.logo_url, 'logo');

            // 2. Handle Banner Upload
            finalBannerUrl = await uploadFile(bannerFile, teamData?.banner_url, 'banner');


            // 3. Prepare and Execute Database Update
            const updates = {
                name: formData.name, game: formData.game, description: formData.description || null,
                country: formData.country || null, city: formData.city || null, 
                logo_url: finalLogoUrl,
                banner_url: finalBannerUrl, 
            };
            console.log('Updating team with:', updates);

            const { error: updateError } = await supabase.from('teams').update(updates).eq('id', teamId);
            if (updateError) {
                 if (updateError.message.includes('team_name_owner_unique')) { throw new Error(`You already have a team named "${formData.name}".`); }
                throw new Error(`Failed to update team: ${updateError.message}`);
            }

            // 4. Update local state on success and clear files
            setTeamData(prev => ({ ...prev, ...updates }));
            setFormData(prev => ({ ...prev, logo_url: finalLogoUrl, banner_url: finalBannerUrl }));
            setLogoPreview(finalLogoUrl || '/images/placeholder_team.png');
            setBannerPreview(finalBannerUrl || '/images/lan_9.jpg'); 
            setLogoFile(null); 
            setBannerFile(null); 
            setSuccessMessage('Team profile updated successfully!');

        } catch (err) {
            console.error("Save Error:", err);
            setError(err.message || "An unexpected error occurred during save.");
             // Revert previews on error
             setLogoPreview(teamData?.logo_url || '/images/placeholder_team.png');
             setBannerPreview(teamData?.banner_url || '/images/lan_9.jpg');
        } finally {
            setIsSaving(false);
        }
    };

    // --- Delete Team Handler ---
    const handleDeleteTeam = async () => {
        if (!isOwner || isSaving) return;

        const confirmName = prompt(`To permanently delete the team "${teamData.name}", please type the team name exactly as shown below:`);

        if (confirmName !== teamData.name) {
             alert("Team name confirmation failed. Deletion cancelled.");
             return;
        }

        setIsSaving(true); 
        setError(null);

        try {
            console.log(`ATTEMPTING TO DELETE TEAM ${teamId}`);

            // 1. Delete the team record (assumes CASCADE DELETE on foreign keys)
            const { error: deleteTeamError } = await supabase
                .from('teams')
                .delete()
                .eq('id', teamId);

            if (deleteTeamError) throw new Error(`Database error during team deletion: ${deleteTeamError.message}`);

            // 2. Delete storage folder for team assets
            const bucketName = 'team-assets';
            const { data: files, error: listError } = await supabase.storage.from(bucketName).list(teamId);

            if (!listError && files.length > 0) {
                 const filePaths = files.map(file => `${teamId}/${file.name}`);
                 const { error: deleteFilesError } = await supabase.storage.from(bucketName).remove(filePaths);
                 if (deleteFilesError) console.warn(`Failed to delete storage files for team ${teamId}: ${deleteFilesError.message}`);
            }

            alert(`Team "${teamData.name}" has been permanently deleted.`);
            navigate('/my-teams'); 

        } catch (err) {
            console.error("Delete Error:", err);
            setError(err.message || "An unexpected error occurred during team deletion.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Roster Action Handlers (Kept the same) ---
    const handleKickMember = async (userIdToKick) => {
        if (!isOwner) return; setError(null);
        console.log(`Kicking user ${userIdToKick}`);
        try {
            const { error } = await supabase.from('team_members').delete().eq('team_id', teamId).eq('user_id', userIdToKick);
            if (error) throw error;
            setMembers(prev => prev.filter(m => m.user_id !== userIdToKick));
            alert('Member removed.');
        } catch (err) { setError(`Failed to remove member: ${err.message}`); }
    };

    const handleChangeMemberRole = async (userIdToChange, newRole) => {
        if (!isOwner) return; setError(null);
        console.log(`Changing ${userIdToChange} to ${newRole}`);
        const originalMembers = [...members];
        setMembers(prev => prev.map(m => m.user_id === userIdToChange ? { ...m, role: newRole } : m));
        try {
            const { error } = await supabase.from('team_members').update({ role: newRole }).eq('team_id', teamId).eq('user_id', userIdToChange);
            if (error) throw error;
            console.log("Role updated.");
        } catch (err) { setError(`Failed to change role: ${err.message}`); setMembers(originalMembers); }
    };

    const handleInviteMember = async (e) => {
         e.preventDefault(); if (!isOwner || !inviteUsername.trim()) return;
         console.log(`Inviting user "${inviteUsername}"`);
         setInviteLoading(true); setError(null);
         try {
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('id').eq('username', inviteUsername.trim()).single();
            if (profileError || !profileData) throw new Error(`User "${inviteUsername.trim()}" not found.`);
            const userIdToInvite = profileData.id;
             if (userIdToInvite === authUser.id) throw new Error("You cannot invite yourself.");
             if (members.some(m => m.user_id === userIdToInvite)) throw new Error(`User is already in team.`);

            console.log(`Inviting user ID ${userIdToInvite} by ${authUser.id} to team ${teamId}`);
            const { error: inviteError } = await supabase.from('team_invites').insert({ team_id: teamId, invited_user_id: userIdToInvite, inviter_user_id: authUser.id, status: 'pending' });
            if (inviteError) {
                 if (inviteError.code === '23505') throw new Error(`An invite for "${inviteUsername.trim()}" is already pending.`);
                 throw inviteError;
             }

             alert(`Invite sent successfully to ${inviteUsername.trim()}!`);
             setInviteUsername('');
         } catch (err) { setError(`${err.message}`); } finally { setInviteLoading(false); }
    };

    // --- Loading/Error/Permission Render ---
     if (loading || authLoading) { return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl text-gray-400">Loading Team Management...</p> </div> ); }
     if (!authUser) return <Navigate to="/login" replace />;
     if ((!loading && error && !teamData) || (!loading && teamData && !isOwner)) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">Access Denied or Error</h2> <p className="text-gray-400">{error || "You do not have permission to manage this team."}</p> <Link to={teamId ? `/team/${teamId}` : '/my-teams'} className="mt-6 btn-secondary"> Back </Link> </div> );
     }
     if (!loading && !teamData) {
         return <div className="text-center text-gray-400 mt-10">Team with ID {teamId} not found.</div>;
     }

    // --- Render Management Page ---
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

                <AnimatedSection delay={0}>
                     <Link to={`/team/${teamId}`} className="text-primary-400 hover:text-primary-300 flex items-center mb-4 text-sm group w-fit"> <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Team Profile </Link>
                </AnimatedSection>

                {/* Inline Error Display (for non-critical errors after load) */}
                 {error && !loading && !isSaving && ( <AnimatedSection delay={50} className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start"> <AlertCircle size={18} className="mr-3 flex-shrink-0 mt-0.5"/> <span>{error}</span> </AnimatedSection> )}

                {/* Main Edit Form Card */}
                 <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-2xl" delay={100}>
                     <form onSubmit={handleSaveChanges} className="space-y-8">
                         {/* Header */}
                         <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-dark-700 pb-4">
                             <h1 className="text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"> <Settings className="mr-3" size={28} /> Manage Team: {teamData.name} </h1>
                              {isOwner && ( <button type="submit" className="btn-primary flex items-center justify-center text-sm py-2 px-4" disabled={isSaving}> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="mr-1.5" size={16} />} {isSaving ? 'Saving...' : 'Save Changes'} </button> )}
                         </div>
                         {/* Success Message */}
                         {successMessage && isOwner && ( <div className="p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">{successMessage}</div> )}

                         {/* Logo Section */}
                          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6">
                              <img src={logoPreview} alt="Team Logo Preview" className="w-24 h-24 object-cover rounded-full border-2 border-primary-500 flex-shrink-0 bg-dark-700" />
                              {isOwner && ( <div className="flex-1 w-full sm:w-auto"> <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-2">Change Team Logo</label> <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoFileChange} disabled={isSaving} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600/20 file:text-primary-300 hover:file:bg-primary-600/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"/> {logoFile && <p className="text-xs text-green-400 mt-1">New logo selected. Save changes to upload.</p>} </div> )}
                          </div>

                          {/* Banner Section */}
                           <div className="pt-6 border-t border-dark-700">
                                <label htmlFor="banner-upload" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <ImagePlus size={16} className="mr-2"/> Change Team Banner (16:9 aspect ratio recommended)
                                </label>
                                <div className="relative w-full h-32 md:h-48 overflow-hidden rounded-lg mb-4 border-2 border-dark-700 bg-dark-700">
                                    <img src={bannerPreview} alt="Team Banner Preview" className="w-full h-full object-cover opacity-50"/>
                                    {/* File Input Overlay */}
                                    <input type="file" id="banner-upload" accept="image/*" onChange={handleBannerFileChange} disabled={isSaving} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"/>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
                                         <UploadCloud size={24} className="mb-1"/>
                                         <span className="text-xs">{bannerFile ? 'New banner selected' : 'Click to upload banner'}</span>
                                         {bannerFile && <Check size={16} className="text-green-400 mt-1"/>}
                                    </div>
                                </div>
                                {bannerFile && isOwner && <p className="text-xs text-green-400">New banner selected. Save changes to upload.</p>}
                           </div>

                         {/* Editable Fields */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 border-t border-dark-700">
                              <div><label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Team Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-field" required disabled={!isOwner || isSaving} /></div>
                              <div><label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-1.5">Primary Game</label><select id="game" name="game" value={formData.game} onChange={handleChange} className="input-field appearance-none" required disabled={!isOwner || isSaving}>{availableGames.map(g => (<option key={g} value={g}>{g}</option>))}</select></div>
                              <div><label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1.5">Country</label><select id="country" name="country" value={formData.country} onChange={handleChange} className="input-field appearance-none" disabled={!isOwner || isSaving}><option value="">Select Country</option>{africanCountries.map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
                              <div><label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1.5">City</label><input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="input-field" disabled={!isOwner || isSaving} /></div>
                              <div className="md:col-span-2"><label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1.5">Team Description</label><textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="input-field resize-none" disabled={!isOwner || isSaving} /></div>
                         </div>
                          {isOwner && ( <div className="flex justify-end pt-6 border-t border-dark-700"> <button type="submit" className="btn-primary flex items-center justify-center text-sm py-2 px-4" disabled={isSaving}> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="mr-1.5" size={16} />} {isSaving ? 'Saving...' : 'Save Changes'} </button> </div> )}
                     </form>
                 </AnimatedSection>

                {/* --- Roster Management Section --- */}
                 <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-lg" delay={200}>
                     <h2 className="text-2xl font-bold mb-4 text-primary-300 flex items-center"><Users className="mr-3" /> Team Roster ({members.length})</h2>
                      {isOwner && (
                          <form onSubmit={handleInviteMember} className="mb-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600 flex flex-col sm:flex-row gap-3 items-end">
                              <div className="flex-grow w-full"> <label htmlFor="inviteUsername" className="block text-sm font-medium text-gray-300 mb-1.5">Invite by Username</label> <input type="text" id="inviteUsername" value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} className="input-field w-full" placeholder="Enter exact username" disabled={inviteLoading} required /> </div>
                              <button type="submit" className="btn-primary flex items-center w-full sm:w-auto flex-shrink-0" disabled={inviteLoading || !inviteUsername.trim()}> {inviteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <PlusCircle size={16} className="mr-2"/>} {inviteLoading ? 'Sending...' : 'Send Invite'} </button>
                          </form>
                      )}
                      {/* Display roster action errors here */}
                      {error && isOwner && !isSaving && ( <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start"> <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5"/> <span>{error}</span> </div> )}
                     <div className="space-y-3">
                         {members.length > 0 ? ( members.map((member, index) => ( <AnimatedSection key={member.user_id || index} delay={index * 50}> <RosterItem member={member} isOwner={isOwner} onKick={handleKickMember} onChangeRole={handleChangeMemberRole} authUser={authUser}/> </AnimatedSection> )) ) : ( <p className="text-gray-500 italic text-center py-4">No members found yet. The owner is added automatically.</p> )}
                     </div>
                 </AnimatedSection>

                {/* --- Danger Zone --- */}
                {isOwner && (
                     <AnimatedSection tag="div" className="card border border-red-700 bg-red-900/20 mt-10 p-6" delay={300}>
                         <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
                         <p className="text-gray-300 mb-4">Permanently dissolve the team. This action cannot be undone and all team data (members, invites, matches) will be deleted.</p>
                         <button onClick={handleDeleteTeam} className="btn-danger w-fit flex items-center" disabled={isSaving}> 
                            {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Trash2 className="mr-2" size={16} />} 
                            {isSaving ? 'Deleting...' : 'Delete Team Profile'} 
                         </button>
                     </AnimatedSection>
                 )}
            </div>
        </div>
    );
}