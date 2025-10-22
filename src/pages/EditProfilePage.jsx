// src/pages/EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
import { useAuth } from '../contexts/AuthContext.jsx'; // Adjust path if needed
import { Save, X, User, Mail, Phone, MapPin, Check, ImageIcon, AlertCircle } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom'; // Added Navigate for redirect
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

const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends', 'Free Fire', 'Bloodstrike', 'Farlight 84'].sort();
const femaleAvatars = Array.from({ length: 7 }, (_, i) => `/images/ava_f_${i + 1}.png`);
const maleAvatars = Array.from({ length: 10 }, (_, i) => `/images/ava_m_${i + 1}.png`);
const allAvatars = [...femaleAvatars, ...maleAvatars];
const bannerImages = [
    '/images/lan_1.jpg', '/images/lan_2.jpg', '/images/lan_3.jpg', '/images/lan_4.jpg',
    '/images/lan_5.jpg', '/images/lan_6.jpg', '/images/lan_7.jpg', '/images/lan_8.jpg',
    '/images/lan_9.jpg',
];
// --- End Constants ---

export default function EditProfilePage() {
  const { user: authUser, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // --- State ---
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    bio: '',
    avatar: maleAvatars[0],
    banner: bannerImages[0],
    favoriteGames: [],
    gameDetails: {},
    socialLinks: { twitch: '', youtube: '', instagram: '' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // --- Fetch Profile Data ---
  useEffect(() => {
    if (!authLoading && authUser) {
      const fetchProfile = async () => {
        console.log("EditProfile: Fetching profile for user:", authUser.id);
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
          const { data, error: profileError, status } = await supabase
            .from('profiles')
            .select('full_name, username, phone, country, city, bio, avatar_url, banner_url, favorite_games, game_details, social_links')
            .eq('id', authUser.id)
            .single();

          if (profileError && status !== 406) throw profileError;

          if (data) {
            console.log("EditProfile: Fetched profile data:", data);
            setFormData({
              fullName: data.full_name || '',
              username: data.username || '',
              email: authUser.email,
              phone: data.phone || '',
              country: data.country || '',
              city: data.city || '',
              bio: data.bio || '',
              avatar: data.avatar_url || maleAvatars[0],
              banner: data.banner_url || bannerImages[0],
              favoriteGames: data.favorite_games || [],
              gameDetails: data.game_details || {},
              socialLinks: data.social_links || { twitch: '', youtube: '', instagram: '' },
            });
          } else {
             console.warn("EditProfile: No profile found, using auth email.");
            setFormData(prev => ({
                ...prev,
                email: authUser.email,
                username: authUser.email.split('@')[0],
            }));
          }
        } catch (err) {
          console.error("EditProfile: Error fetching profile:", err);
          setError(`Failed to load profile data: ${err.message || 'Unknown error'}`);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else if (!authLoading && !authUser) {
       setLoading(false);
       navigate('/login'); // Redirect if not logged in after auth check
    }
  }, [authUser, authLoading, navigate]);


  // --- Handlers ---
   const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
     setError(null); setSuccessMessage('');
    if (name.startsWith('social.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

   const handleGameChange = (e) => {
        const game = e.target.value;
        const isChecked = e.target.checked;
        setError(null); setSuccessMessage('');
        setFormData(prev => {
            const currentGames = [...prev.favoriteGames];
            const currentGameDetails = { ...prev.gameDetails };
            if (isChecked) {
                if (!currentGames.includes(game)) {
                    currentGames.push(game);
                    if (!currentGameDetails[game]) { currentGameDetails[game] = { ign: '', uid: '' }; }
                }
            } else {
                const index = currentGames.indexOf(game);
                if (index > -1) { currentGames.splice(index, 1); }
            }
            return { ...prev, favoriteGames: currentGames.sort(), gameDetails: currentGameDetails }; // Keep games sorted
        });
    };
   const handleGameDetailChange = (game, field, value) => {
        setError(null); setSuccessMessage('');
        setFormData(prev => ({
            ...prev,
            gameDetails: { ...prev.gameDetails, [game]: { ...prev.gameDetails[game], [field]: value } }
        }));
    };

   const handleAvatarSelect = (avatarPath) => {
     setError(null); setSuccessMessage('');
     setFormData(prev => ({ ...prev, avatar: avatarPath }));
     console.log("Selected pre-made avatar:", avatarPath);
   };

  const handleBannerSelect = (bannerPath) => {
    setError(null); setSuccessMessage('');
    setFormData(prev => ({ ...prev, banner: bannerPath }));
    console.log("Selected pre-made banner:", bannerPath);
  };


  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser) {
      setError("Authentication error. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const detailsToSubmit = {};
      formData.favoriteGames.forEach(game => { if(formData.gameDetails[game]) { detailsToSubmit[game] = formData.gameDetails[game]; } });

      const updates = {
        id: authUser.id,
        full_name: formData.fullName,
        username: formData.username,
        phone: formData.phone || null, // Send null if empty
        country: formData.country,
        city: formData.city || null, // Send null if empty
        bio: formData.bio || null, // Send null if empty
        avatar_url: formData.avatar,
        banner_url: formData.banner,
        favorite_games: formData.favoriteGames,
        game_details: detailsToSubmit,
        social_links: formData.socialLinks,
        updated_at: new Date(),
      };

      console.log("Updating profile with:", updates);

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authUser.id);

      if (updateError) {
           if (updateError.message.includes('duplicate key value violates unique constraint "profiles_username_key"')) {
               throw new Error(`Username "${formData.username}" is already taken.`);
           }
        throw updateError;
      }

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);

    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };


  // --- Render Loading/Initial State ---
   if (authLoading || loading) {
     // Correct Loading UI
     return (
       <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
         <p className="ml-4 text-xl">Loading Editor...</p>
       </div>
     );
   }
   // Redirect if not authenticated after loading checks
   if (!authUser) {
     return <Navigate to="/login" replace />;
   }

  // --- Render Form ---
  return (
    <div className="bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <AnimatedSection tag="div" className="card bg-dark-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-dark-700 pb-4">
             <h1 className="text-2xl sm:text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"><User className="mr-3" size={28} /> Edit Profile</h1>
             <div className="flex gap-3 w-full sm:w-auto">
                <Link to="/profile" className="btn-secondary flex items-center justify-center flex-1 sm:flex-initial text-sm py-2 px-3 sm:px-4"><X className="mr-1.5" size={16} /> Cancel</Link>
                <button type="submit" form="editProfileForm" className="btn-primary flex items-center justify-center flex-1 sm:flex-initial text-sm py-2 px-3 sm:px-4" disabled={loading}>
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div> : <Save className="mr-1.5" size={16} />}
                    {loading ? 'Saving...' : 'Save'}
                </button>
             </div>
          </div>

           {/* Success/Error Messages */}
           {error && (
             <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start">
                <AlertCircle size={20} className="mr-3 flex-shrink-0 mt-0.5"/>
                <span>{error}</span>
             </div>
           )}
           {successMessage && ( <div className="mb-6 p-4 bg-green-900/30 border border-green-700 text-green-300 rounded-lg text-sm">{successMessage}</div> )}

          <form id="editProfileForm" onSubmit={handleSubmit} className="space-y-10">

            {/* Banner Selection */}
            <AnimatedSection delay={50}>
              <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center"><ImageIcon className="mr-2 text-primary-400" size={20}/> Select Profile Banner</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {bannerImages.map(bannerPath => (
                  <button key={bannerPath} type="button" onClick={() => handleBannerSelect(bannerPath)} className={`relative aspect-[16/6] rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 ${formData.banner === bannerPath ? 'border-primary-500 scale-105 ring-2 ring-primary-500/50' : 'border-dark-600 hover:border-primary-400'}`} >
                    <img src={bannerPath} alt={`Banner ${bannerPath.split('/').pop()}`} className="w-full h-full object-cover" />
                    {formData.banner === bannerPath && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" /></div>)}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Avatar Selection */}
            <AnimatedSection delay={100}>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Select Avatar</h2>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
                {allAvatars.map(avatarPath => (
                  <button key={avatarPath} type="button" onClick={() => handleAvatarSelect(avatarPath)} className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 ${formData.avatar === avatarPath ? 'border-primary-500 scale-110 ring-2 ring-primary-500/50' : 'border-dark-600 hover:border-primary-400'}`} >
                    <img src={avatarPath} alt={`Avatar ${avatarPath.split('/').pop()}`} className="w-full h-full object-cover" />
                    {formData.avatar === avatarPath && (<div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" /></div>)}
                  </button>
                ))}
              </div>
            </AnimatedSection>

            {/* Basic Information */}
            <AnimatedSection delay={200}>
               <h2 className="text-xl font-semibold mb-4 text-gray-100">Basic Information</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" required /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required pattern="^[a-zA-Z0-9_]{3,}$" title="Min 3 chars: letters, numbers, _" /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label><input type="email" name="email" value={formData.email} className="input-field bg-dark-600 text-gray-400 cursor-not-allowed" readOnly title="Email cannot be changed here" /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Country</label><select name="country" value={formData.country} onChange={handleChange} className="input-field appearance-none" required ><option value="" disabled>Select Country</option>{africanCountries.map(country => (<option key={country} value={country}>{country}</option>))}</select></div>
                    <div><label className="block text-sm font-medium text-gray-300 mb-1.5">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" /></div>
               </div>
           </AnimatedSection>

            {/* Bio */}
            <AnimatedSection delay={300}>
               <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="input-field" placeholder="Tell us about yourself..." />
            </AnimatedSection>

            {/* Favorite Games & Details */}
            <AnimatedSection delay={400}>
               <h2 className="text-xl font-semibold mb-4 text-gray-100">Favorite Games & Details</h2>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6"> {availableGames.map(game => (<label key={game} className={`flex items-center p-2.5 sm:p-3 rounded-md cursor-pointer transition-colors duration-150 ${formData.favoriteGames.includes(game) ? 'bg-primary-700/50 border border-primary-600' : 'bg-dark-700 hover:bg-dark-600 border border-transparent'}`}> <input type="checkbox" value={game} checked={formData.favoriteGames.includes(game)} onChange={handleGameChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-500 rounded mr-2 sm:mr-3 bg-dark-600 flex-shrink-0" /> <span className={`text-sm sm:text-base ${formData.favoriteGames.includes(game) ? 'text-white font-medium' : 'text-gray-300'}`}>{game}</span> </label> ))} </div>
               {formData.favoriteGames.length > 0 && ( <div className="space-y-6 mt-6 border-t border-dark-700 pt-6"> <h3 className="text-lg font-medium text-gray-200">In-Game Details</h3> {formData.favoriteGames.map(game => ( <AnimatedSection key={game} delay={100}> <div className="p-4 bg-dark-800 rounded-lg border border-dark-600"> <p className="font-semibold text-primary-400 mb-3">{game}</p> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div><label htmlFor={`${game}-ign`} className="block text-xs font-medium text-gray-400 mb-1">In-Game Name (IGN)</label><input type="text" id={`${game}-ign`} value={formData.gameDetails[game]?.ign || ''} onChange={(e) => handleGameDetailChange(game, 'ign', e.target.value)} className="input-field input-field-sm" placeholder="e.g., YourGamerTag" /></div> <div><label htmlFor={`${game}-uid`} className="block text-xs font-medium text-gray-400 mb-1">User ID (UID)</label><input type="text" id={`${game}-uid`} value={formData.gameDetails[game]?.uid || ''} onChange={(e) => handleGameDetailChange(game, 'uid', e.target.value)} className="input-field input-field-sm" placeholder="e.g., 123456789" /></div> </div> </div> </AnimatedSection> ))} </div> )}
            </AnimatedSection>

            {/* Social Links */}
            <AnimatedSection delay={500}>
               <h2 className="text-xl font-semibold mb-4 text-gray-100">Social Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Twitch</label><input type="url" name="social.twitch" value={formData.socialLinks.twitch || ''} onChange={handleChange} className="input-field" placeholder="https://twitch.tv/username" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">YouTube</label><input type="url" name="social.youtube" value={formData.socialLinks.youtube || ''} onChange={handleChange} className="input-field" placeholder="https://youtube.com/channel/..." /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Instagram</label><input type="url" name="social.instagram" value={formData.socialLinks.instagram || ''} onChange={handleChange} className="input-field" placeholder="https://instagram.com/username" /></div>
              </div>
            </AnimatedSection>

             {/* Form Actions */}
              <AnimatedSection delay={600} className="flex justify-end gap-3 sm:gap-4 pt-6 border-t border-dark-700">
                <Link to="/profile" className="btn-secondary flex items-center justify-center py-2 px-4 text-sm"> <X className="mr-1.5" size={16} /> Cancel </Link>
                {/* Submit button moved to header, associated via form="editProfileForm" */}
              </AnimatedSection>

          </form>
        </AnimatedSection>
      </div>
    </div>
  );
}
