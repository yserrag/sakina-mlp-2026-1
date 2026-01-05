import { createClient } from '@supabase/supabase-js';

// [FIX]: I added the required quotes "" around your keys below.
const supabaseUrl = "https://bdwibzrvvuenckwzsmba.supabase.co";
const supabaseAnonKey = "sb_publishable_9r5QY_8C4JHRiavWLFESUg_mqI_LXLl";

console.log("🔌 Supabase Manual Check:", {
  URL: supabaseUrl.includes("PASTE") ? "❌ STILL DEFAULT" : "✅ LOADED",
  KEY: supabaseAnonKey.includes("PASTE") ? "❌ STILL DEFAULT" : "✅ LOADED"
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage, // [FACTS]: Force LocalStorage for stability
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});