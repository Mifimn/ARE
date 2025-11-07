// src/pages/StorePage.jsx

import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, ArrowLeft, Zap, Gem } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const PAGE_NAME = "The Armory";
const PAGE_SUBTITLE = "Official Merchandise & Gear";
const PAGE_BANNER_URL = "/images/action_1.jpg"; // Using action_1.jpg for epic feel

export default function StorePage() {
    return (
        <div className="bg-dark-900 text-white min-h-screen">
            <div className="max-w-full mx-auto space-y-10 pb-10">
                {/* --- Epic Hero Banner --- */}
                <AnimatedSection delay={0} className="relative h-72 sm:h-96 w-full overflow-hidden shadow-2xl shadow-primary-900/50">
                    <img 
                        src={PAGE_BANNER_URL} 
                        alt={`${PAGE_NAME} Banner`} 
                        // Enhanced opacity/blur for dramatic effect
                        className="absolute inset-0 w-full h-full object-cover object-center scale-110 opacity-70 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/70 to-transparent"></div>
                    <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
                         <div className="flex items-center mb-4">
                            {/* Iconic Shop Icon */}
                            <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mr-4 text-yellow-400 bg-dark-700/80 p-3 rounded-full border-2 border-yellow-500 shadow-xl shadow-yellow-500/20" />
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl">{PAGE_NAME}</h1>
                         </div>
                         <p className="text-xl sm:text-2xl text-primary-400 font-semibold max-w-3xl">{PAGE_SUBTITLE}</p>
                    </div>
                </AnimatedSection>

                {/* --- Coming Soon Content (Epic Redesign) --- */}
                <AnimatedSection delay={100} className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-dark-800 border-4 border-primary-700 rounded-2xl shadow-2xl shadow-red-900/50 text-center p-12 lg:p-20 relative overflow-hidden">
                         {/* Background Grid Pattern */}
                         <div className="absolute inset-0 bg-[url('/images/lan_6.jpg')] opacity-[0.04] mix-blend-color-dodge"></div>

                         <div className="relative z-10">
                            <Zap size={64} className="mx-auto text-primary-500 mb-6 animate-pulse" />
                            <h2 className="text-5xl font-extrabold text-white mb-4 uppercase tracking-wider drop-shadow-lg">SYSTEM OFFLINE</h2>
                            <h3 className="text-2xl font-bold text-primary-400 mb-8">MERCH DROP INCOMING...</h3>

                            <div className="flex items-center justify-center space-x-4 text-xl font-medium text-gray-300 mb-10">
                                <Clock size={20} className="text-yellow-400" />
                                <span>Launching Q4 2025</span>
                                <Gem size={20} className="text-green-400" />
                            </div>

                            <Link 
                                to="/dashboard" 
                                className="btn-primary inline-flex items-center text-lg px-8 py-3 transform transition-transform hover:scale-105 border border-primary-500"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Return to Battle Station
                            </Link>
                         </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}