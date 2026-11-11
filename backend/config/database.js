const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!/^https:\/\//.test(process.env.SUPABASE_URL || '') ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('PASTE_')) {
    throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API).');
}

// Server-side client using the service role key. Never expose this key to the frontend.
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
);

module.exports = supabase;
