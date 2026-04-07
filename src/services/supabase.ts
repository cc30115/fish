/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.warn("Supabase credentials missing. The app will use local fallback data.");
}

// Only export client if configured, or export a "stub" to prevent crashes
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

