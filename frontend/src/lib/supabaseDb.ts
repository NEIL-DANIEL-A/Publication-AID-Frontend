/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn(
    '[Supabase DB] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not configured.\n' +
    'Set the anon key in frontend/.env to enable journal data fetching.'
  );
}

export const supabaseDb = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
