// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// Make sure this path is correct for your Supabase client
import { supabase } from '../lib/supabaseClient';

// --- Default Context Value ---
const defaultAuthContextValue = {
  signUp: () => Promise.reject(new Error("AuthProvider not ready")),
  signIn: () => Promise.reject(new Error("AuthProvider not ready")),
  signOut: () => Promise.reject(new Error("AuthProvider not ready")),
  user: null,
  session: null,
  loading: true, // Default loading to true initially
};

// --- Create Context ---
const AuthContext = createContext(defaultAuthContextValue);

// --- AuthProvider Component ---
export const AuthProvider = ({ children }) => {
  console.log("[AuthContext] AuthProvider component rendering..."); // Log component render
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthContext] useEffect started. Loading:", loading);

    const getSession = async () => {
      console.log("[AuthContext] getSession attempting...");
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error("[AuthContext] getSession Error:", sessionError);
        } else {
            console.log("[AuthContext] getSession Success:", currentSession);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("[AuthContext] Critical Error in getSession:", error);
        setSession(null);
        setUser(null);
      } finally {
        console.log("[AuthContext] getSession finally block - setting loading to false.");
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, changedSession) => {
        console.log("[AuthContext] onAuthStateChange fired. Session:", changedSession);
        setSession(changedSession);
        setUser(changedSession?.user ?? null);
        if (loading) { // Only set loading false if it was still true
            console.log("[AuthContext] onAuthStateChange - setting loading to false.");
            setLoading(false);
        }
      }
    );
    console.log("[AuthContext] useEffect setup finished.");

    return () => {
      console.log("[AuthContext] useEffect cleanup.");
      subscription?.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  // --- Value provided by the context ---
  const value = {
    // --- Sign Up Method (Updated) ---
    signUp: ({ email, password, fullName, username }) => supabase.auth.signUp({
      email,
      password,
      options: {
        // Pass extra data via metadata for the trigger to use
        data: {
          full_name: fullName,
          username: username,
          // avatar_url: 'path/to/default/avatar.png' // Optional: add default avatar
        }
      }
    }),
    // --- Sign In Method (Updated with Two-Step Query Logic + Edge Function Placeholder) ---
    signIn: ({ emailOrUsername, password }) => {
      // Basic check: if it contains '@', assume email, otherwise username
      if (emailOrUsername.includes('@')) {
        console.log(`[AuthContext] Attempting login with email: ${emailOrUsername}`);
        return supabase.auth.signInWithPassword({ email: emailOrUsername, password });
      } else {
        // Find user ID associated with the username, then ideally use Edge Function
        return (async () => {
          console.log(`[AuthContext] Attempting login with username: ${emailOrUsername}`);

          // Step 1: Find the profile by username and get the user ID (UUID)
          // This step might fail if RLS on profiles doesn't allow public SELECT
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id') // Select only the user ID (FK to auth.users)
            .eq('username', emailOrUsername)
            .single();

          if (profileError || !profileData || !profileData.id) {
            console.error('[AuthContext] Step 1 Error: Could not find profile for username:', emailOrUsername, profileError || 'No profile data found');
            throw new Error('Invalid login credentials'); // Use generic error
          }

          const userId = profileData.id;
          console.log(`[AuthContext] Step 1 Success: Found profile ID for ${emailOrUsername}: ${userId}`);

          // Step 2: Get email via Edge Function (Recommended & Secure)
          console.log(`[AuthContext] Step 2: Attempting to call Edge Function 'get-email-from-username' for user:`, emailOrUsername);
          try {
            // *** YOU NEED TO CREATE THIS EDGE FUNCTION IN SUPABASE ***
            const { data: functionData, error: functionError } = await supabase.functions.invoke('get-email-from-username', {
              body: { username: emailOrUsername }
            });

            if (functionError) throw functionError; // Handle errors like function not found, internal errors

            if (!functionData || !functionData.email) {
                 console.error('[AuthContext] Edge function did not return an email for username:', emailOrUsername);
                 throw new Error('Could not retrieve email for username.');
            }

            const email = functionData.email;
            console.log(`[AuthContext] Step 2 Success: Got email from Edge Function: ${email}`);

            // Step 3: Sign in using the found email
            console.log(`[AuthContext] Step 3: Signing in with retrieved email: ${email}`);
            return supabase.auth.signInWithPassword({ email, password });

          } catch (error) {
              console.error('[AuthContext] Error during Step 2 (Edge Function call) or Step 3 (signInWithPassword):', error);
              // Provide generic error to the user
              throw new Error('Invalid login credentials');
          }

        })(); // Immediately invoke the async function
      }
    },
    // --- Sign Out Method ---
    signOut: () => supabase.auth.signOut(),
    // --- State Variables ---
    user,
    session,
    loading
  };

  console.log("[AuthContext] Rendering AuthProvider. Loading:", loading, "User:", user);
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