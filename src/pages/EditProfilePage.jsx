
<old_str>import { Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProfilePage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          <p className="text-gray-300 mb-6">Update your personal information</p>
          <div className="flex gap-4">
            <button className="btn-primary flex items-center">
              <Save className="mr-2" size={16} />
              Save Changes
            </button>
            <Link to="/profile" className="btn-secondary flex items-center">
              <X className="mr-2" size={16} />
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}</old_str>
<new_str>import { useState } from 'react';
import { Save, X, Camera, User, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    username: 'GamerPro123',
    email: 'john.doe@example.com',
    phone: '+234 801 234 5678',
    country: 'Nigeria',
    city: 'Lagos',
    bio: 'Passionate FIFA player from Nigeria. Been competing in esports for 3 years. Always looking for new challenges and teammates!',
    favoriteGames: ['FIFA 24', 'Mobile Legends'],
    dateOfBirth: '1995-06-15',
    timezone: 'Africa/Lagos'
  });

  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGameChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        favoriteGames: [...formData.favoriteGames, value]
      });
    } else {
      setFormData({
        ...formData,
        favoriteGames: formData.favoriteGames.filter(game => game !== value)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    alert('Profile updated successfully!');
  };

  const games = ['FIFA 24', 'Mobile Legends', 'COD Warzone', 'Valorant', 'Fortnite', 'Apex Legends'];
  const countries = ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Morocco', 'Ghana', 'Tunisia', 'Algeria'];

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

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full"
                >
                  <Camera size={20} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-2">Click to change profile picture</p>
            </div>

            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="mr-2 text-primary-400" size={20} />
                Basic Information
              </h2>
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
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Africa/Lagos">Lagos (GMT+1)</option>
                    <option value="Africa/Cairo">Cairo (GMT+2)</option>
                    <option value="Africa/Johannesburg">Johannesburg (GMT+2)</option>
                    <option value="Africa/Nairobi">Nairobi (GMT+3)</option>
                    <option value="Africa/Casablanca">Casablanca (GMT+1)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Mail className="mr-2 text-primary-400" size={20} />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="mr-2 text-primary-400" size={20} />
                Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
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
                    required
                  />
                </div>
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
}</new_str>
