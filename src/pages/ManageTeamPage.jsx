// src/pages/ManageTeamPage.jsx (FINAL UPDATE for file upload and redirection)

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 🔑 Import useNavigate for programmatic navigation
import { 
    Settings, Users, Edit3, Trash2, Shield, PlusCircle, ArrowLeft, Save, XCircle, 
    UserX, UserCheck, UploadCloud
} from 'lucide-react';

// Define view modes for the component
const VIEWS = {
    DASHBOARD: 'DASHBOARD',
    EDIT_PROFILE: 'EDIT_PROFILE',
    ROSTER: 'ROSTER',
    REQUESTS: 'REQUESTS',
    DISPUTES: 'DISPUTES'
};

export default function ManageTeamPage() {
    // 🔑 Initialize the navigate function
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---

    // 1. Team Data (Simulated API State)
    const [teamData, setTeamData] = useState({
        name: 'Thunder Hawks',
        game: 'COD Warzone',
        description: 'Elite COD Warzone team from Nigeria. We dominate the African scene and are looking to expand globally.',
        membersCount: 4,
        pendingRequests: 2,
        // 🔑 Add logo state (will hold a URL or base64 string for preview)
        logoPreview: 'https://via.placeholder.com/150?text=Current+Logo', 
    });

    // 2. Separate state for the actual file object for submission
    const [logoFile, setLogoFile] = useState(null); 

    // 3. Main View State (Controls which section is visible)
    const [managementView, setManagementView] = useState(VIEWS.DASHBOARD);

    // 4. Member Data (Placeholder)
    const members = [
{ id: 1, username: 'ThunderStrike', role: 'Captain', status: 'Active' },
{ id: 2, username: 'HawkEye92', role: 'Sniper', status: 'Active' },
{ id: 3, username: 'StormRider', role: 'Support', status: 'Active' },
{ id: 4, username: 'NightFury', role: 'Assault', status: 'Active' }
];

    // 5. Pending Requests Data (Placeholder)
    const pendingRequests = [
        { id: 101, username: 'SniperAce', requestedRole: 'Sniper', kda: '1.55', date: '2024-10-14' },
        { id: 102, username: 'MedicMan', requestedRole: 'Support', kda: '0.89', date: '2024-10-15' },
    ];

    // Placeholder data for management actions
    const managementOptions = [
        { title: "Edit Team Profile", description: "Update logo, description, and contact info.", icon: Edit3, action: () => setManagementView(VIEWS.EDIT_PROFILE) },
        { title: "Manage Roster", description: "Add, remove, or change member roles.", icon: Users, action: () => setManagementView(VIEWS.ROSTER) },
        { title: "Review Join Requests", description: `Approve or decline ${teamData.pendingRequests} pending members.`, icon: PlusCircle, action: () => setManagementView(VIEWS.REQUESTS) },
        { title: "Manage Disputes/Reports", description: "Handle internal and external conduct reports.", icon: Shield, action: () => setManagementView(VIEWS.DISPUTES) },
    ];

    // --- HANDLERS ---

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeamData(prev => ({ ...prev, [name]: value }));
    };

    // 🔑 Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file) {
            setLogoFile(file); // Store the actual file object

            // Create a temporary URL for instant preview
            const previewUrl = URL.createObjectURL(file);
            setTeamData(prev => ({ ...prev, logoPreview: previewUrl }));
        } else {
             setLogoFile(null);
             // Optionally reset preview to a default if user cancels selection
        }
    };


    // 🔑 Handle form submission and redirection
    const handleSaveProfile = (e) => {
        e.preventDefault();

        // 1. Simulate API call for form data
        console.log("Saving changes to team details:", teamData);

        // 2. If a new logo file is present, handle the upload
        if (logoFile) {
            console.log("Uploading logo file:", logoFile.name, "Type:", logoFile.type);
            // In a real app, you would use FormData here to POST the file
            // e.g., const formData = new FormData(); formData.append('logo', logoFile); 
        }

        alert(`Team Profile Updated: ${teamData.name}`);

        // 3. Redirect the user to the Team Profile page after successful save
        navigate('/team'); 
    };

    // --- SUB-COMPONENTS ---

    const EditProfileForm = () => (
        <form onSubmit={handleSaveProfile} className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-400 mb-6 flex items-center">
                <Edit3 className="w-6 h-6 mr-3" /> Edit Team Details
            </h2>

            {/* Logo Upload Section */}
            <div className="flex items-center space-x-6 border-b border-dark-700 pb-6">
                <img 
                    src={teamData.logoPreview} 
                    alt="Team Logo Preview" 
                    className="w-24 h-24 object-cover rounded-full border-2 border-primary-500"
                />
                <div className="flex-1">
                    <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-2">Change Team Logo</label>

                    {/* The Hidden Input & Visible Button */}
                    <input 
                        type="file" 
                        id="logo-upload" 
                        name="logo-upload" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden" 
                    />
                    <label 
                        htmlFor="logo-upload" 
                        className="btn-secondary flex items-center w-fit cursor-pointer hover:bg-dark-600 transition-colors"
                    >
                        <UploadCloud size={16} className="mr-2" /> 
                        {logoFile ? logoFile.name : "Select New Logo"}
                    </label>
                    {logoFile && <p className="text-xs text-green-400 mt-1">Logo selected for upload.</p>}
                </div>
            </div>


            {/* Team Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Team Name</label>
                <input type="text" id="name" name="name" value={teamData.name} onChange={handleChange} className="input-field w-full" required />
            </div>

            {/* Game */}
            <div>
                <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-1">Primary Game</label>
                <input type="text" id="game" name="game" value={teamData.game} onChange={handleChange} className="input-field w-full" required />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Team Description</label>
                <textarea id="description" name="description" rows="4" value={teamData.description} onChange={handleChange} className="input-field w-full resize-none" required />
            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-4 border-t border-dark-700 pt-6">
                <button
                    type="button"
                    onClick={() => setManagementView(VIEWS.DASHBOARD)}
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

    // --- (RosterManagement, JoinRequests, DisputesReports, ManagementDashboard components remain the same) ---
    // ... (rest of the component code from the previous version)

    // The component that renders the Management Dashboard overview
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
                        onClick={option.action}
                        className="bg-dark-800 p-6 rounded-xl border border-dark-700 shadow-lg hover:border-primary-500 cursor-pointer transition-all"
                    >
                        <div className="flex items-center mb-3">
                            <option.icon className={`w-6 h-6 mr-3 ${option.title.includes('Request') ? 'text-yellow-400' : 'text-primary-400'}`} />
                            <h2 className="text-xl font-bold">{option.title}</h2>
                        </div>
                        <p className="text-gray-400 mb-4">{option.description}</p>
                        <span className="btn-primary-sm flex items-center w-fit">
                            Go to Section <ArrowLeft size={16} className="ml-2 rotate-180" />
                        </span>
                    </div>
                ))}
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

    const RosterManagement = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-400 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3" /> Manage Roster
            </h2>
            <p className="text-gray-400">Total Active Members: {members.length}</p>

            <div className="flex justify-end">
                <button className="btn-primary-sm flex items-center">
                    <PlusCircle size={16} className="mr-2" /> Invite New Player
                </button>
            </div>

            {/* Roster List */}
            <div className="space-y-3">
                {members.map((member) => (
                    <div key={member.id} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-3 ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                            <div>
                                <p className="font-semibold">{member.username} ({member.role})</p>
                                <p className="text-sm text-gray-400">Status: {member.status}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-xs btn-secondary flex items-center">
                                <Edit3 size={14} className="mr-1" /> Edit Role
                            </button>
                            <button className="btn-xs bg-red-600 hover:bg-red-700 text-white flex items-center">
                                <Trash2 size={14} className="mr-1" /> Kick
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end border-t border-dark-700 pt-6">
                <button
                    onClick={() => setManagementView(VIEWS.DASHBOARD)}
                    className="btn-secondary flex items-center"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>
        </div>
    );

    const JoinRequests = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center">
                <PlusCircle className="w-6 h-6 mr-3" /> Review Join Requests
            </h2>
            <p className="text-gray-400">You have **{pendingRequests.length}** new requests to review.</p>

            {/* Requests List */}
            <div className="space-y-3">
                {pendingRequests.map((request) => (
                    <div key={request.id} className="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{request.username}</p>
                            <p className="text-sm text-gray-400">Requested Role: <span className="text-primary-400">{request.requestedRole}</span></p>
                            <p className="text-xs text-gray-500">KDA: {request.kda} | Requested on {new Date(request.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-xs bg-green-600 hover:bg-green-700 text-white flex items-center">
                                <UserCheck size={14} className="mr-1" /> Approve
                            </button>
                            <button className="btn-xs bg-red-600 hover:bg-red-700 text-white flex items-center">
                                <UserX size={14} className="mr-1" /> Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end border-t border-dark-700 pt-6">
                <button
                    onClick={() => setManagementView(VIEWS.DASHBOARD)}
                    className="btn-secondary flex items-center"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>
        </div>
    );

    const DisputesReports = () => (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3" /> Manage Disputes & Reports
            </h2>
            <p className="text-gray-400">Review and resolve reported issues concerning team members' conduct.</p>

            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                <h4 className="font-semibold mb-2">Report #452: Player Toxicity</h4>
                <p className="text-sm text-gray-300 mb-2">**Filed Against:** HawkEye92</p>
                <p className="text-sm text-gray-400">Report details: Excessive trash talk and harassment directed at an opponent in a public match.</p>
                <div className="mt-3 flex gap-2">
                    <button className="btn-xs bg-blue-600 hover:bg-blue-700 text-white">View Details</button>
                    <button className="btn-xs btn-secondary">Dismiss</button>
                </div>
            </div>

            <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                <h4 className="font-semibold mb-2">Dispute #12: Role Conflict</h4>
                <p className="text-sm text-gray-300 mb-2">**Filed By:** StormRider</p>
                <p className="text-sm text-gray-400">Dispute details: Conflict over primary game role assignments impacting team synergy.</p>
                <div className="mt-3 flex gap-2">
                    <button className="btn-xs bg-blue-600 hover:bg-blue-700 text-white">View Details</button>
                </div>
            </div>

            <div className="flex justify-end border-t border-dark-700 pt-6">
                <button
                    onClick={() => setManagementView(VIEWS.DASHBOARD)}
                    className="btn-secondary flex items-center"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
            </div>
        </div>
    );


    // --- MAIN RENDER FUNCTION ---
    const renderView = () => {
        switch (managementView) {
            case VIEWS.EDIT_PROFILE:
                return <EditProfileForm />;
            case VIEWS.ROSTER:
                return <RosterManagement />;
            case VIEWS.REQUESTS:
                return <JoinRequests />;
            case VIEWS.DISPUTES:
                return <DisputesReports />;
            case VIEWS.DASHBOARD:
            default:
                return <ManagementDashboard />;
        }
    };


    return (
        <div className="pt-8 min-h-screen bg-dark-900 text-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <Link to="/team" className="text-primary-400 hover:text-primary-300 flex items-center mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back to Team Profile
                </Link>

                <div className="flex items-center justify-between border-b border-dark-700 pb-4">
                    <h1 className="text-4xl font-extrabold flex items-center">
                        <Settings className="w-8 h-8 mr-3 text-red-400" /> 
                        {/* Display the current section title or default to Manage Team Name */}
                        {managementView === VIEWS.DASHBOARD 
                            ? `Manage ${teamData.name}` 
                            : managementOptions.find(o => o.action.toString().includes(`setManagementView('${managementView}')`))?.title || `Manage ${teamData.name}`}
                    </h1>
                </div>

                {/* The main card dynamically renders the selected management view */}
                <div className="card">
                    {renderView()}
                </div>

            </div>
        </div>
    );
}