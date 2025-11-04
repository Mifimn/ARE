// src/pages/CODPage.jsx

import { Link } from 'react-router-dom';
import { Gamepad2, Clock, ArrowLeft } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const GAME_NAME = "COD Warzone";
const GAME_BANNER_URL = "/images/1001350382.jpg"; // Using the image you provided

export default function CODPage() {
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-full mx-auto space-y-10 pb-10">
                {/* --- Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-64 sm:h-80 w-full overflow-hidden shadow-xl">
                    <img src={GAME_BANNER_URL} alt={`${GAME_NAME} Banner`} className="absolute inset-0 w-full h-full object-cover object-center scale-105 blur-sm opacity-40"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4">
                            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-primary-400 bg-dark-800/50 p-2 rounded-lg border border-primary-500/30" />
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">{GAME_NAME} HUB</h1>
                         </div>
                         <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">Your central command for all {GAME_NAME} tournaments, leaderboards, and team activities on Africa Rise Esports.</p>
                    </div>
                </AnimatedSection>
                
                {/* --- Coming Soon Content --- */}
                <AnimatedSection delay={100} className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-dark-800 border border-dark-700 rounded-xl shadow-lg text-center p-12 lg:p-20">
                        <Clock size={48} className="mx-auto text-primary-400 mb-6" />
                        <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
                        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
                            The {GAME_NAME} Hub is under construction. We're working hard to bring you tournaments, leaderboards, and more for this game.
                        </p>
                        <Link to="/tournaments" className="btn-secondary inline-flex items-center">
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Games Hub
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}