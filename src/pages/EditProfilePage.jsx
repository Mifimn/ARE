// src/pages/EditProfilePage.jsx

import { useState } from 'react';
import { Save, X, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // 🔑 Import useNavigate for redirection
import AnimatedSection from '../components/AnimatedSection';

// Helper function to ensure URLs have a protocol for correct linking
const normalizeUrl = (url) => {
    if (!url) return '';
    // Check if the URL already starts with http:// or https://
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

// --- (Country and Game Lists remain the same) ---
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

const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];

const femaleAvatars = Array.from({ length: 7 }, (_, i) => `/images/ava_f_${i + 1}.png`);
const maleAvatars = Array.from({ length: 10 }, (_, i) => `/images/ava_m_${i + 1}.png`);
const allAvatars = [...femaleAvatars, ...maleAvatars];

const allBanners = Array.from({ length: 10 }, (_, i) => `/images/lan_${i + 1}.jpg`);
// --- (End of lists) ---


// Load data from localStorage or use defaults for initial state
const getInitialFormData = () => {
    const savedData = localStorage.getItem('userProfileData');
    const defaults = {
        fullName: 'John Doe',
        username: 'ProGamer2024',
        email: 'johndoe@example.com',
        phone: '+234 801 234 5678',
        country: 'Nigeria',
        city: 'Lagos',
        bio: 'Professional esports athlete from Nigeria. Specialized in FIFA and COD Warzone.',
        avatar: maleAvatars[0],
        banner: allBanners[0],
        favoriteGames: ['FIFA 24', 'COD Warzone'],
        gameDetails: {
            'FIFA 24': { ign: 'ProFIFA', uid: '12345FIFA' },
            'COD Warzone': { ign: 'WarzonePro', uid: '67890COD' },
        },
        socialLinks: {
            twitch: '', 
            youtube: '', 
            instagram: '' 
        },
        id: 1,
        joinDate: '2023-01-15',
        lastActive: new Date().toISOString(),
        verified: true,
        credits: 1250,
        totalWins: 145,
        totalLosses: 32,
    };

    if (savedData) {
        const parsedData = JSON.parse(savedData);
        return {
            ...defaults, 
            ...parsedData,
            socialLinks: {
                ...defaults.socialLinks,
                ...parsedData.socialLinks,
            }
        };
    }
    return defaults;
};

export default function EditProfilePage() {
    // 🔑 Hook for navigation
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState(getInitialFormData()); 
    const [showNotification, setShowNotification] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const platform = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, [platform]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- (handleGameChange, handleGameDetailChange, handleAvatarSelect, handleBannerSelect remain the same) ---
    const handleGameChange = (e) => {
        const game = e.target.value;
        const isChecked = e.target.checked;

        setFormData(prev => {
            const currentGames = [...prev.favoriteGames];
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
                    delete currentGameDetails[game];
                }
            }

            return {
                ...prev,
                favoriteGames: currentGames,
                gameDetails: currentGameDetails
            };
        });
    };

    const handleGameDetailChange = (game, field, value) => {
        setFormData(prev => ({
            ...prev,
            gameDetails: {
                ...prev.gameDetails,
                [game]: {
                    ...prev.gameDetails[game],
                    [field]: value
                }
            }
        }));
    };

    const handleAvatarSelect = (avatarPath) => {
        setFormData(prev => ({ ...prev, avatar: avatarPath }));
    };

    const handleBannerSelect = (bannerPath) => {
        setFormData(prev => ({ ...prev, banner: bannerPath }));
    };
    // --- (End of handlers) ---


    const processSave = () => {

        const detailsToSubmit = {};
        formData.favoriteGames.forEach(game => {
            if (formData.gameDetails[game]) {
                detailsToSubmit[game] = formData.gameDetails[game];
            }
        });

        const normalizedSocialLinks = Object.entries(formData.socialLinks).reduce((acc, [platform, url]) => {
            acc[platform] = url ? normalizeUrl(url) : '';
            return acc;
        }, {});

        const dataToSubmit = { 
            ...formData, 
            gameDetails: detailsToSubmit,
            socialLinks: normalizedSocialLinks,
            joinDate: formData.joinDate,
            lastActive: new Date().toISOString(),
            verified: formData.verified,
            credits: formData.credits,
            totalWins: formData.totalWins,
            totalLosses: formData.totalLosses,
            id: formData.id,
        };

        // 1. Save the entire user object to localStorage
        localStorage.setItem('userProfileData', JSON.stringify(dataToSubmit));

        // 2. Show custom notification
        setShowNotification(true);

        // 3. Hide notification and redirect after a brief delay
        setTimeout(() => {
            setShowNotification(false);
            navigate('/profile'); // 🔑 Redirect to the profile page
        }, 1200); // 1.2 second delay for the user to see the success message
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // 🔑 Confirmation Dialog
        const isConfirmed = window.confirm("Are you sure you want to save these profile changes?");

        if (isConfirmed) {
            processSave();
        }
    };

    // Tailwind utility classes for the banners
    const bannerClasses = "w-full h-32 md:h-40 object-cover rounded-lg transition-opacity duration-300";

    // Styled Notification Component
    const Notification = () => (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 transform"
             style={{
                 transform: showNotification ? 'translateY(0)' : 'translateY(-100px)',
                 opacity: showNotification ? 1 : 0,
             }}
        >
            <div className="flex items-center bg-green-600/95 text-white p-4 rounded-lg shadow-2xl border border-green-500 backdrop-blur-sm">
                <Check className="mr-3 w-5 h-5" />
                <span className="font-semibold">Profile Saved! Redirecting...</span> {/* Updated message */}
                <button 
                    onClick={() => setShowNotification(false)}
                    className="ml-4 text-white/80 hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <Notification /> {/* Render the notification component */}
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <AnimatedSection tag="div" className="card bg-dark-800 p-6 rounded-xl shadow-2xl shadow-dark-900/50">
                    <div className="flex items-center justify-between mb-8 border-b border-dark-700 pb-4">
                        <h1 className="text-3xl font-extrabold text-primary-400">Edit Profile</h1>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleSubmit} className="btn-primary flex items-center">
                                <Save className="mr-2" size={16} /> Save Changes
                            </button>
                            <Link to="/profile" className="btn-secondary flex items-center">
                                <X className="mr-2" size={16} /> Cancel
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* 1. Profile Banner Selection */}
                        <AnimatedSection delay={50}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Select Profile Banner</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {allBanners.map(bannerPath => (
                                    <button
                                        key={bannerPath}
                                        type="button"
                                        onClick={() => handleBannerSelect(bannerPath)}
                                        className={`relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                                            formData.banner === bannerPath 
                                                ? 'ring-4 ring-primary-500 border-4 border-primary-500 shadow-lg shadow-primary-500/20' 
                                                : 'border-2 border-dark-700 hover:border-primary-400'
                                        }`}
                                    >
                                        <img src={bannerPath} alt={`Profile Banner ${bannerPath.split('/').pop()}`} className={`${bannerClasses} ${formData.banner === bannerPath ? 'opacity-90' : 'opacity-70 hover:opacity-100'}`} />
                                        {formData.banner === bannerPath && (
                                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                <Check className="w-8 h-8 text-primary-300" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* 2. Avatar Selection */}
                        <AnimatedSection delay={150}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Select Avatar</h2>
                            <div className="flex flex-wrap gap-4">
                                {allAvatars.map(avatarPath => (
                                    <button
                                        key={avatarPath}
                                        type="button"
                                        onClick={() => handleAvatarSelect(avatarPath)}
                                        className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800
                                            ${formData.avatar === avatarPath ? 'border-primary-500 scale-110' : 'border-dark-600 hover:border-primary-400'}
                                        `}
                                    >
                                        <img src={avatarPath} alt={`Avatar ${avatarPath.split('/').pop()}`} className="w-full h-full object-cover" />
                                        {formData.avatar === avatarPath && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Check className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* 3. Basic Information */}
                        <AnimatedSection delay={250}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                                    <select name="country" value={formData.country} onChange={handleChange} className="input-field appearance-none" required >
                                        <option value="" disabled>Select Country</option>
                                        {africanCountries.map(country => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" />
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 4. Bio */}
                        <AnimatedSection delay={350}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="input-field" placeholder="Tell us about yourself..." />
                        </AnimatedSection>

                        {/* 5. Favorite Games & Details */}
                        <AnimatedSection delay={450}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Favorite Games & Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                {availableGames.map(game => (
                                    <label key={game} className="flex items-center p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors border border-dark-700">
                                        <input
                                            type="checkbox"
                                            value={game}
                                            checked={formData.favoriteGames.includes(game)}
                                            onChange={handleGameChange}
                                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-500 rounded mr-3 bg-dark-600 checked:bg-primary-500 checked:border-primary-500"
                                        />
                                        <span className="text-gray-300">{game}</span>
                                    </label>
                                ))}
                            </div>

                            {formData.favoriteGames.length > 0 && (
                                <div className="space-y-6 mt-6 border-t border-dark-700 pt-6">
                                    <h3 className="text-lg font-medium text-gray-200">In-Game Details</h3>
                                    {formData.favoriteGames.map(game => (
                                        <AnimatedSection key={game} delay={50} className="relative">
                                            <div className="p-4 bg-dark-800 rounded-lg border border-primary-500/30 shadow-inner">
                                                <p className="font-semibold text-primary-400 mb-3">{game}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor={`${game}-ign`} className="block text-xs font-medium text-gray-400 mb-1">In-Game Name (IGN)</label>
                                                        <input
                                                            type="text"
                                                            id={`${game}-ign`}
                                                            value={formData.gameDetails[game]?.ign || ''}
                                                            onChange={(e) => handleGameDetailChange(game, 'ign', e.target.value)}
                                                            className="input-field text-sm px-3 py-2"
                                                            placeholder="e.g., YourGamerTag"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`${game}-uid`} className="block text-xs font-medium text-gray-400 mb-1">User ID (UID)</label>
                                                        <input
                                                            type="text"
                                                            id={`${game}-uid`}
                                                            value={formData.gameDetails[game]?.uid || ''}
                                                            onChange={(e) => handleGameDetailChange(game, 'uid', e.target.value)}
                                                            className="input-field text-sm px-3 py-2"
                                                            placeholder="e.g., 123456789"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedSection>
                                    ))}
                                </div>
                            )}
                        </AnimatedSection>

                        {/* 6. Social Links */}
                        <AnimatedSection delay={550}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-200">Social Links</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Twitch</label>
                                    <input 
                                        type="url" 
                                        name="social.twitch" 
                                        value={formData.socialLinks.twitch || ''} 
                                        onChange={handleChange} 
                                        className="input-field" 
                                        placeholder="twitch.tv/username" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                                    <input 
                                        type="url" 
                                        name="social.youtube" 
                                        value={formData.socialLinks.youtube || ''} 
                                        onChange={handleChange} 
                                        className="input-field" 
                                        placeholder="youtube.com/username" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                                    <input 
                                        type="url" 
                                        name="social.instagram" 
                                        value={formData.socialLinks.instagram || ''} 
                                        onChange={handleChange} 
                                        className="input-field" 
                                        placeholder="instagram.com/username" 
                                    />
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 7. Form Actions */}
                        <AnimatedSection delay={650} className="flex justify-end gap-4 pt-6 border-t border-dark-700">
                            <Link to="/profile" className="btn-secondary flex items-center">
                                <X className="mr-2" size={16} /> Cancel
                            </Link>
                            <button type="submit" className="btn-primary flex items-center">
                                <Save className="mr-2" size={16} /> Save Changes
                            </button>
                        </AnimatedSection>

                    </form>
                </AnimatedSection>
            </div>
        </div>
    );
}