// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Add these logs ---
console.log("[supabaseClient] VITE_SUPABASE_URL:", supabaseUrl);
console.log("[supabaseClient] VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Loaded (Exists)" : "MISSING or Empty!");
// --- End logs ---

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[supabaseClient] Error: Supabase environment variables are missing or empty!"); // More specific error log
  throw new Error("Supabase URL and Anon Key must be provided in environment variables prefixed with VITE_");
}

console.log("[supabaseClient] Initializing Supabase client..."); // Confirm initialization attempt

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("[supabaseClient] Supabase client created."); // Confirm successful creation