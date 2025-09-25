
<old_str>import { Edit } from 'lucide-react';

export default function UpdateTournamentPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Edit className="mr-3 text-primary-500" size={32} />
            Update Tournament
          </h1>
          <p className="text-gray-300">Tournament update form will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}</old_str>
<new_str>import { useState } from 'react';
import { Edit, Calendar, Trophy, Users, MapPin, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UpdateTournamentPage() {
  const [formData, setFormData] = useState({
    name: 'FIFA 24 African Championship',
    game: 'FIFA 24',
    description: 'The biggest FIFA tournament in Africa featuring top players from across the continent.',
    startDate: '2024-03-15',
    endDate: '2024-03-17',
    registrationDeadline: '2024-03-10',
    maxParticipants: '128',
    prizePool: '5000',
    format: 'single-elimination',
    platform: 'console',
    region: 'africa',
    rules: 'Standard FIFA 24 rules apply. No exploits or glitches allowed.'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tournament updated:', formData);
    alert('Tournament updated successfully!');
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Edit className="mr-3 text-primary-500" size={32} />
              Update Tournament
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={handleSubmit}
                className="btn-primary flex items-center"
              >
                <Save className="mr-2" size={16} />
                Save Changes
              </button>
              <Link to="/tournaments" className="btn-secondary flex items-center">
                <X className="mr-2" size={16} />
                Cancel
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tournament Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tournament Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Game Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game
                </label>
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="FIFA 24">FIFA 24</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="COD Warzone">COD Warzone</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Apex Legends">Apex Legends</option>
                </select>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="single-elimination">Single Elimination</option>
                  <option value="double-elimination">Double Elimination</option>
                  <option value="round-robin">Round Robin</option>
                  <option value="swiss">Swiss System</option>
                </select>
              </div>

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="input-field"
                  min="8"
                  max="1024"
                  required
                />
              </div>

              {/* Prize Pool */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prize Pool ($)
                </label>
                <input
                  type="number"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  required
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Registration Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* Platform */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="pc">PC</option>
                  <option value="console">Console</option>
                  <option value="mobile">Mobile</option>
                  <option value="cross-platform">Cross Platform</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Region
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="africa">Africa</option>
                  <option value="west-africa">West Africa</option>
                  <option value="east-africa">East Africa</option>
                  <option value="north-africa">North Africa</option>
                  <option value="south-africa">South Africa</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Describe your tournament..."
                required
              />
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tournament Rules
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Enter tournament rules and regulations..."
                required
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}</new_str>
