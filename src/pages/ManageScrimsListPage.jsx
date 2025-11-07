// src/pages/ManageScrimsListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, UsersRound, Calendar, Clock, Loader2, AlertTriangle, ArrowLeft, TrendingUp, PlusCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; 
import { useAuth } from '../contexts/AuthContext'; 

// Helper function to get game-specific card styles
const getGameCardStyles = (game) => {
    switch (game) {
        case 'Free Fire':
            return { border: 'border-l-4 border-orange-600', text: 'text-orange-400' };
        case 'Farlight 84':
            return { border: 'border-l-4 border-purple-600', text: 'text-purple-400' };
        case 'Mobile Legends':
        case 'Mobile Legends (Pro League)':
            return { border: 'border-l-4 border-green-600', text: 'text-green-400' };
        default:
            return { border: 'border-l-4 border-dark-600', text: 'text-primary-400' };
    }
};

export default function ManageScrimsListPage() {
    const { user, loading: authLoading } = useAuth(); 
    const navigate = useNavigate();

    const [scrimsList, setScrimsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchScrimsList = useCallback(async (userId) => {
        if (!userId) return;

        setLoading(true);
        setError(null);
        try {
            // Fetch all tournaments where type is 'scrim' and organizer matches user ID
            const { data, error } = await supabase
                .from('tournaments')
                .select('id, name, game, status, start_date, max_participants')
                .eq('organizer_id', userId)
                .eq('type', 'scrim') // <--- CRUCIAL FILTER
                .order('start_date', { ascending: false });

            if (error) throw error;

            setScrimsList(data || []);
            setLoading(false);

        } catch (err) {
            console.error("Error fetching scrims list:", err.message);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchScrimsList(user.id);
        } else if (!authLoading && !user) {
            setError("You must be logged in as an administrator to view this page.");
            setLoading(false);
        }
    }, [user, authLoading, fetchScrimsList]);

    const renderContent = () => {
        if (loading) {
            return ( <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><Loader2 className="w-16 h-16 text-primary-500 animate-spin" /></div> );
        }

        if (error) {
            return (
                <AnimatedSection className="card bg-dark-800 p-6 rounded-xl shadow-lg space-y-6 text-center">
                    <AlertTriangle size={48} className="mx-auto text-red-500" />
                    <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Scrims</h2>
                    <p className="text-gray-300">{error}</p>
                </AnimatedSection>
            );
        }

        return (
            <AnimatedSection delay={100} className="card bg-dark-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b border-dark-700 pb-3">
                    <h2 className="text-2xl font-bold text-primary-300">Your Scrims ({scrimsList.length})</h2>
                    <Link to="/admin/create-scrim" className="btn-primary flex items-center bg-green-600 hover:bg-green-700">
                        <PlusCircle size={16} className="mr-2" /> Create Scrim
                    </Link>
                </div>

                {scrimsList.length > 0 ? (
                    <div className="space-y-6">
                        {scrimsList.map((scrim, index) => {
                            const gameStyles = getGameCardStyles(scrim.game); 
                            const statusColor = scrim.status === 'Completed' ? 'text-green-400' : 'text-yellow-400';

                            return ( 
                                <AnimatedSection 
                                    key={scrim.id} 
                                    delay={150 + index * 100} 
                                    className={`bg-dark-700/50 rounded-lg p-4 ${gameStyles.border} transition-colors duration-200`} 
                                > 
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4"> 
                                        <div className="flex-grow"> 
                                            <h3 className="text-xl font-semibold text-white mb-1">{scrim.name}</h3> 
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400"> 
                                                <span>Game: <span className="text-white">{scrim.game}</span></span> 
                                                <span className='flex items-center'>
                                                    <Clock size={14} className='mr-1'/>
                                                    Date: <span className="text-white ml-1">{new Date(scrim.start_date).toLocaleDateString()}</span>
                                                </span>
                                                <span>Teams: <span className="text-white">{scrim.max_participants}</span></span> 
                                                <span>Status: <span className={`font-bold ${statusColor}`}>{scrim.status}</span></span> 
                                            </div> 
                                        </div> 
                                        <div className="flex flex-wrap gap-2 flex-shrink-0"> 
                                            <Link 
                                                to={`/admin/manage-scrim/${scrim.id}`} 
                                                className="btn-primary btn-xs flex items-center" 
                                                title="Manage Rounds & Results"
                                            >
                                                <TrendingUp size={14} className="mr-1 sm:mr-0"/> <span className="sm:hidden">Manage</span>
                                            </Link>
                                        </div> 
                                    </div> 
                                </AnimatedSection> 
                            ); 
                        })} 
                    </div>
                ) : ( 
                    <div className="text-center py-10 space-y-4">
                        <p className="text-gray-500 text-lg">You haven't created any scrims yet.</p>
                        <Link to="/admin/create-scrim" className="btn-primary"> Create Your First Scrim </Link> 
                    </div>
                )}
            </AnimatedSection>
        );
    };

    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
                <AnimatedSection delay={0}>
                    <h1 className="text-4xl font-extrabold text-center text-primary-400 mb-2 flex items-center justify-center"> 
                        <Settings className="w-8 h-8 mr-3" /> Scrim Management Hub
                    </h1>
                    <p className="text-center text-gray-400"> View, edit, and manage all scheduled practice matches. </p>
                </AnimatedSection>

                {renderContent()}

            </div>
        </div>
    );
}