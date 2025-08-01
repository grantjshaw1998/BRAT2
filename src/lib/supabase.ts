import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔥 Supabase Config Check:', {
  url: supabaseUrl ? `Set (${supabaseUrl.substring(0, 30)}...)` : 'Missing',
  key: supabaseAnonKey ? `Set (${supabaseAnonKey.substring(0, 20)}...)` : 'Missing',
  fullUrl: supabaseUrl,
  keyLength: supabaseAnonKey?.length
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('❌ VITE_SUPABASE_URL:', supabaseUrl);
  console.error('❌ VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);