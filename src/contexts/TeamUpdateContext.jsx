// src/contexts/TeamUpdateContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

// Create a Context object
const TeamUpdateContext = createContext(null);

// Custom hook to use the context
export const useTeamUpdate = () => {
    const context = useContext(TeamUpdateContext);
    if (context === undefined) {
        throw new Error('useTeamUpdate must be used within a TeamUpdateProvider');
    }
    return context;
};

// Provider component
export const TeamUpdateProvider = ({ children }) => {
    // This key changes to trigger re-renders in subscribing components
    const [teamUpdateKey, setTeamUpdateKey] = useState(0); 

    // Function to call after any team-related mutation (join, leave, kick, create)
    const triggerTeamUpdate = useCallback(() => {
        console.log("[TeamUpdateContext] Triggering global team data refresh.");
        setTeamUpdateKey(prev => prev + 1);
    }, []);

    const value = {
        teamUpdateKey,
        triggerTeamUpdate,
    };

    return (
        <TeamUpdateContext.Provider value={value}>
            {children}
        </TeamUpdateContext.Provider>
    );
};