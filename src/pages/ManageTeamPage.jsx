// src/pages/ManageTeamPage.jsx (UPDATED for Edit Mode)

import { useState } from 'react';
import { Settings, Users, Edit3, Trash2, Shield, PlusCircle, ArrowLeft, Save, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageTeamPage() {
    // --- STATE MANAGEMENT ---
    // 1. Placeholder data for the team being managed
    const [teamData, setTeamData] = useState({
        name: 'Thunder Hawks',
        game: 'COD Warzone',
        description: 'Elite COD Warzone team from Nigeria. We dominate the African scene and are looking to expand globally.',
        membersCount: 4,
        pendingRequests: 2
    });

    // 2. State to toggle between management dashboard and profile editing mode
    const [isEditing, setIsEditing] = useState(false);

    // Placeholder data for management actions
    const managementOptions = [
        { title: "Edit Team Profile", description: "Update logo, description, and contact info.", icon: Edit3, action: () => setIsEditing(true) }, // Action is now a function
        { title: "Manage Roster", description: "Add, remove, or change member roles.", icon: Users, link: "#roster" },
        { title: "Review Join Requests", description: `Approve or decline ${teamData.pendingRequests} pending members.`, icon: PlusCircle, link: "#requests" },
        { title: "Manage Disputes/Reports", description: "Handle internal and external conduct reports.", icon: Shield, link: "#reports" },
    ];

    // Placeholder Member Data
    const members = [
{ id: 1, username: 'ThunderStrike', role: 'Captain', status: 'Active' },
{ id: 2, username: 'HawkEye92', role: 'Sniper', status: 'Active' },
{ id: 3, username: 'StormRider', role: 'Support', status: 'Active' },
{ id: 4, username: 'NightFury', role: 'Assault', status: 'Active' }
];

    // --- HANDLERS ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // In a real app, this is where you'd make an API call (e.g., PUT /api/teams/{teamId})
        console.log("Saving changes to team:", teamData);
        alert(`Team Profile Updated: ${teamData.name}`);
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Optionally reload original data here if you discard changes
        setIsEditing(false);
    };

    // --- RENDER LOGIC ---

    // The component that renders the Edit Profile Form
    const EditProfileForm = () => (
        <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-400 mb-6 flex items-center">
                <Edit3 className="w-6 h-6 mr-3" /> Edit Team Details
            </h2>

            {/* Team Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={teamData.name}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                />
            </div>

            {/* Game */}
            <div>
                <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-1">Primary Game</label>
                <input
                    type="text"
                    id="game"
                    name="game"
                    value={teamData.game}
                    onChange={handleChange}
                    className="input-field w-full"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Team Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={teamData.description}
                    onChange={handleChange}
                    className="input-field w-full resize-none"
                    required
                />
            </div>

            {/* Logo Upload - Placeholder for real functionality */}
            <div className="border-t border-dark-700 pt-4">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-2">Team Logo (Click to Upload)</label>
                <div className="bg-dark-700 border-2 border-dashed border-primary-600/50 p-6 rounded-lg text-center cursor-pointer hover:border-primary-500 transition-colors">
                    <p className="text-gray-400">Drag & Drop or Click to upload new logo</p>
                    <input type="file" id="logo" name="logo" className="hidden" accept="image/*" />
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 border-t border-dark-700 pt-6">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center"
                >
                    <XCircle size={16} className="mr-2" /> Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary flex items-center"
                >
                    <Save size={16} className="mr-2" /> Save Changes
                </button>
            </div>
        </form>
    );

    // The component that renders the Management Dashboard
    const ManagementDashboard = () => (
        <>
            <p className="text-gray-400 text-lg">
                Team: <span className="text-primary-400 font-semibold">{teamData.name}</span> | Game: {teamData.game} | Roster: {teamData.membersCount} members
            </p>

            {/* Management Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {managementOptions.map((option, index) => (
                    <div 
                        key={index} 
                        // If it has an action, use onClick; otherwise, it's a link to an anchor
                        onClick={option.action ? option.action : null}
                        className={`bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg transition-all ${
                            option.action 
                                ? 'hover:border-primary-500 cursor-pointer' 
                                : 'hover:border-primary-500/50'
                        }`}
                    >
                        <div className="flex items-center mb-3">
                            <option.icon className={`w-6 h-6 mr-3 ${option.title.includes('Request') ? 'text-yellow-400' : 'text-primary-400'}`} />
                            <h2 className="text-xl font-bold">{option.title}</h2>
                        </div>
                        <p className="text-gray-400 mb-4">{option.description}</p>
                        {/* Render link only if an anchor link is provided */}
                        {option.link && (
                            <Link to={option.link} className="btn-primary-sm flex items-center w-fit">
                                Go to Section <ArrowLeft size={16} className="ml-2 rotate-180" />
                            </Link>
                        )}
                        {/* If it's the edit button, the onClick above handles the state change */}
                    </div>
                ))}
            </div>

            {/* Roster Management Section (Example) */}
            <div id="roster" className="card mt-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-primary-400" /> Current Roster
                </h2>
                <div className="space-y-4">
                    {members.map((member) => (
                        <div key={member.id} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-3 ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                <div>
                                    <p className="font-semibold">{member.username} ({member.role})</p>
                                    <p className="text-sm text-gray-400">{member.status}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn-xs btn-secondary flex items-center">
                                    <Edit3 size={14} className="mr-1" /> Edit Role
                                </button>
                                <button className="btn-xs bg-red-600 hover:bg-red-700 text-white flex items-center">
                                    <Trash2 size={14} className="mr-1" /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Team Section */}
            <div className="card border border-red-700 bg-red-900/20 mt-10 p-6">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Danger Zone</h2>
                <p className="text-gray-300 mb-4">Permanently dissolve the team. This action cannot be undone.</p>
                <button className="btn-danger w-fit flex items-center">
                    <Trash2 className="mr-2" size={16} /> Delete Team Profile
                </button>
            </div>
        </>
    );


    return (
        <div className="pt-8 min-h-screen bg-dark-900 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <Link to="/team" className="text-primary-400 hover:text-primary-300 flex items-center mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back to Team Profile
                </Link>

                <div className="flex items-center justify-between border-b border-dark-700 pb-4">
                    <h1 className="text-4xl font-extrabold flex items-center">
                        <Settings className="w-8 h-8 mr-3 text-red-400" /> 
                        Manage {teamData.name}
                    </h1>
                </div>

                {/* Conditional Rendering based on isEditing state */}
                <div className="card">
                    {isEditing ? <EditProfileForm /> : <ManagementDashboard />}
                </div>

            </div>
        </div>
    );
}