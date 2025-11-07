// src/pages/CreateTournamentPage.jsx

import { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Trophy, Users, Save, X, AlertCircle, Info, Settings, Eye, FileText, Gamepad2, Layers, DollarSign, Gem, ListChecks, Loader2, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useAuth } from '../contexts/AuthContext'; 
import { supabase } from '../lib/supabaseClient'; 

// --- UPDATED: Game Lists ---
const availableGames = [
    'Free Fire',
    'Mobile Legends',
    'Mobile Legends (Pro League)', // --- NEW ---
    'Farlight 84',
].sort();

// --- UPDATED: Game Details ---
const defaultGameRules = {
    'Free Fire': `1. Game Mode: Battle Royale.\n2. Map: TBD (Set by Admin).\n3. Squad Size: Squads (4).\n4. Points: Standard BR points (Placement + Kills).\n5. Fair Play: No hacks, exploits, or teaming.`,
    'Mobile Legends': `1. Game Mode: Draft Pick.\n2. Map: Land of Dawn.\n3. Format: Round Robin (Bo3) into Single Elimination Playoffs.\n4. Team Size: 5v5.\n5. Fair Play: Exploits/Bugs strictly prohibited.`,
    // --- NEW ---
    'Mobile Legends (Pro League)': `AML PRO LEAGUE - 5-STAGE FORMAT\n1. Stage 1: Open Qualifiers\n2. Stage 2: Knockout Stage\n3. Stage 3: Group Stage (Seeded teams join here)\n4. Stage 4: Playoffs\n5. Stage 5: Grand Finals\n\nAll matches are 5v5 Draft Pick on Land of Dawn.`,
    'Farlight 84': `1. Game Mode: Battle Royale (Hunt).\n2. Map: TBD (Set by Admin).\n3. Squad Size: Squads (4).\n4. Points: Standard BR points (Placement + Kills).\n5. Fair Play enforced.`
};

const gameSpecificSettingOptions = {
    'Free Fire': { modes: ['Battle Royale', 'Clash Squad'], maps: ['Bermuda', 'Purgatory', 'Kalahari', 'Alpine', 'NeXTerra'], teamSizes: ['Squads (4)'] },
    'Mobile Legends': { modes: ['Draft Pick'], map: ['Land of Dawn'], teamSize: ['5v5'] },
    'Mobile Legends (Pro League)': { modes: ['Draft Pick'], map: ['Land of Dawn'], teamSize: ['5v5'] }, // --- NEW ---
    'Farlight 84': { modes: ['Battle Royale', 'Hunt'], maps: ['Sunset City', 'Lampton'], teamSizes: ['Squads (4)'] }
};

// --- UPDATED: Helper functions to get implicit format ---
const getTournamentFormat = (gameName) => {
    switch(gameName) {
        case 'Free Fire': return 'grouped-multi-stage-br';
        case 'Farlight 84': return 'multi-stage-br';
        case 'Mobile Legends': return 'round-robin-to-bracket';
        case 'Mobile Legends (Pro League)': return 'mlbb-pro-series'; // --- NEW ---
        default: return 'unknown';
    }
};

const getFormatDescription = (gameName) => {
    switch(gameName) {
        case 'Free Fire': return 'A multi-stage Battle Royale qualifier format with group draws and advancement.';
        case 'Farlight 84': return 'A multi-week Battle Royale league where points accumulate over all weeks.';
        case 'Mobile Legends': return 'A Round Robin league stage that seeds into a final Single Elimination playoff bracket.';
        case 'Mobile Legends (Pro League)': return 'A 5-stage progressive series: Open Qualifiers -> Knockout -> Groups -> Playoffs -> Finals.'; // --- NEW ---
        default: return 'Select a game to see the format.';
    }
};

const getInitialGameSettings = (gameName) => {
    // --- UPDATED to handle new format ---
    const settings = gameSpecificSettingOptions[gameName];
    if (!settings) return {};
    const initial = {};
    if (settings.modes) initial.mode = settings.modes[0];
    if (settings.maps) initial.map = settings.maps[0];
    if (settings.map) initial.map = settings.map[0]; // Handle single map case
    if (settings.teamSizes) initial.teamSize = settings.teamSizes[settings.teamSizes.length -1]; // Default to largest size
    if (settings.teamSize) initial.teamSize = settings.teamSize[0]; // Handle single team size
    return initial;
};
// --- End Game Details ---


// --- Custom Modal Component (Unchanged) ---
const CustomModal = ({ isOpen, onClose, title, children, promptLabel, onPromptSubmit, showCancel = true, confirmText = 'OK', onConfirm, customBody, large = false }) => {
    const [inputValue, setInputValue] = useState('');
    useEffect(() => { if (isOpen) setInputValue(''); }, [isOpen, promptLabel]);
    if (!isOpen) return null;
    const isPrompt = !!promptLabel;

    const handleConfirm = () => {
        if (isPrompt && onPromptSubmit) {
            onPromptSubmit(inputValue);
        } else if (onConfirm) {
            onConfirm();
        }
        if (!onConfirm) {
            onClose();
        }
    };

    const Icon = isPrompt ? HelpCircle : (title && title.toLowerCase().includes('error')) ? AlertCircle : Info;
    const iconColor = (title && title.toLowerCase().includes('error')) ? 'text-red-400' : 'text-primary-400';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div className={`bg-dark-800 rounded-xl shadow-2xl w-full ${large ? 'max-w-4xl' : 'max-w-md'} border border-dark-600 relative animate-fade-in`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-dark-700">
                    <div className="flex items-center"> <Icon className={`w-5 h-5 mr-3 ${iconColor}`} /> <h3 className="text-lg font-semibold text-white">{title || (isPrompt ? 'Input Required' : 'Alert')}</h3> </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white rounded-full p-1 transition-colors" aria-label="Close modal"> <X size={20} /> </button>
                </div>
                {customBody ? customBody : (
                    <div className="p-6 space-y-4">
                        {children && <div className="text-gray-300 text-sm">{children}</div>}
                        {isPrompt && ( <div> <label htmlFor="promptInput" className="block text-sm font-medium text-gray-300 mb-2">{promptLabel}</label> <input id="promptInput" type="number" min="2" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="input-field w-full" autoFocus /> </div> )}
                    </div>
                )}
                <div className="flex justify-end gap-3 p-4 bg-dark-700/50 border-t border-dark-700 rounded-b-xl">
                    {showCancel && (<button onClick={onClose} className="btn-secondary text-sm">Cancel</button>)}
                    <button onClick={handleConfirm} className="btn-primary text-sm">{isPrompt ? 'Submit' : confirmText}</button>
                </div>
            </div>
        </div>
    );
};


export default function CreateTournamentPage() {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const defaultGame = availableGames[0];

    // --- UPDATED: Added MLBB Pro Series Configs ---
    const [formData, setFormData] = useState({
        name: '',
        game: defaultGame,
        description: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxParticipants: '20',
        prizePool: '',
        prizeType: 'Cash (USD)',
        prizeCurrencyName: '',
        entryFee: '0',
        platform: 'mobile',
        region: 'africa',
        rules: defaultGameRules[defaultGame] || '',
        extraRules: '',
        gameSpecificSettings: getInitialGameSettings(defaultGame),
        streamingPlatform: '',
        contactEmail: '',
        isPublic: true,
        allowTeams: true,

        // Simplified Stage Configs
        ff_qualifier_matches_per_group: '3',
        ff_playoff_matches_per_group: '6',
        ff_final_matches: '8',
        fl84_matches_per_week: '5',
        mlbb_league_rounds: '5',
        mlbb_playoff_teams: '8',

        // --- NEW: MLBB Pro Series Configs (for the 48-team path) ---
        mlbb_pro_qualifier_teams: '48', // Stage 1 (48 teams)
        mlbb_pro_knockout_teams: '32',  // Stage 2 (32 teams)
        mlbb_pro_group_teams: '16',     // Stage 3 (16 teams from S2)
        mlbb_pro_groups_in_stage_3: '4',// This is for Stage 3 winners
        mlbb_pro_playoff_teams: '8',    // Stage 4
        mlbb_pro_final_teams: '4',      // Stage 5
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false); 
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const [alertModal, setAlertModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        confirmText: 'OK',
        showCancel: false
    });

    const totalSteps = 3;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prevData => {
            let newData = { ...prevData };

            if (name.startsWith('gameSpecificSettings.')) {
                const key = name.split('.')[1];
                newData = {
                    ...prevData,
                    gameSpecificSettings: {
                        ...prevData.gameSpecificSettings,
                        [key]: value
                    }
                };
            } else {
                newData = {
                    ...prevData,
                    [name]: type === 'checkbox' ? checked : value
                };
            }

            // --- UPDATED: Handle game change logic ---
            if (name === 'game') {
                newData.rules = defaultGameRules[value] || '';
                newData.gameSpecificSettings = getInitialGameSettings(value);

                if (value === 'Free Fire') newData.maxParticipants = '60';
                if (value === 'Farlight 84') newData.maxParticipants = '20';
                if (value === 'Mobile Legends') newData.maxParticipants = '32';
                if (value === 'Mobile Legends (Pro League)') newData.maxParticipants = '64'; // --- NEW ---
            }

            return newData;
        });
    };

    const processSave = async () => {
        setIsLoading(true);

        if (!user) {
            setAlertModal({ isOpen: true, title: 'Authentication Error', message: 'You must be logged in to create a tournament.' });
            setIsLoading(false);
            setIsConfirmModalOpen(false); // Close the confirmation modal
            return;
        }

        const format = getTournamentFormat(formData.game);
        let stages = [];

        if (format === 'grouped-multi-stage-br') { // Free Fire
            stages = [
                { id: 1, name: 'Qualifiers', status: 'Setup', totalTeams: 60, groups: 5, groupSize: 12, matchesPerGroup: parseInt(formData.ff_qualifier_matches_per_group), advanceRule: 'Top 9 per group + 3 Wildcard' },
                { id: 2, name: 'Playoff to 48', status: 'Pending', totalTeams: 48, groups: 4, groupSize: 12, matchesPerGroup: parseInt(formData.ff_playoff_matches_per_group), advanceRule: 'Top 3 per group' },
                { id: 3, name: 'Grand Final', status: 'Pending', totalTeams: 12, groups: 1, groupSize: 12, matchesPerGroup: parseInt(formData.ff_final_matches), advanceRule: 'Crown Champion' },
            ];
        } else if (format === 'multi-stage-br') { // Farlight 84
            const matchesPerWeek = parseInt(formData.fl84_matches_per_week);
            stages = [
                { id: 1, name: 'Week 1', status: 'Setup', totalTeams: 20, matchesPerWeek: matchesPerWeek, advanceRule: 'Points accumulate' },
                { id: 2, name: 'Week 2', status: 'Pending', totalTeams: 20, matchesPerWeek: matchesPerWeek, advanceRule: 'Points accumulate' },
                { id: 3, name: 'Week 3', status: 'Pending', totalTeams: 20, matchesPerWeek: matchesPerWeek, advanceRule: 'Points accumulate' },
                { id: 4, name: 'Week 4 - Finals', status: 'Pending', totalTeams: 20, matchesPerWeek: matchesPerWeek, advanceRule: 'Final standings determine rewards' },
            ];
        } else if (format === 'round-robin-to-bracket') { // Mobile Legends (Old)
            const advancing = parseInt(formData.mlbb_playoff_teams);
            const maxParticipants = parseInt(formData.maxParticipants);
            stages = [
                { id: 1, name: 'Group Stage (Round Robin)', totalTeams: maxParticipants, rounds: parseInt(formData.mlbb_league_rounds), type: 'League', advancementRule: `Top ${advancing} advance to Playoffs` },
                { id: 2, name: 'Playoff Bracket', totalTeams: advancing, type: 'Single Elimination', advancementRule: `Top ${advancing} seeded into BO3 bracket.` }
            ];
        // --- NEW: MLBB Pro Series Logic ---
        } else if (format === 'mlbb-pro-series') { 
            const s1_teams = parseInt(formData.mlbb_pro_qualifier_teams); // e.g., 48
            const s2_teams = parseInt(formData.mlbb_pro_knockout_teams);  // e.g., 32
            const s3_teams = parseInt(formData.mlbb_pro_group_teams);     // e.g., 16 (from qualifiers) + 16 (seeded) = 32
            const s3_groups = parseInt(formData.mlbb_pro_groups_in_stage_3);
            const s4_teams = parseInt(formData.mlbb_pro_playoff_teams);    // e.g., 8
            const s5_teams = parseInt(formData.mlbb_pro_final_teams);      // e.g., 4

            // This calculates the TOTAL teams for Stage 3 (16 from qualifiers + 16 seeded)
            const s3_total_teams = s3_teams + 16; 

            stages = [
                { id: 1, name: 'Open Qualifiers', status: 'Setup', totalTeams: s1_teams, format: 'Bracket', advanceRule: `Top ${s2_teams} advance` },
                { id: 2, name: 'Knockout Stage', status: 'Pending', totalTeams: s2_teams, format: 'Bracket', advanceRule: `Top ${s3_teams} advance` },
                { id: 3, name: 'Group Stage', status: 'Pending', totalTeams: s3_total_teams, groups: s3_groups, groupSize: s3_total_teams / s3_groups, format: 'Groups', advanceRule: `Top ${s4_teams} advance` },
                { id: 4, name: 'Playoffs', status: 'Pending', totalTeams: s4_teams, format: 'Bracket', advanceRule: `Top ${s5_teams} advance` },
                { id: 5, name: 'Grand Finals', status: 'Pending', totalTeams: s5_teams, format: 'Bracket', advanceRule: 'Crown Champion' }
            ];
        }
        // --- END NEW ---

        const newTournamentData = {
            organizer_id: user.id,
            name: formData.name,
            game: formData.game,
            description: formData.description,
            platform: formData.platform,
            region: formData.region,
            contact_email: formData.contactEmail,
            start_date: formData.startDate,
            end_date: formData.endDate,
            registration_deadline: formData.registrationDeadline,
            max_participants: parseInt(formData.maxParticipants),
            prize_pool_amount: parseInt(formData.prizePool || 0),
            prize_type: formData.prizeType,
            prize_currency: formData.prizeType === 'In-Game Currency' ? formData.prizeCurrencyName : null,
            entry_fee: parseInt(formData.entryFee || 0),
            format: format,
            stages: stages, // <-- This saves our new 5-stage array
            stream_url: formData.streamingPlatform,
            rules: formData.rules,
            extra_rules: formData.extraRules,
            game_settings: formData.gameSpecificSettings,
            is_public: formData.isPublic,
            status: 'Draft',
            current_stage: 1 
        };

        const { data, error: insertError } = await supabase
            .from('tournaments')
            .insert(newTournamentData)
            .select()
            .single(); 

        setIsLoading(false);
        setIsConfirmModalOpen(false); // Close the confirmation modal

        if (insertError) {
            console.error('Supabase Insert Error:', insertError.message);
            setAlertModal({ 
                isOpen: true, 
                title: 'Error Creating Tournament', 
                message: `Failed to create tournament: ${insertError.message}` 
            });
        } else if (data) {
            console.log('Tournament created:', data);
            setAlertModal({
                isOpen: true,
                title: 'Success!',
                message: 'Tournament created successfully. You will now be redirected to the management page.',
                onConfirm: () => {
                    setAlertModal({ isOpen: false }); // Close this modal
                    navigate(`/update-tournament/${data.id}`); // Navigate
                },
                confirmText: 'Go to Manager',
                showCancel: false
            });
        }
    };

    const handleConfirmAndSubmit = () => {
        setIsConfirmModalOpen(true);
    };

    const handleFinalSubmit = () => {
        processSave();
    };

    const nextStep = () => { 
        if (currentStep === 1) {
            if (!formData.name || !formData.contactEmail || !formData.description) {
                setAlertModal({ 
                    isOpen: true, 
                    title: 'Missing Information', 
                    message: 'Please fill in all required fields in Step 1: Tournament Name, Contact Email, and Description.' 
                });
                return;
            }
        }
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1); 
    };
    const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

    // --- Styling helpers (Unchanged) ---
    const stepIconClass = (step) => `w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${ step <= currentStep ? 'bg-primary-600 text-white border-primary-600' : 'bg-dark-700 text-gray-400 border-dark-600' }`;
    const stepLineClass = (step) => `flex-1 h-1 mx-2 transition-colors duration-300 ${ step < currentStep ? 'bg-primary-600' : 'bg-dark-700' }`;
    const stepLabelClass = (step) => `transition-colors duration-300 ${ step <= currentStep ? 'text-primary-400 font-semibold' : 'text-gray-400' }`;


    // --- Helper Component to Render Game Specific Fields (Unchanged) ---
    const GameSpecificFields = ({ gameName, settings, onChange }) => {
        const options = gameSpecificSettingOptions[gameName];
        if (!options) return null;

        return (
            <div className="p-4 bg-dark-800 rounded-lg border border-primary-500/30 space-y-4">
                <h3 className="text-lg font-semibold text-primary-400 flex items-center">
                    <Gamepad2 size={18} className="mr-2"/> {gameName} Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {options.modes && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Game Mode</label>
                            <select name="gameSpecificSettings.mode" value={settings.mode || ''} onChange={onChange} className="input-field text-sm appearance-none">
                                {options.modes.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                            </select>
                        </div>
                    )}
                    {options.maps && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Map (Default)</label>
                            <select name="gameSpecificSettings.map" value={settings.map || ''} onChange={onChange} className="input-field text-sm appearance-none">
                                {options.maps.map(map => <option key={map} value={map}>{map}</option>)}
                            </select>
                        </div>
                    )}
                    {options.map && !options.maps && ( // For MLBB
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1">Map</label>
                           <input type="text" value={options.map} readOnly className="input-field text-sm bg-dark-600 text-gray-400 cursor-not-allowed"/>
                        </div>
                       )}
                    {options.teamSizes && (
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Team Size</label>
                            <select name="gameSpecificSettings.teamSize" value={settings.teamSize || ''} onChange={onChange} className="input-field text-sm appearance-none">
                                {options.teamSizes.map(size => <option key={size} value={size}>{size}</option>)}
                            </select>
                        </div>
                    )}
                    {options.teamSize && !options.teamSizes && ( // For MLBB
                        <div>
                           <label className="block text-xs font-medium text-gray-400 mb-1">Team Size</label>
                           <input type="text" value={options.teamSize} readOnly className="input-field text-sm bg-dark-600 text-gray-400 cursor-not-allowed"/>
                        </div>
                       )}
                </div>
            </div>
        );
    };

    // --- UPDATED: Helper Component to Render Stage Config Fields ---
    const StageConfigFields = ({ gameName, formData, onChange }) => {
        if (gameName === 'Free Fire') {
            return (
                <div className="bg-dark-900/50 p-4 rounded-lg border border-primary-600/50 space-y-4">
                    <div className="flex items-center mb-3">
                        <ListChecks size={18} className="mr-2 text-primary-400" />
                        <h4 className="text-md font-semibold text-primary-300">Free Fire Stage Setup (Matches per Group)</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Qualifier Matches</label>
                            <input type="number" name="ff_qualifier_matches_per_group" value={formData.ff_qualifier_matches_per_group} onChange={onChange} className="input-field" min="1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Playoff Matches</label>
                            <input type="number" name="ff_playoff_matches_per_group" value={formData.ff_playoff_matches_per_group} onChange={onChange} className="input-field" min="1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Finals Matches</label>
                            <input type="number" name="ff_final_matches" value={formData.ff_final_matches} onChange={onChange} className="input-field" min="1" required />
                        </div>
                    </div>
                </div>
            );
        }
        if (gameName === 'Farlight 84') {
             return (
                <div className="bg-dark-900/50 p-4 rounded-lg border border-primary-600/50 space-y-4">
                    <div className="flex items-center mb-3">
                        <ListChecks size={18} className="mr-2 text-primary-400" />
                        <h4 className="text-md font-semibold text-primary-300">Farlight 84 League Setup</h4>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Matches per Week</label>
                        <input type="number" name="fl84_matches_per_week" value={formData.fl84_matches_per_week} onChange={onChange} className="input-field max-w-xs" min="1" required />
                        <p className="text-xs text-gray-400 mt-1">This number of matches will be played each of the 4 weeks.</p>
                    </div>
                </div>
            );
        }
        if (gameName === 'Mobile Legends') {
             return (
                <div className="bg-dark-900/50 p-4 rounded-lg border border-primary-600/50 space-y-4">
                    <div className="flex items-center mb-3">
                        <ListChecks size={18} className="mr-2 text-primary-400" />
                        <h4 className="text-md font-semibold text-primary-300">Mobile Legends League Setup</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Total League Rounds</label>
                            <input type="number" name="mlbb_league_rounds" value={formData.mlbb_league_rounds} onChange={handleChange} className="input-field" min="1" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Teams Advancing to Playoffs</label>
                            <select name="mlbb_playoff_teams" value={formData.mlbb_playoff_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="4">Top 4</option>
                                <option value="8">Top 8</option>
                                <option value="16">Top 16</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
        // --- NEW: MLBB Pro Series Config UI ---
        if (gameName === 'Mobile Legends (Pro League)') {
             return (
                <div className="bg-dark-900/50 p-4 rounded-lg border border-primary-600/50 space-y-4">
                    <div className="flex items-center mb-3">
                        <ListChecks size={18} className="mr-2 text-primary-400" />
                        <h4 className="text-md font-semibold text-primary-300">MLBB Pro League (5-Stage) Setup</h4>
                    </div>
                    <p className="text-xs text-gray-400 -mt-2">
                        Configure the advancement path for the **newly registering teams** (e.g., 48).
                        The 16 seeded teams will be added to Stage 3 automatically.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S1: Qualifier Teams</label>
                            <select name="mlbb_pro_qualifier_teams" value={formData.mlbb_pro_qualifier_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="32">32</option>
                                <option value="48">48 (Recommended)</option>
                                <option value="64">64</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S2: Knockout Teams</label>
                            <select name="mlbb_pro_knockout_teams" value={formData.mlbb_pro_knockout_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="16">16</option>
                                <option value="32">32 (Recommended)</option>
                                <option value="64">64</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S3: Group Teams (from S2)</label>
                            <select name="mlbb_pro_group_teams" value={formData.mlbb_pro_group_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="8">8</option>
                                <option value="16">16 (Recommended)</option>
                                <option value="24">24</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S3: Number of Groups</label>
                            <select name="mlbb_pro_groups_in_stage_3" value={formData.mlbb_pro_groups_in_stage_3} onChange={onChange} className="input-field appearance-none" required>
                                <option value="2">2</option>
                                <option value="4">4 (for 32 total)</option>
                                <option value="8">8 (for 32 total)</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S4: Playoff Teams</label>
                            <select name="mlbb_pro_playoff_teams" value={formData.mlbb_pro_playoff_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="4">4</option>
                                <option value="8">8 (Recommended)</option>
                                <option value="16">16</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">S5: Final Teams</label>
                            <select name="mlbb_pro_final_teams" value={formData.mlbb_pro_final_teams} onChange={onChange} className="input-field appearance-none" required>
                                <option value="2">2 (Final)</option>
                                <option value="4">4 (Finals)</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }
        // --- END NEW ---
        return null;
    };


    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-dark-700 pb-4">
                        <h1 className="text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"><PlusCircle className="mr-3" size={32} />Create New Tournament</h1>
                        <div className="flex gap-3">
                            {/* NEW BUTTON: Link to Create Scrim Page */}
                            <Link 
                                to="/admin/create-scrim" 
                                className="btn-secondary flex items-center text-sm bg-primary-900/30 hover:bg-primary-900/50 text-primary-300 border-primary-700/50"
                            >
                                <Users className="mr-1.5" size={16} /> Create Scrim
                            </Link>
                            <Link to="/tournaments" className="btn-secondary flex items-center text-sm"><X className="mr-1.5" size={16} /> Cancel</Link>
                        </div>
                    </div>

                    {/* Progress Bar (Unchanged) */}
                    <AnimatedSection tag="div" className="mb-10" delay={100}>
                        <div className="flex items-center"><div className={stepIconClass(1)}>1</div><div className={stepLineClass(1)}></div><div className={stepIconClass(2)}>2</div><div className={stepLineClass(2)}></div><div className={stepIconClass(3)}>3</div></div>
                        <div className="flex justify-between mt-2 text-xs sm:text-sm px-1"><span className={stepLabelClass(1)}>Basic Info</span><span className={stepLabelClass(2)}>Settings</span><span className={stepLabelClass(3)}>Review</span></div>
                    </AnimatedSection>

                    {/* Form Content */}
                    <div className="space-y-8">
                        {/* Step 1: Basic Information (Unchanged) */}
                        {currentStep === 1 && (
                            <AnimatedSection className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center"><Info size={20} className="mr-3 text-primary-400"/>Basic Information</h2>
                                <div className="p-4 bg-dark-700/50 rounded-lg border border-dark-600 space-y-6">
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Tournament Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g., Africa Legends Cup Season 1" required /></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Game *</label>
                                            <select name="game" value={formData.game} onChange={handleChange} className="input-field appearance-none" required>
                                                {availableGames.map(game => (<option key={game} value={game}>{game}</option>))}
                                            </select>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-300 mb-2">Platform *</label><select name="platform" value={formData.platform} onChange={handleChange} className="input-field appearance-none" required><option value="mobile">Mobile</option><option value="pc">PC</option><option value="console">Console</option><option value="cross-platform">Cross Platform</option></select></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div><label className="block text-sm font-medium text-gray-300 mb-2">Region *</label><select name="region" value={formData.region} onChange={handleChange} className="input-field appearance-none" required><option value="africa">Africa</option><option value="west-africa">West Africa</option><option value="east-africa">East Africa</option><option value="north-africa">North Africa</option><option value="south-africa">South Africa</option></select></div>
                                        <div><label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label><input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="input-field" placeholder="organizer@example.com" required /></div>
                                    </div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Description *</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input-field" placeholder="Briefly describe your tournament..." required /></div>
                                </div>
                            </AnimatedSection>
                        )}

                        {/* Step 2: Tournament Settings (UPDATED) */}
                        {currentStep === 2 && (
                            <AnimatedSection className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center"><Settings size={20} className="mr-3 text-primary-400"/>Tournament Settings</h2>
                                <div className="p-4 bg-dark-700/50 rounded-lg border border-dark-600 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div><label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input-field" required/></div><div><label className="block text-sm font-medium text-gray-300 mb-2">End Date *</label><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input-field" required/></div><div><label className="block text-sm font-medium text-gray-300 mb-2">Registration Deadline *</label><input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="input-field" required/></div></div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Tournament Format</label>
                                        <div className="p-3 bg-dark-800 rounded-md border border-dark-600">
                                            <p className="font-semibold text-lg text-primary-300 capitalize">{getTournamentFormat(formData.game).replace(/-/g, ' ')}</p>
                                            <p className="text-xs text-gray-400">{getFormatDescription(formData.game)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div><label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool</label><input type="number" name="prizePool" value={formData.prizePool} onChange={handleChange} className="input-field" min="0" placeholder="e.g., 1000"/></div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Prize Type</label>
                                            <select name="prizeType" value={formData.prizeType} onChange={handleChange} className="input-field appearance-none">
                                                <option value="Cash (USD)">Cash (USD)</option>
                                                <option value="In-Game Currency">In-Game Currency</option>
                                            </select>
                                        </div>
                                        {formData.prizeType === 'In-Game Currency' && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><Gem size={14} className="mr-1.5"/>Currency Name</label>
                                                <input type="text" name="prizeCurrencyName" value={formData.prizeCurrencyName} onChange={handleChange} className="input-field" placeholder="e.g., Diamonds" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants *</label>
                                            {/* --- UPDATED: Added 64 for MLBB Pro League --- */}
                                            <select name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} className="input-field appearance-none" required>
                                                <option value="16">16</option>
                                                <option value="20">20 (Farlight 84 League)</option>
                                                <option value="32">32 (MLBB Default)</option>
                                                <option value="48">48</option>
                                                <option value="60">60 (Free Fire Qualifiers)</option>
                                                <option value="64">64 (MLBB Pro League)</option>
                                                <option value="128">128</option>
                                            </select>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-300 mb-2">Entry Fee ($)</label><input type="number" name="entryFee" value={formData.entryFee} onChange={handleChange} className="input-field" min="0" placeholder="0"/></div>
                                    </div>

                                    {/* --- UPDATED: This component now handles the new MLBB Pro format --- */}
                                    <StageConfigFields
                                        gameName={formData.game}
                                        formData={formData}
                                        onChange={handleChange}
                                    />

                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Streaming Platform URL</label><input type="url" name="streamingPlatform" value={formData.streamingPlatform} onChange={handleChange} className="input-field" placeholder="https://twitch.tv/your-channel"/></div>
                                    <div className="space-y-4 pt-4 border-t border-dark-600">
                                        <label className="flex items-center"><input id="isPublic" name="isPublic" type="checkbox" checked={formData.isPublic} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-500 rounded mr-2 bg-dark-600"/><span className="text-sm text-gray-300">Make tournament public</span></label>
                                    </div>

                                    <GameSpecificFields
                                        gameName={formData.game}
                                        settings={formData.gameSpecificSettings}
                                        onChange={handleChange}
                                    />
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Default Rules (Auto-filled) *</label><textarea name="rules" value={formData.rules} onChange={handleChange} rows={8} className="input-field font-mono text-sm" placeholder="Default rules based on game selection..." required /><p className="text-xs text-gray-400 mt-1">Modify the auto-filled rules as needed.</p></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Extra Rules / Notes</label><textarea name="extraRules" value={formData.extraRules} onChange={handleChange} rows={4} className="input-field text-sm" placeholder="Add any specific rules, lobby info, or notes not covered above..." /></div>
                                </div>
                            </AnimatedSection>
                        )}

                        {/* Step 3: Review (UPDATED) */}
                        {currentStep === 3 && (
                            <AnimatedSection className="space-y-6">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-100 flex items-center"><Eye size={20} className="mr-3 text-primary-400"/>Review Details</h2>
                                <div className="bg-dark-700/50 rounded-lg p-6 border border-dark-600 space-y-6">
                                    {/* Basic Info (Unchanged) */}
                                    <div className="pb-4 border-b border-dark-600"><h3 className="font-semibold text-primary-400 mb-3 text-lg">Basic Information</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm"><p><span className="text-gray-400 font-medium">Name:</span> {formData.name}</p><p><span className="text-gray-400 font-medium">Game:</span> {formData.game}</p><p><span className="text-gray-400 font-medium">Platform:</span> {formData.platform}</p><p><span className="text-gray-400 font-medium">Region:</span> {formData.region}</p><p className="col-span-1 sm:col-span-2"><span className="text-gray-400 font-medium">Contact:</span> {formData.contactEmail}</p></div></div>
                                    {/* Settings (Unchanged) */}
                                    <div className="pb-4 border-b border-dark-600">
                                        <h3 className="font-semibold text-primary-400 mb-3 text-lg">Settings</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            <p className="capitalize"><span className="text-gray-400 font-medium">Format:</span> {getTournamentFormat(formData.game).replace(/-/g, ' ')}</p>
                                            <p><span className="text-gray-400 font-medium">Max Participants:</span> {formData.maxParticipants}</p>
                                            <p>
                                                <span className="text-gray-400 font-medium">Prize Pool: </span> 
                                                {formData.prizeType === 'Cash (USD)' 
                                                    ? `$${formData.prizePool || '0'}` 
                                                    : `${formData.prizePool || '0'} ${formData.prizeCurrencyName || 'In-Game Coins'}`}
                                            </p>
                                            <p><span className="text-gray-400 font-medium">Entry Fee:</span> ${formData.entryFee}</p>
                                            <p><span className="text-gray-400 font-medium">Public:</span> {formData.isPublic ? 'Yes' : 'No'}</p>
                                        </div>
                                    </div>

                                    {/* --- UPDATED: Stage Configuration Review --- */}
                                    <div className="pb-4 border-b border-dark-600">
                                        <h3 className="font-semibold text-primary-400 mb-3 text-lg">Stage Configuration</h3>
                                        {formData.game === 'Free Fire' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                                <p><span className="text-gray-400 font-medium">Qualifier Matches:</span> {formData.ff_qualifier_matches_per_group}</p>
                                                <p><span className="text-gray-400 font-medium">Playoff Matches:</span> {formData.ff_playoff_matches_per_group}</p>
                                                <p><span className="text-gray-400 font-medium">Finals Matches:</span> {formData.ff_final_matches}</p>
                                            </div>
                                        )}
                                        {formData.game === 'Farlight 84' && (
                                            <div className="text-sm">
                                                <p><span className="text-gray-400 font-medium">Matches per Week:</span> {formData.fl84_matches_per_week}</p>
                                            </div>
                                        )}
                                        {formData.game === 'Mobile Legends' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                                <p><span className="text-gray-400 font-medium">League Rounds:</span> {formData.mlbb_league_rounds}</p>
                                                <p><span className="text-gray-400 font-medium">Playoff Teams:</span> {formData.mlbb_playoff_teams}</p>
                                            </div>
                                        )}
                                        {/* --- NEW: MLBB Pro Series Review --- */}
                                        {formData.game === 'Mobile Legends (Pro League)' && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                                <p><span className="text-gray-400 font-medium">S1 Teams:</span> {formData.mlbb_pro_qualifier_teams}</p>
                                                <p><span className="text-gray-400 font-medium">S2 Teams:</span> {formData.mlbb_pro_knockout_teams}</p>
                                                <p><span className="text-gray-400 font-medium">S3 Teams (from S2):</span> {formData.mlbb_pro_group_teams}</p>
                                                <p><span className="text-gray-400 font-medium">S3 Groups:</span> {formData.mlbb_pro_groups_in_stage_3}</p>
                                                <p><span className="text-gray-400 font-medium">S4 Teams:</span> {formData.mlbb_pro_playoff_teams}</p>
                                                <p><span className="text-gray-400 font-medium">S5 Teams:</span> {formData.mlbb_pro_final_teams}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Game Settings (Unchanged) */}
                                    <div className="pb-4 border-b border-dark-600">
                                        <h3 className="font-semibold text-primary-400 mb-3 text-lg">{formData.game} Settings</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                            {Object.entries(formData.gameSpecificSettings).map(([key, value]) => (
                                                <p key={key}><span className="text-gray-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value || 'N/A'}</p>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Schedule & Desc (Unchanged) */}
                                    <div className="pb-4 border-b border-dark-600"><h3 className="font-semibold text-primary-400 mb-3 text-lg">Schedule</h3><div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm"><p><span className="text-gray-400 font-medium">Start:</span> {formData.startDate || 'N/A'}</p><p><span className="text-gray-400 font-medium">End:</span> {formData.endDate || 'N/A'}</p><p><span className="text-gray-400 font-medium">Reg. Deadline:</span> {formData.registrationDeadline || 'N/A'}</p></div></div>
                                    <div>
                                        <h3 className="font-semibold text-primary-400 mb-2 text-lg">Description</h3><p className="text-sm text-gray-300 mb-4">{formData.description || 'N/A'}</p>
                                        <h3 className="font-semibold text-primary-400 mb-2 text-lg">Default Rules</h3><pre className="text-sm text-gray-300 whitespace-pre-wrap bg-dark-800 p-3 rounded font-mono border border-dark-600 max-h-40 overflow-y-auto">{formData.rules || 'N/A'}</pre>
                                        {formData.extraRules && (<><h3 className="font-semibold text-primary-400 mt-4 mb-2 text-lg">Extra Rules / Notes</h3><pre className="text-sm text-gray-300 whitespace-pre-wrap bg-dark-800 p-3 rounded font-mono border border-dark-600 max-h-40 overflow-y-auto">{formData.extraRules}</pre></>)}
                                    </div>
                                </div>
                                <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 mt-6"><div className="flex items-start"><AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" /><div><h4 className="font-medium text-yellow-400 mb-1">Final Check</h4><p className="text-sm text-yellow-300">Review all details. The **Tournament Format** and **Stage Settings** will be used to generate the tournament structure. These settings cannot be changed after creation.</p></div></div></div>
                            </AnimatedSection>
                        )}

                        {/* Navigation Buttons (Unchanged) */}
                        <AnimatedSection delay={100} className="flex justify-between items-center pt-8 border-t border-dark-700">
                            <button type="button" onClick={prevStep} disabled={isLoading} className={`btn-secondary text-sm ${currentStep === 1 ? 'invisible' : ''} disabled:opacity-50`}>Previous</button>
                            {currentStep < totalSteps ? (
                                <button type="button" onClick={nextStep} className="btn-primary text-sm">Next Step</button>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={handleConfirmAndSubmit} 
                                    disabled={isLoading}
                                    className="btn-primary flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-1.5" size={16} />
                                    )}
                                    {isLoading ? 'Creating...' : 'Confirm & Create'}
                                </button>
                            )}
                        </AnimatedSection>
                    </div> {/* End Form Content */}
                </AnimatedSection>

                {/* Modals (Unchanged) */}
                <CustomModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => !isLoading && setIsConfirmModalOpen(false)} 
                    title="Confirm Tournament Creation"
                    onConfirm={handleFinalSubmit}
                    confirmText={isLoading ? "Creating..." : "Create Tournament"}
                >
                    Please review all details. The tournament format and stage settings 
                    will be locked after creation. Are you sure you want to proceed?
                </CustomModal>

                <CustomModal
                    isOpen={alertModal.isOpen}
                    onClose={() => setAlertModal({ isOpen: false })}
                    title={alertModal.title}
                    onConfirm={alertModal.onConfirm ? alertModal.onConfirm : () => setAlertModal({ isOpen: false })}
                    confirmText={alertModal.confirmText || 'OK'}
                    showCancel={alertModal.showCancel || false}
                >
                    {alertModal.message}
                </CustomModal>

            </div>
        </div>
    );
}