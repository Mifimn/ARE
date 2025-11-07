// src/pages/CreateScrimPage.jsx

import { useState } from 'react';
import { PlusCircle, Calendar, Users, Save, X, AlertCircle, Info, Gamepad2, Layers, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { useAuth } from '../contexts/AuthContext'; 
import { supabase } from '../lib/supabaseClient'; 

const scrimGames = [
    'Free Fire',
    'Mobile Legends',
    'Farlight 84',
].sort();

export default function CreateScrimPage() {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const defaultGame = scrimGames[0];

    const [formData, setFormData] = useState({
        name: '',
        game: defaultGame,
        scheduledTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // Default 1 hour from now
        maxParticipants: '12',
        maxRounds: '4', // Default 4 rounds for a scrim
        isPublic: true,
    });

    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setError(null);
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) { setError('Authentication error.'); return; }

        setIsLoading(true);
        setError(null);

        // --- Core Scrim Logic: Insert into Tournaments Table ---
        const newScrimData = {
            organizer_id: user.id,
            name: formData.name,
            game: formData.game,
            // Use scheduledTime for start_date and end_date (same day)
            start_date: formData.scheduledTime,
            end_date: formData.scheduledTime, 
            registration_deadline: formData.scheduledTime, // Registration closes at start time
            max_participants: parseInt(formData.maxParticipants),

            // Scrim-specific fields
            type: 'scrim', // <-- CRITICAL DISCRIMINATOR
            max_rounds: parseInt(formData.maxRounds), // <-- NEW COLUMN VALUE

            // Default/Hardcoded values
            prize_pool_amount: 0,
            prize_type: 'Coins',
            prize_currency: 'Coins',
            entry_fee: 0,
            platform: 'mobile', 
            region: 'africa', 
            rules: `Standard ${formData.game} scrim rules apply (No hacks/teaming). ${formData.maxRounds} matches will be played.`,
            format: 'scrim', // Simplified format name
            stages: [{ id: 1, name: 'Main Scrim', totalMatches: parseInt(formData.maxRounds) }], // Dummy stages array
            is_public: formData.isPublic,
            status: 'Draft',
            current_stage: 1 
        };

        const { data, error: insertError } = await supabase
            .from('tournaments')
            .insert(newScrimData)
            .select()
            .single(); 

        setIsLoading(false);

        if (insertError) {
            console.error('Supabase Insert Error:', insertError.message);
            setError(`Failed to create scrim: ${insertError.message}`);
        } else if (data) {
            console.log('Scrim created:', data);
            navigate(`/admin/manage-scrim/${data.id}`); // Redirect to management page
        }
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <AnimatedSection tag="div" className="card bg-dark-800 p-6 md:p-8 rounded-xl shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b border-dark-700 pb-4">
                        <h1 className="text-3xl font-bold flex items-center text-primary-400 mb-4 sm:mb-0"><PlusCircle className="mr-3" size={32} />Create New Scrim</h1>
                        <Link to="/update-tournament/manage" className="btn-secondary flex items-center text-sm"><X className="mr-1.5" size={16} /> Cancel</Link>
                    </div>

                    {error && ( <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm flex items-start"> <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5"/> <span>{error}</span> </div> )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <AnimatedSection className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-100 flex items-center"><Info size={20} className="mr-3 text-primary-400"/>Basic Scrim Details</h2>
                            <div className="p-4 bg-dark-700/50 rounded-lg border border-dark-600 space-y-6">
                                <div><label className="block text-sm font-medium text-gray-300 mb-2">Scrim Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="e.g., Team Alpha Practice 4-Rounds" required /></div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Game *</label>
                                        <select name="game" value={formData.game} onChange={handleChange} className="input-field appearance-none" required>
                                            {scrimGames.map(game => (<option key={game} value={game}>{game}</option>))}
                                        </select>
                                    </div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Start Time *</label><input type="datetime-local" name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} className="input-field" required/></div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Max Teams *</label><input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="2" max="20" className="input-field" required/></div>
                                    <div><label className="block text-sm font-medium text-gray-300 mb-2">Total Rounds (Matches) *</label><input type="number" name="maxRounds" value={formData.maxRounds} onChange={handleChange} min="1" max="10" className="input-field" required/></div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-dark-600">
                                    <label className="flex items-center"><input id="isPublic" name="isPublic" type="checkbox" checked={formData.isPublic} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-500 rounded mr-2 bg-dark-600"/><span className="text-sm text-gray-300">Make scrim public (visible on hub)</span></label>
                                </div>
                            </div>
                        </AnimatedSection>

                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="btn-primary flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-1.5" size={16} />
                                )}
                                {isLoading ? 'Creating...' : 'Create Scrim'}
                            </button>
                        </div>
                    </form>
                </AnimatedSection>
            </div>
        </div>
    );
}