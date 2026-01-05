/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// 1. HARD-CODED KEYS
const supabaseUrl = 'https://bdwibzrvvuenckwzsmba.supabase.co';
// NOTE: If this key fails, double-check your Supabase Dashboard. 
// Standard keys usually start with "ey..."
const supabaseAnonKey = 'sb_publishable_9r5QY_8C4JHRiavWLFESUg_mqI_LXLl';
const API_KEY = 'AIzaSyBZoLi15nzpWaqRmpj7GeqEvzVUoG4cNRw'; 

// 2. CREATE CLIENT
export const supabase = createClient(supabaseUrl, supabaseAnonKey);