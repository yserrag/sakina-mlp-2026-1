import { createClient } from '@supabase/supabase-js';

// Access environment variables safely
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create the client if keys exist, otherwise return null (Graceful Fallback)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Helper to check if we are "Online" with a valid session
export const isSupabaseReady = () => !!supabase;