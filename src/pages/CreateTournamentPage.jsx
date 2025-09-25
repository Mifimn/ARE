
<old_str>import { Plus } from 'lucide-react';

export default function CreateTournamentPage() {
  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            <Plus className="mr-3 text-primary-500" size={32} />
            Create New Tournament
          </h1>
          <p className="text-gray-300">Tournament creation form will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}</old_str>
<new_str>import { useState } from 'react';
import { Plus, Calendar, Trophy, Users, MapPin, Save, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateTournamentPage() {
  const [formData, setFormData] = useState({
    name: '',
    game: 'FIFA 24',
    description: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxParticipants: '64',
    prizePool: '',
    entryFee: '0',
    format: 'single-elimination',
    platform: 'console',
    region: 'africa',
    rules: '',
    streamingPlatform: '',
    contactEmail: '',
    isPublic: true,
    allowTeams: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tournament created:', formData);
    alert('Tournament created successfully!');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <Plus className="mr-3 text-primary-500" size={32} />
              Create New Tournament
            </h1>
            <div className="flex gap-4">
              {currentStep === totalSteps && (
                <button 
                  onClick={handleSubmit}
                  className="btn-primary flex items-center"
                >
                  <Save className="mr-2" size={16} />
                  Create Tournament
                </button>
              )}
              <Link to="/tournaments" className="btn-secondary flex items-center">
                <X className="mr-2" size={16} />
                Cancel
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-700 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-dark-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={currentStep >= 1 ? 'text-primary-400' : 'text-gray-400'}>Basic Info</span>
              <span className={currentStep >= 2 ? 'text-primary-400' : 'text-gray-400'}>Settings</span>
              <span className={currentStep >= 3 ? 'text-primary-400' : 'text-gray-400'}>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tournament Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter tournament name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Game *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platform *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Region *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="organizer@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
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
              </div>
            )}

            {/* Step 2: Tournament Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Tournament Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Date *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Registration Deadline *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Participants *
                    </label>
                    <select
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="8">8</option>
                      <option value="16">16</option>
                      <option value="32">32</option>
                      <option value="64">64</option>
                      <option value="128">128</option>
                      <option value="256">256</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tournament Format *
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Entry Fee ($)
                    </label>
                    <input
                      type="number"
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleChange}
                      className="input-field"
                      min="0"
                      placeholder="0"
                    />
                  </div>

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
                      placeholder="1000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Streaming Platform
                    </label>
                    <input
                      type="url"
                      name="streamingPlatform"
                      value={formData.streamingPlatform}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://twitch.tv/your-channel"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="isPublic"
                      name="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">
                      Make tournament public (visible to all users)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="allowTeams"
                      name="allowTeams"
                      type="checkbox"
                      checked={formData.allowTeams}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowTeams" className="ml-2 block text-sm text-gray-300">
                      Allow team registration (vs individual players only)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tournament Rules
                  </label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    rows={6}
                    className="input-field"
                    placeholder="Enter detailed tournament rules and regulations..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Review Tournament Details</h2>
                
                <div className="bg-dark-800 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-primary-400 mb-2">Basic Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Name:</span> {formData.name}</p>
                        <p><span className="text-gray-400">Game:</span> {formData.game}</p>
                        <p><span className="text-gray-400">Platform:</span> {formData.platform}</p>
                        <p><span className="text-gray-400">Region:</span> {formData.region}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary-400 mb-2">Tournament Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Format:</span> {formData.format}</p>
                        <p><span className="text-gray-400">Max Participants:</span> {formData.maxParticipants}</p>
                        <p><span className="text-gray-400">Prize Pool:</span> ${formData.prizePool || '0'}</p>
                        <p><span className="text-gray-400">Entry Fee:</span> ${formData.entryFee}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary-400 mb-2">Schedule</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Start Date:</span> {formData.startDate}</p>
                        <p><span className="text-gray-400">End Date:</span> {formData.endDate}</p>
                        <p><span className="text-gray-400">Registration Deadline:</span> {formData.registrationDeadline}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary-400 mb-2">Settings</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-400">Public:</span> {formData.isPublic ? 'Yes' : 'No'}</p>
                        <p><span className="text-gray-400">Allow Teams:</span> {formData.allowTeams ? 'Yes' : 'No'}</p>
                        <p><span className="text-gray-400">Contact:</span> {formData.contactEmail}</p>
                      </div>
                    </div>
                  </div>

                  {formData.description && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-primary-400 mb-2">Description</h3>
                      <p className="text-sm text-gray-300">{formData.description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-400 mb-1">Before Creating</h4>
                      <p className="text-sm text-yellow-300">
                        Please review all details carefully. Once created, some settings cannot be changed.
                        Make sure all dates, rules, and prize information are accurate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-dark-700">
              <button
                type="button"
                onClick={prevStep}
                className={`btn-secondary ${currentStep === 1 ? 'invisible' : ''}`}
              >
                Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <Save className="mr-2" size={16} />
                  Create Tournament
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}</new_str>
