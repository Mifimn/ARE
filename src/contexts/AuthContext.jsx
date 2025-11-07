// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// --- Default Context Value ---
const defaultAuthContextValue = {
  signUp: () => Promise.reject(new Error("AuthProvider not ready")),
  signIn: () => Promise.reject(new Error("AuthProvider not ready")),
  signOut: () => Promise.reject(new Error("AuthProvider not ready")),
  user: null,
  session: null,
  profile: null, // <<< REQUIRED BY ADMINROUTE >>>
  loading: true, 
};

// --- Create Context ---
const AuthContext = createContext(defaultAuthContextValue);

// --- AuthProvider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // <<< PROFILE STATE >>>
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchProfileData = async (changedUser) => {
        if (!changedUser) {
            setProfile(null);
            setLoading(false);
            return;
        }

        try {
            // Since RLS seems fixed now, we use the efficient client-side fetch:
            const { data: userProfile, error: profileError } = await supabase
              .from('profiles')
              .select('*') // Includes 'is_admin'
              .eq('id', changedUser.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error("[AuthContext] Error fetching profile:", profileError);
              setProfile(null);
            } else if (userProfile) {
              setProfile(userProfile);
            } else {
              setProfile({ is_admin: false }); 
            }
        } catch (error) {
            console.error("[AuthContext] Critical error during profile fetch:", error);
            setProfile(null);
        } finally {
             setLoading(false);
        }
    };

    const authChangeHandler = (_event, changedSession) => {
        const changedUser = changedSession?.user ?? null;
        setSession(changedSession);
        setUser(changedUser);

        fetchProfileData(changedUser);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(authChangeHandler);

    return () => {
      subscription?.unsubscribe();
    };
  }, []); 

  // --- Value provided by the context (only essential parts shown) ---
  const value = {
    signUp: ({ email, password, fullName, username }) => supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username: username } }
    }),
    signIn: ({ emailOrUsername, password }) => {
      if (emailOrUsername.includes('@')) {
        return supabase.auth.signInWithPassword({ email: emailOrUsername, password });
      } else {
        return (async () => {
          const { data: profileData } = await supabase.from('profiles').select('id').eq('username', emailOrUsername).single();
          if (!profileData) throw new Error('Invalid login credentials'); 
          try {
            const { data: functionData } = await supabase.functions.invoke('get-email-from-username', { body: { username: emailOrUsername }});
            if (!functionData || !functionData.email) throw new Error('Could not retrieve email for username.');
            return supabase.auth.signInWithPassword({ email: functionData.email, password });
          } catch (error) {
              throw new Error('Invalid login credentials');
          }
        })();
      }
    },
    signOut: () => supabase.auth.signOut(),

    // --- State Variables ---
    user,
    session,
    profile, // <<< THIS IS THE KEY VALUE NEEDED BY ADMINROUTE >>>
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- useAuth Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};