// src/pages/ManageTeamPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext.jsx';
// Icons needed for this version
import {
    Settings, Users, Edit3, Trash2, Shield, PlusCircle, ArrowLeft, Save, XCircle, UserX, UserCheck,
    Loader2, AlertCircle, MapPin, Image, UploadCloud, Check, ChevronDown, ImagePlus
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

    // --- State variables ---
    const [teamData, setTeamData] = useState(null);
    const [formData, setFormData] = useState({
        name: '', game: availableGames[0], description: '', country: '', city: '',
        logo_url: '/images/placeholder_team.png', banner_url: '/images/lan_9.jpg'
     });
    const [logoPreview, setLogoPreview] = useState('/images/placeholder_team.png');
    const [logoFile, setLogoFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('/images/lan_9.jpg');
    const [bannerFile, setBannerFile] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);

    // --- Fetch Team Data and Members useEffect ---
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            const numericTeamId = parseInt(teamId, 10); // Use parsed ID for fetches
            if (isNaN(numericTeamId)) { if(isMounted) { setError("Invalid Team ID"); setLoading(false); } return; }
            if (!authUser && !authLoading) { if(isMounted) { setLoading(false); navigate('/login'); } return; }
            if (!numericTeamId || authLoading) return;

            if(isMounted) { setLoading(true); setError(null); }
            console.log(`ManageTeamPage: Fetching team ${numericTeamId} & members for user ${authUser.id}`);

            try {
                // Fetch team details
                const { data: teamResult, error: teamError } = await supabase.from('teams').select('*').eq('id', numericTeamId).single();
                if (teamError) throw teamError;
                if (!teamResult) throw new Error(`Team with ID ${numericTeamId} not found.`);
                if (!isMounted) return;
                setTeamData(teamResult);

                // Check ownership
                const ownerCheck = teamResult.owner_id === authUser.id;
                setIsOwner(ownerCheck);
                // Set error and stop loading if not owner
                if (!ownerCheck && isMounted) {
                    setError("You do not have permission to manage this team.");
                    setLoading(false);
                    return;
                }

                // Initialize form
                setFormData({
                    name: teamResult.name || '', game: teamResult.game || availableGames[0], description: teamResult.description || '',
                    country: teamResult.country || '', city: teamResult.city || '',
                    logo_url: teamResult.logo_url || '/images/placeholder_team.png',
                    banner_url: teamResult.banner_url || '/images/lan_9.jpg'
                });
                setLogoPreview(teamResult.logo_url || '/images/placeholder_team.png');
                setBannerPreview(teamResult.banner_url || '/images/lan_9.jpg');

                // Fetch members
                console.log("Fetching members for team:", numericTeamId);
                const { data: membersResult, error: membersError } = await supabase
                    .from('team_members').select(`*, profiles!user_id ( username, avatar_url )`).eq('team_id', numericTeamId).order('joined_at'); // Use explicit join hint
                if (membersError) throw membersError;
                if (isMounted) setMembers(membersResult || []);

            } catch (err) {
                console.error("Error fetching data:", err.message);
                if (isMounted) {
                    setError(`Failed to load team data: ${err.message}`);
                    setTeamData(null); setMembers([]); setIsOwner(false); // Reset relevant state
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (authUser) fetchData();
        else if (!authLoading) navigate('/login'); // Redirect if auth loaded but no user

        return () => { isMounted = false }; // Cleanup function
    }, [teamId, authUser, authLoading, navigate]); // Dependencies

    // --- Blob URL Cleanup useEffect ---
    useEffect(() => {
        return () => {
            console.log("Cleanup: Revoking blob URLs if necessary");
            if (logoPreview && typeof logoPreview === 'string' && logoPreview.startsWith('blob:')) {
                console.log("Revoking logo blob:", logoPreview);
                URL.revokeObjectURL(logoPreview);
            }
            if (bannerPreview && typeof bannerPreview === 'string' && bannerPreview.startsWith('blob:')) {
                console.log("Revoking banner blob:", bannerPreview);
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [logoPreview, bannerPreview]); // Dependencies


    // --- File Input Handlers ---
    const handleChange = (e) => { setError(null); setSuccessMessage(''); const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleLogoFileChange = (e) => {
        setError(null); setSuccessMessage('');
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) { setLogoFile(null); return; }
        if (!file.type.startsWith('image/')) { setError('Logo must be an image file.'); return; }
        setLogoFile(file);
        if (logoPreview && typeof logoPreview === 'string' && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
        const newPreview = URL.createObjectURL(file);
        setLogoPreview(newPreview);
    };
    const handleBannerFileChange = (e) => {
        setError(null); setSuccessMessage('');
        const file = e.target.files ? e.target.files[0] : null;
         if (!file) { setBannerFile(null); return; }
        if (!file.type.startsWith('image/')) { setError('Banner must be an image file.'); return; }
        setBannerFile(file);
        if (bannerPreview && typeof bannerPreview === 'string' && bannerPreview.startsWith('blob:')) URL.revokeObjectURL(bannerPreview);
        const newPreview = URL.createObjectURL(file);
        setBannerPreview(newPreview);
    };

    // --- File Upload Helper Function ---
    const uploadFile = async (file, currentUrl, fileType, teamId, teamName) => {
        if (!file) return currentUrl;
        if (!teamId) throw new Error(`Team ID is missing for ${fileType}.`);
        const safeTeamName = teamName ? teamName.replace(/\s+/g, '_') : `team_${teamId}`;
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${fileType}_${Date.now()}_${safeTeamName}.${fileExt}`;
        const filePath = `${teamId}/${uniqueFileName}`;
        const bucketName = 'team-assets';
        console.log(`Uploading ${fileType} to: ${filePath}`);
        const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file, { cacheControl: '3600', upsert: true });
        if (uploadError) { console.error(`Upload error (${filePath}):`, uploadError); throw new Error(`${fileType} upload failed: ${uploadError.message}`); }
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (!urlData?.publicUrl) { console.warn(`Could not get public URL for ${filePath}.`); return filePath; }
        console.log(`Uploaded ${fileType}: ${urlData.publicUrl}`);
        return urlData.publicUrl;
    };


    // --- Save Team Details Handler ---
    const handleSaveChanges = async (e) => {
        e.preventDefault();
        if (!isOwner || !teamData || !teamData.id) { setError("Cannot save: Invalid team data or permissions."); return; }
        setIsSaving(true); setError(null); setSuccessMessage('');
        let finalLogoUrl = teamData.logo_url;
        let finalBannerUrl = teamData.banner_url;
        try {
            if (logoFile) finalLogoUrl = await uploadFile(logoFile, teamData.logo_url, 'logo', teamData.id, formData.name);
            if (bannerFile) finalBannerUrl = await uploadFile(bannerFile, teamData.banner_url, 'banner', teamData.id, formData.name);
            const updates = { name: formData.name, game: formData.game, description: formData.description || null, country: formData.country || null, city: formData.city || null, logo_url: finalLogoUrl, banner_url: finalBannerUrl };
            console.log('Updating team DB:', updates);
            const { error: updateError } = await supabase.from('teams').update(updates).eq('id', teamData.id); // Use teamData.id here
            if (updateError) { if (updateError.message.includes('unique constraint')) throw new Error(`Team name "${formData.name}" might already be taken.`); throw updateError; }
            setTeamData(prev => ({ ...prev, ...updates }));
            setFormData(prev => ({ ...prev, logo_url: finalLogoUrl, banner_url: finalBannerUrl }));
            setLogoPreview(finalLogoUrl || '/images/placeholder_team.png');
            setBannerPreview(finalBannerUrl || '/images/lan_9.jpg');
            setLogoFile(null); setBannerFile(null);
            setSuccessMessage('Team profile updated successfully!');
        } catch (err) { console.error("Save Error:", err); setError(err.message || "An unexpected error occurred."); setLogoPreview(teamData?.logo_url || '/images/placeholder_team.png'); setBannerPreview(teamData?.banner_url || '/images/lan_9.jpg'); setLogoFile(null); setBannerFile(null); }
        finally { setIsSaving(false); }
    };

    // --- Delete Team Handler ---
    const handleDeleteTeam = async () => {
        if (!isOwner || isSaving || !teamData) return;
        const confirmName = prompt(`Confirm deletion by typing the team name: "${teamData.name}"`);
        if (confirmName !== teamData.name) { alert("Confirmation failed."); return; }
        setIsSaving(true); setError(null);
        try {
            console.log(`Deleting team ${teamData.id}`); // Use teamData.id
            const { error: deleteTeamError } = await supabase.from('teams').delete().eq('id', teamData.id); // Use teamData.id
            if (deleteTeamError) throw deleteTeamError;
            try {
                const bucketName = 'team-assets';
                const teamIdStr = teamData.id.toString(); // Use teamData.id
                const { data: files } = await supabase.storage.from(bucketName).list(teamIdStr);
                if (files && files.length > 0) {
                    const filePaths = files.map(file => `${teamIdStr}/${file.name}`);
                    await supabase.storage.from(bucketName).remove(filePaths);
                    console.log(`Deleted storage for team ${teamIdStr}.`);
                }
            } catch (storageErr) { console.warn("Could not delete team storage:", storageErr.message); }
            alert(`Team "${teamData.name}" deleted.`); navigate('/my-teams');
        } catch (err) { console.error("Delete Error:", err); setError(err.message || "Deletion failed."); }
        finally { setIsSaving(false); }
    };

    // --- Roster Action Handlers ---
    const handleKickMember = async (userIdToKick) => {
        if (!isOwner || !teamData) return; setError(null);
        const numericTeamId = parseInt(teamId, 10); // Ensure numeric ID
        console.log(`Kicking user ${userIdToKick} from team ${numericTeamId}`);
        try {
            const { error } = await supabase.from('team_members').delete().match({ team_id: numericTeamId, user_id: userIdToKick });
            if (error) throw error;
            setMembers(prev => prev.filter(m => m.user_id !== userIdToKick));
            alert('Member removed.');
        } catch (err) { setError(`Failed to remove member: ${err.message}`); }
    };

    // --- *** CORRECTED handleChangeMemberRole *** ---
    const handleChangeMemberRole = async (userIdToChange, newRole) => {
        if (!isOwner || !teamData || !teamData.id) {
             setError("Cannot change role: Insufficient permissions or team data missing.");
             return;
        }
        setError(null); setSuccessMessage('');
        const numericTeamId = parseInt(teamId, 10);
        if (isNaN(numericTeamId)) { setError("Invalid Team ID."); return; }
        console.log(`Attempting to change role for user ${userIdToChange} to ${newRole} in team ${numericTeamId}`);
        const originalMembers = [...members];
        setMembers(prev => prev.map(m => m.user_id === userIdToChange ? { ...m, role: newRole } : m));
        try {
            const { error: updateError } = await supabase
                .from('team_members')
                .update({ role: newRole })
                .eq('team_id', numericTeamId) // Use numeric ID
                .eq('user_id', userIdToChange);
            if (updateError) {
                console.error("Supabase role update error:", updateError);
                if (updateError.message.includes('violates row-level security policy')) {
                    throw new Error("Permission denied by database policy.");
                }
                throw updateError;
            }
            console.log(`Role successfully updated for user ${userIdToChange} to ${newRole}.`);
            const updatedMember = originalMembers.find(m => m.user_id === userIdToChange); // Use original to get name before potential rollback
            setSuccessMessage(`Role for ${updatedMember?.profiles?.username || 'user'} updated to ${newRole}.`);
        } catch (err) {
            console.error("Failed to change role:", err);
            setError(`Failed to change role: ${err.message}`);
            setMembers(originalMembers); // Rollback UI
        }
    };
    // --- *** END CORRECTION *** ---


    const handleInviteMember = async (e) => {
         e.preventDefault(); if (!isOwner || !inviteUsername.trim() || !authUser || !teamData) return;
         const numericTeamId = parseInt(teamId, 10); // Use numeric ID
         console.log(`Inviting user "${inviteUsername}" to team ${numericTeamId}`);
         setInviteLoading(true); setError(null);
         try {
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('id').eq('username', inviteUsername.trim()).single();
            if (profileError || !profileData) throw new Error(`User "${inviteUsername.trim()}" not found.`);
            const userIdToInvite = profileData.id;
             if (userIdToInvite === authUser.id) throw new Error("Cannot invite self.");
             const isAlreadyMember = members.some(m => m.user_id === userIdToInvite);
             if (isAlreadyMember) throw new Error(`User already in team.`);
             const { data: existingInvite } = await supabase.from('team_invites').select('id').match({ team_id: numericTeamId, invited_user_id: userIdToInvite, status: 'pending' }).maybeSingle();
             if (existingInvite) throw new Error(`Invite already pending.`);
             const { error: inviteError } = await supabase.from('team_invites').insert({ team_id: numericTeamId, invited_user_id: userIdToInvite, inviter_user_id: authUser.id, status: 'pending' });
             if (inviteError) throw inviteError;
             alert(`Invite sent to ${inviteUsername.trim()}!`);
             setInviteUsername('');
         } catch (err) { setError(`${err.message}`); } finally { setInviteLoading(false); }
    };


    // --- Loading/Error/Permission Render ---
     if (loading || authLoading) { return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"> <Loader2 className="w-16 h-16 text-primary-500 animate-spin" /> <p className="ml-4 text-xl text-gray-400">Loading...</p> </div> ); }
     if (!authUser && !authLoading) return <Navigate to="/login" replace />;
     // If error state is set (includes permission denial from useEffect)
     if (error) {
        return ( <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center px-4"> <AlertCircle className="w-16 h-16 text-red-500 mb-4" /> <h2 className="text-2xl font-semibold text-red-400 mb-2">{error.includes('permission') ? 'Access Denied' : 'Error'}</h2> <p className="text-gray-400">{error}</p> <Link to={teamId ? `/team/${teamId}` : '/my-teams'} className="mt-6 btn-secondary"> Back </Link> </div> );
     }
      // If loading is done, no error, but teamData is missing (e.g., team not found)
     if (!teamData) {
         return <div className="text-center text-gray-400 mt-10">Team not found or data still loading...</div>;
     }
     // If we reach here, user MUST be owner and data should be available


    // --- Render Management Page ---
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">

                <AnimatedSection delay={0}>
                     <Link to={`/team/${teamId}`} className="text-primary-400 hover:text-primary-300 flex items-center mb-4 text-sm group w-fit"> <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back </Link>
                </AnimatedSection>

                 {/* Error/Success Messages */}
                 {error && !error.includes('permission') && (
                     <AnimatedSection delay={50} className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start">
                         <AlertCircle size={18} className="mr-3 mt-0.5"/> <span>{error}</span>
                     </AnimatedSection>
                 )}
                 {successMessage && (
                     <AnimatedSection delay={50} className="p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">
                         {successMessage}
                     </AnimatedSection>
                 )}


                {/* Main Edit Form Card */}
                 <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-2xl" delay={100}>
                     <form onSubmit={handleSaveChanges} className="space-y-8">
                         {/* Header, Logo, Banner, Fields, Save Button */}
                         {/* ... */}
                         <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b border-dark-700 pb-4">
                            <h1 className="text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"> <Settings className="mr-3" size={28} /> Manage Team: {teamData.name} </h1>
                            <button type="submit" className="btn-primary flex items-center justify-center text-sm py-2 px-4" disabled={isSaving}> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save className="mr-1.5" size={16} />} {isSaving ? 'Saving...' : 'Save Changes'} </button>
                         </div>
                         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6">
                            <img src={logoPreview} alt="Team Logo Preview" className="w-24 h-24 object-cover rounded-full border-2 border-primary-500 flex-shrink-0 bg-dark-700" />
                            <div className="flex-1 w-full sm:w-auto"> <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-2">Change Logo</label> <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoFileChange} disabled={isSaving} className="input-file-style"/> {logoFile && <p className="text-xs text-green-400 mt-1">New logo selected.</p>} </div>
                          </div>
                           <div className="pt-6 border-t border-dark-700">
                                <label htmlFor="banner-upload" className="block text-sm font-medium text-gray-300 mb-2">Change Banner</label>
                                <div className="relative w-full h-32 md:h-48 rounded-lg mb-4 border-2 border-dark-700 bg-dark-700">
                                    <img src={bannerPreview} alt="Banner Preview" className="w-full h-full object-cover opacity-50"/>
                                    <input type="file" id="banner-upload" accept="image/*" onChange={handleBannerFileChange} disabled={isSaving} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400"> <UploadCloud size={24}/> <span className="text-xs">{bannerFile ? 'New selected' : 'Click to upload'}</span> {bannerFile && <Check size={16} />} </div>
                                </div>
                                {bannerFile && <p className="text-xs text-green-400">New banner selected.</p>}
                           </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-6 border-t border-dark-700">
                             {/* Form Fields */}
                             <div><label htmlFor="name" className="input-label">Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="input-field" required disabled={isSaving} /></div>
                             <div><label htmlFor="game" className="input-label">Game</label><select id="game" name="game" value={formData.game} onChange={handleChange} className="input-field appearance-none" required disabled={isSaving}>{availableGames.map(g=>(<option key={g} value={g}>{g}</option>))}</select></div>
                             <div><label htmlFor="country" className="input-label">Country</label><select id="country" name="country" value={formData.country} onChange={handleChange} className="input-field appearance-none" disabled={isSaving}><option value="">Select</option>{africanCountries.map(c=>(<option key={c} value={c}>{c}</option>))}</select></div>
                             <div><label htmlFor="city" className="input-label">City</label><input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="input-field" disabled={isSaving} /></div>
                             <div className="md:col-span-2"><label htmlFor="description" className="input-label">Description</label><textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="input-field resize-none" disabled={isSaving} /></div>
                         </div>
                         <div className="flex justify-end pt-6 border-t border-dark-700"> <button type="submit" className="btn-primary flex items-center justify-center text-sm py-2 px-4" disabled={isSaving}> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Save size={16} />} {isSaving ? 'Saving...' : 'Save'} </button> </div>

                     </form>
                 </AnimatedSection>


                {/* Roster Management Section */}
                 {isOwner && (
                     <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-lg" delay={200}>
                        <h2 className="text-2xl font-bold mb-4 text-primary-300 flex items-center"><Users className="mr-3" /> Team Roster ({members.length})</h2>
                        {/* Invite Form */}
                        <form onSubmit={handleInviteMember} className="mb-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600 flex flex-col sm:flex-row gap-3 items-end">
                            <div className="flex-grow w-full"> <label htmlFor="inviteUsername" className="block text-sm font-medium text-gray-300 mb-1.5">Invite by Username</label> <input type="text" id="inviteUsername" value={inviteUsername} onChange={(e) => setInviteUsername(e.target.value)} className="input-field w-full" placeholder="Enter exact username" disabled={inviteLoading} required /> </div>
                            <button type="submit" className="btn-primary flex items-center w-full sm:w-auto flex-shrink-0" disabled={inviteLoading || !inviteUsername.trim()}> {inviteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <PlusCircle size={16} className="mr-2"/>} {inviteLoading ? 'Sending...' : 'Send Invite'} </button>
                        </form>
                        {/* Error display for roster/invite actions */}
                        {error && !requestError && <div className="mb-4 text-red-400 text-sm">{error}</div>}
                         <div className="space-y-3">
                             {members.length > 0 ? ( members.map((member, index) => (
                                  <AnimatedSection key={member.user_id || index} delay={index * 50}>
                                     <RosterItem
                                         member={member}
                                         isOwner={isOwner}
                                         onKick={handleKickMember}
                                         onChangeRole={handleChangeMemberRole} // Pass corrected handler
                                         authUser={authUser}
                                     />
                                  </AnimatedSection>
                              )) ) : ( <p className="text-gray-500 italic text-center py-4">No members found.</p> )}
                         </div>
                     </AnimatedSection>
                 )}


                {/* Danger Zone */}
                {isOwner && (
                     <AnimatedSection tag="div" className="card border border-red-700 bg-red-900/20 mt-10 p-6" delay={300}>
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
                        <p className="text-gray-300 mb-4">Permanently dissolve the team. This action cannot be undone.</p>
                        <button onClick={handleDeleteTeam} className="btn-danger w-fit flex items-center" disabled={isSaving}> {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Trash2 className="mr-2" size={16} />} {isSaving ? 'Deleting...' : 'Delete Team Profile'} </button>
                     </AnimatedSection>
                 )}

            </div>
        </div>
    );
}

// Helper function definitions needed if used in JSX directly (e.g., input-label, input-file-style)
// Add these if they were defined elsewhere, otherwise integrate Tailwind classes directly

// Example: Replace className="input-label" with className="block text-sm font-medium text-gray-300 mb-1.5"
// Example: Replace className="input-file-style" with appropriate Tailwind classes for file inputs