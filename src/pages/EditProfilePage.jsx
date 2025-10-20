// src/pages/EditProfilePage.jsx

import { useState } from 'react';
import { Save, X, User, Mail, Phone, MapPin, Check, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import AnimatedSection from '../components/AnimatedSection';

// --- List of African Countries ---
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
// --- End List ---

const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends', 'Free Fire', 'Bloodstrike', 'Farlight 84'].sort();
const femaleAvatars = Array.from({ length: 7 }, (_, i) => `/images/ava_f_${i + 1}.png`);
const maleAvatars = Array.from({ length: 10 }, (_, i) => `/images/ava_m_${i + 1}.png`);
const allAvatars = [...femaleAvatars, ...maleAvatars];
const bannerImages = [
    '/images/lan_1.jpg', '/images/lan_2.jpg', '/images/lan_3.jpg', '/images/lan_4.jpg',
    '/images/lan_5.jpg', '/images/lan_6.jpg', '/images/lan_7.jpg', '/images/lan_8.jpg',
    '/images/lan_9.jpg',
];


export default function EditProfilePage() {
  const navigate = useNavigate(); // Added useNavigate
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'ProGamer2024',
    email: 'johndoe@example.com',
    phone: '+234 801 234 5678',
    country: 'Nigeria', // Ensure default matches an option
    city: 'Lagos',
    bio: 'Professional esports athlete from Nigeria. Specialized in FIFA and COD Warzone.',
    avatar: maleAvatars[0],
    banner: bannerImages[0],
    favoriteGames: ['FIFA 24', 'COD Warzone'],
    gameDetails: {
      'FIFA 24': { ign: 'ProFIFA', uid: '12345FIFA' },
      'COD Warzone': { ign: 'WarzonePro', uid: '67890COD' },
    },
    socialLinks: {
      twitch: 'https://twitch.tv/progamer2024',
      youtube: 'https://youtube.com/progamer2024',
      instagram: 'https://instagram.com/progamer2024'
    }
  });

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
    setFormData(prev => {
        const currentGames = [...prev.favoriteGames]; // Clone array
        const currentGameDetails = { ...prev.gameDetails };
        if (isChecked) {
            if (!currentGames.includes(game)) {
                currentGames.push(game);
                if (!currentGameDetails[game]) {
                    currentGameDetails[game] = { ign: '', uid: '' };
                }
            }
        } else {
            const index = currentGames.indexOf(game);
            if (index > -1) {
                currentGames.splice(index, 1);
                // Optionally delete currentGameDetails[game];
            }
        }
        return { ...prev, favoriteGames: currentGames, gameDetails: currentGameDetails };
    });
};


  const handleGameDetailChange = (game, field, value) => {
    setFormData(prev => ({
      ...prev,
      gameDetails: { ...prev.gameDetails, [game]: { ...prev.gameDetails[game], [field]: value } }
    }));
  };

  const handleAvatarSelect = (avatarPath) => { setFormData(prev => ({ ...prev, avatar: avatarPath })); };
  const handleBannerSelect = (bannerPath) => { setFormData(prev => ({ ...prev, banner: bannerPath })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const detailsToSubmit = {};
    formData.favoriteGames.forEach(game => { if(formData.gameDetails[game]) { detailsToSubmit[game] = formData.gameDetails[game]; } });
    const dataToSubmit = { ...formData, gameDetails: detailsToSubmit };
    console.log('Profile updated:', dataToSubmit);
    alert('Profile updated successfully!');
    // Supabase submission logic here
    navigate('/profile'); // Navigate back after save
  };


  return (
    <div className="bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <AnimatedSection tag="div" className="card bg-dark-800 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 border-b border-dark-700 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"><User className="mr-3" size={28} /> Edit Profile</h1>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link to="/profile" className="btn-secondary flex items-center justify-center flex-1 sm:flex-initial text-sm py-2 px-3 sm:px-4"><X className="mr-1.5" size={16} /> Cancel</Link>
              {/* Changed button type to submit */}
              <button type="submit" form="editProfileForm" className="btn-primary flex items-center justify-center flex-1 sm:flex-initial text-sm py-2 px-3 sm:px-4"><Save className="mr-1.5" size={16} /> Save</button>
            </div>
          </div>

          {/* Added form ID */}
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
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label><input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" /></div>
                {/* --- UPDATED Country Select --- */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Country</label>
                  <select name="country" value={formData.country} onChange={handleChange} className="input-field appearance-none" required >
                    <option value="" disabled>Select Country</option>
                    {/* Map over the africanCountries array */}
                    {africanCountries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                {/* --- End Update --- */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                {availableGames.map(game => (
                  <label key={game} className={`flex items-center p-2.5 sm:p-3 rounded-md cursor-pointer transition-colors duration-150 ${formData.favoriteGames.includes(game) ? 'bg-primary-700/50 border border-primary-600' : 'bg-dark-700 hover:bg-dark-600 border border-transparent'}`}>
                    <input type="checkbox" value={game} checked={formData.favoriteGames.includes(game)} onChange={handleGameChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-500 rounded mr-2 sm:mr-3 bg-dark-600 flex-shrink-0" />
                    <span className={`text-sm sm:text-base ${formData.favoriteGames.includes(game) ? 'text-white font-medium' : 'text-gray-300'}`}>{game}</span>
                  </label>
                ))}
              </div>
              {formData.favoriteGames.length > 0 && (
                <div className="space-y-6 mt-6 border-t border-dark-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-200">In-Game Details</h3>
                  {formData.favoriteGames.map(game => (
                    <AnimatedSection key={game} delay={100}>
                       <div className="p-4 bg-dark-800 rounded-lg border border-dark-600">
                          <p className="font-semibold text-primary-400 mb-3">{game}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label htmlFor={`${game}-ign`} className="block text-xs font-medium text-gray-400 mb-1">In-Game Name (IGN)</label><input type="text" id={`${game}-ign`} value={formData.gameDetails[game]?.ign || ''} onChange={(e) => handleGameDetailChange(game, 'ign', e.target.value)} className="input-field input-field-sm" placeholder="e.g., YourGamerTag" /></div>
                            <div><label htmlFor={`${game}-uid`} className="block text-xs font-medium text-gray-400 mb-1">User ID (UID)</label><input type="text" id={`${game}-uid`} value={formData.gameDetails[game]?.uid || ''} onChange={(e) => handleGameDetailChange(game, 'uid', e.target.value)} className="input-field input-field-sm" placeholder="e.g., 123456789" /></div>
                          </div>
                       </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </AnimatedSection>

            {/* Social Links */}
            <AnimatedSection delay={500}>
              <h2 className="text-xl font-semibold mb-4 text-gray-100">Social Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Twitch</label><input type="url" name="social.twitch" value={formData.socialLinks.twitch} onChange={handleChange} className="input-field" placeholder="https://twitch.tv/username" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">YouTube</label><input type="url" name="social.youtube" value={formData.socialLinks.youtube} onChange={handleChange} className="input-field" placeholder="https://youtube.com/username" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1.5">Instagram</label><input type="url" name="social.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="input-field" placeholder="https://instagram.com/username" /></div>
              </div>
            </AnimatedSection>

             {/* Form Actions (moved outside form structure, associated by ID) */}
            <AnimatedSection delay={600} className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-dark-700">
                <Link to="/profile" className="btn-secondary flex items-center justify-center py-2 px-4 text-sm order-2 sm:order-1"> <X className="mr-1.5" size={16} /> Cancel </Link>
                {/* Changed button type to submit and added form attribute */}
                <button type="submit" form="editProfileForm" className="btn-primary flex items-center justify-center py-2 px-4 text-sm order-1 sm:order-2"> <Save className="mr-1.5" size={16} /> Save Changes </button>
            </AnimatedSection>

          </form>
        </AnimatedSection>
      </div>
    </div>
  );
}