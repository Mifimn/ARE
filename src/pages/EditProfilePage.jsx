
import { useState } from 'react';
import { Save, X, Camera, User, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'ProGamer2024',
    email: 'johndoe@example.com',
    phone: '+234 801 234 5678',
    country: 'Nigeria',
    city: 'Lagos',
    bio: 'Professional esports athlete from Nigeria. Specialized in FIFA and COD Warzone.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    favoriteGames: ['FIFA 24', 'COD Warzone'],
    socialLinks: {
      twitch: 'https://twitch.tv/progamer2024',
      youtube: 'https://youtube.com/progamer2024',
      instagram: 'https://instagram.com/progamer2024'
    }
  });

  const games = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const platform = name.split('.')[1];
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [platform]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleGameChange = (e) => {
    const game = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData({
        ...formData,
        favoriteGames: [...formData.favoriteGames, game]
      });
    } else {
      setFormData({
        ...formData,
        favoriteGames: formData.favoriteGames.filter(g => g !== game)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <div className="flex gap-4">
              <button 
                onClick={handleSubmit}
                className="btn-primary flex items-center"
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </button>
              <Link to="/profile" className="btn-secondary flex items-center">
                <X className="mr-2" size={16} />
                Cancel
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-6">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <button
                type="button"
                className="btn-secondary flex items-center"
              >
                <Camera className="mr-2" size={16} />
                Change Photo
              </button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Morocco">Morocco</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Social Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitch
                  </label>
                  <input
                    type="url"
                    name="social.twitch"
                    value={formData.socialLinks.twitch}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://twitch.tv/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube
                  </label>
                  <input
                    type="url"
                    name="social.youtube"
                    value={formData.socialLinks.youtube}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://youtube.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="social.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Favorite Games */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Favorite Games</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {games.map(game => (
                  <label key={game} className="flex items-center">
                    <input
                      type="checkbox"
                      value={game}
                      checked={formData.favoriteGames.includes(game)}
                      onChange={handleGameChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-2"
                    />
                    <span className="text-gray-300">{game}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
