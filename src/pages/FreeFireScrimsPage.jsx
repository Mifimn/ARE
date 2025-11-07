// src/pages/FreeFireScrimsPage.jsx

import { Link } from 'react-router-dom';
import { Trophy, Users, ArrowRight, Gamepad2, Hash, Clock, BarChart, ListChecks, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import { supabase } from '../lib/supabaseClient'; 

// --- Game-specific config ---
const GAME_NAME = "Free Fire";
const GAME_BANNER_URL = "/images/free_lan.jpg";
const GAME_CUP_THUMBNAIL = "/images/FF_ban.jpg";
// ---

// --- Scrim List Item ---
const ScrimListItem = ({ scrim, isPast = false }) => {
    return (
        <Link
            to={`/scrim/${scrim.id}`} // <-- CORRECTED LINK
            className="block relative group overflow-hidden rounded-xl shadow-lg border border-dark-700 hover:border-primary-500/50 transition-all duration-300"
        >
            <img
                src={GAME_CUP_THUMBNAIL} 
                alt="Free Fire Scrim Background"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isPast ? 'opacity-20 group-hover:opacity-30' : 'opacity-30 group-hover:opacity-40'}`}
            />

            <div className="relative z-10 p-5 bg-gradient-to-r from-dark-800/90 via-dark-800/80 to-transparent flex items-center justify-between">
                <div className="flex-grow pr-4">
                    <span className="text-xs font-semibold text-primary-400 px-2 py-1 rounded-full bg-primary-900/50 border border-primary-700/50">SCRIM</span>
                    <h4 className={`text-lg font-bold mt-1 transition-colors ${isPast ? 'text-gray-400 group-hover:text-gray-300' : 'text-white group-hover:text-primary-300'}`}>
                        {scrim.name}
                    </h4>
                    <p className="text-sm text-gray-400">{scrim.max_rounds} Rounds &bull; {scrim.max_participants} Slots</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className={`text-xl font-extrabold leading-none mb-1 ${isPast ? 'text-gray-500' :'text-green-400'}`}>{scrim.status}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date(scrim.start_date).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="absolute top-4 right-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight size={20} />
            </div>
        </Link>
    );
};

const ScrimsContent = ({ scrims, loading, error, isPast = false }) => (
    <AnimatedSection delay={0} className="space-y-6">
        {loading && (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            </div>
        )}
        {error && (
             <div className="flex flex-col items-center justify-center h-40 bg-dark-800 p-4 rounded-lg">
                 <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                 <p className="text-red-400">Failed to load scrims.</p>
             </div>
         )}
        {!loading && !error && (
            <>
                {scrims.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scrims.map((scrim, index) => (
                            <AnimatedSection key={scrim.id} delay={100 + index * 100}>
                                <ScrimListItem scrim={scrim} isPast={isPast} />
                            </AnimatedSection>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 md:col-span-2 text-center py-10">
                        No {isPast ? 'past' : 'upcoming'} scrims found for {GAME_NAME}.
                    </p>
                )}
            </>
        )}
    </AnimatedSection>
);


export default function FreeFireScrimsPage() {
    const [upcomingScrims, setUpcomingScrims] = useState([]);
    const [pastScrims, setPastScrims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScrimData = async () => {
            setLoading(true); setError(null);
            try {
                const { data: scrimData, error: fetchError } = await supabase
                    .from('tournaments')
                    .select('id, name, max_participants, start_date, status, max_rounds')
                    .eq('game', GAME_NAME)
                    .eq('type', 'scrim')
                    .eq('is_public', true)
                    .order('start_date', { ascending: false }); 

                if (fetchError) throw fetchError;

                const past = scrimData.filter(t => t.status === 'Completed');
                const upcoming = scrimData
                    .filter(t => t.status !== 'Completed')
                    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

                setUpcomingScrims(upcoming);
                setPastScrims(past);
            } catch (err) {
                console.error("Error fetching scrim data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScrimData();
    }, []);


    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10 pb-10">
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl">
                    <img src={GAME_BANNER_URL} alt="Free Fire Scrims Banner" className="absolute inset-0 w-full h-full object-cover object-center scale-105 opacity-80"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4"><Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" /><h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">{GAME_NAME} SCRIMS</h1></div>
                         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">Find and join casual practice matches for your team.</p>
                    </div>
                </AnimatedSection>

                <div className="space-y-10 px-4 sm:px-6 lg:px-8">
                     <div className="space-y-6">
                         <h3 className="text-2xl font-semibold text-white flex items-center"><Clock size={20} className="mr-3 text-green-400" /> Upcoming Scrims</h3>
                         <ScrimsContent scrims={upcomingScrims} loading={loading} error={error} isPast={false} />
                     </div>
                     <div className="space-y-6 pt-8 border-t border-dark-700">
                         <h3 className="text-2xl font-semibold text-white flex items-center"><Calendar size={20} className="mr-3 text-yellow-400" /> Past Scrims Archive</h3>
                         <ScrimsContent scrims={pastScrims} loading={loading} error={error} isPast={true} />
                     </div>
                </div>

            </div>
        </div>
    );
}