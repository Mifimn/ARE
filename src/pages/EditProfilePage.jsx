// src/pages/EditProfilePage.jsx

import { useState } from 'react';
import { Save, X, User, Mail, Phone, MapPin, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection'; // Import animation wrapper

// List of African countries
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

// Available games for selection
const availableGames = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];

// UPDATED: Generate avatar paths directly from /images/
const femaleAvatars = Array.from({ length: 7 }, (_, i) => `/images/ava_f_${i + 1}.png`);
const maleAvatars = Array.from({ length: 10 }, (_, i) => `/images/ava_m_${i + 1}.png`);
const allAvatars = [...femaleAvatars, ...maleAvatars];

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'ProGamer2024',
    email: 'johndoe@example.com',
    phone: '+234 801 234 5678',
    country: 'Nigeria',
    city: 'Lagos',
    bio: 'Professional esports athlete from Nigeria. Specialized in FIFA and COD Warzone.',
    // UPDATED: Default avatar path
    avatar: maleAvatars[0], // Example default: /images/ava_m_1.png
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

  const handleGameChange = (e) => {
    const game = e.target.value;
    const isChecked = e.target.checked;
    const currentGames = formData.favoriteGames;
    const currentGameDetails = { ...formData.gameDetails };

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
        // Optionally remove game details: delete currentGameDetails[game];
      }
    }

    setFormData(prev => ({
      ...prev,
      favoriteGames: [...currentGames],
      gameDetails: currentGameDetails
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const detailsToSubmit = {};
    formData.favoriteGames.forEach(game => {
        if(formData.gameDetails[game]) {
            detailsToSubmit[game] = formData.gameDetails[game];
        }
    });
    const dataToSubmit = { ...formData, gameDetails: detailsToSubmit };

    console.log('Profile updated:', dataToSubmit);
    alert('Profile updated successfully!');
    // Supabase submission logic here
  };

  return (
    <div className="bg-dark-900 text-white">
      <div className="max-w-4xl mx-auto py-8">
        <AnimatedSection tag="div" className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <div className="flex gap-4">
              <button onClick={handleSubmit} className="btn-primary flex items-center">
                <Save className="mr-2" size={16} /> Save Changes
              </button>
              <Link to="/profile" className="btn-secondary flex items-center">
                <X className="mr-2" size={16} /> Cancel
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Avatar Selection */}
            <AnimatedSection delay={100}>
              <h2 className="text-xl font-semibold mb-4">Select Avatar</h2>
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
                    {/* The src uses the updated paths */}
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

            {/* Basic Information */}
            <AnimatedSection delay={200}>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
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
                  <select name="country" value={formData.country} onChange={handleChange} className="input-field" required >
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

            {/* Bio */}
            <AnimatedSection delay={300}>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="input-field" placeholder="Tell us about yourself..." />
            </AnimatedSection>

            {/* Favorite Games & Details */}
            <AnimatedSection delay={400}>
              <h2 className="text-xl font-semibold mb-4">Favorite Games & Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {availableGames.map(game => (
                  <label key={game} className="flex items-center p-3 bg-dark-700 rounded-md cursor-pointer hover:bg-dark-600 transition-colors">
                    <input
                      type="checkbox"
                      value={game}
                      checked={formData.favoriteGames.includes(game)}
                      onChange={handleGameChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-500 rounded mr-3"
                    />
                    <span className="text-gray-300">{game}</span>
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
                            <div>
                               <label htmlFor={`${game}-ign`} className="block text-xs font-medium text-gray-400 mb-1">In-Game Name (IGN)</label>
                               <input
                                  type="text"
                                  id={`${game}-ign`}
                                  value={formData.gameDetails[game]?.ign || ''}
                                  onChange={(e) => handleGameDetailChange(game, 'ign', e.target.value)}
                                  className="input-field input-field-sm"
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
                                  className="input-field input-field-sm"
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

            {/* Social Links */}
            <AnimatedSection delay={500}>
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Twitch</label>
                  <input type="url" name="social.twitch" value={formData.socialLinks.twitch} onChange={handleChange} className="input-field" placeholder="https://twitch.tv/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                  <input type="url" name="social.youtube" value={formData.socialLinks.youtube} onChange={handleChange} className="input-field" placeholder="https://youtube.com/username" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                  <input type="url" name="social.instagram" value={formData.socialLinks.instagram} onChange={handleChange} className="input-field" placeholder="https://instagram.com/username" />
                </div>
              </div>
            </AnimatedSection>

             {/* Form Actions */}
            <AnimatedSection delay={600} className="flex justify-end gap-4 pt-6 border-t border-dark-700">
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