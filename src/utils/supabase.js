import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Key must be provided in .env');
}

const supabaseAdminToken = import.meta.env.VITE_SUPABASE_ADMIN_TOKEN || 'mbs_admin_supabase_token_2026_xyz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-maddy-admin-token': supabaseAdminToken
    }
  }
});
