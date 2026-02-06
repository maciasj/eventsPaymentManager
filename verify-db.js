import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual parser for .env.local because we are running in Node, not Vite
const envPath = path.resolve(process.cwd(), '.env.local');
let env = {};

if (fs.existsSync(envPath)) {
    const file = fs.readFileSync(envPath, 'utf8');
    file.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('--- Database Verification ---');
console.log(`URL: ${supabaseUrl ? 'Found' : 'MISSING'}`);
console.log(`Key: ${supabaseKey ? 'Found (' + supabaseKey.substring(0, 10) + '...)' : 'MISSING'}`);

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('\nTesting connection...');

    // 1. Check Events Table
    const { data: events, error: eventError } = await supabase
        .from('events')
        .select('count', { count: 'exact', head: true });

    if (eventError) {
        console.error('❌ Error accessing "events" table:', eventError.message);
        if (eventError.code === 'PGRST301') console.error('   -> Check Row Level Security (RLS) policies.');
        if (eventError.code === '42P01') console.error('   -> Table "events" does not exist.');
    } else {
        console.log('✅ Connected to "events" table.');
    }

    // 2. Check User Profiles Table
    const { data: users, error: userError } = await supabase
        .from('user_profiles')
        .select('count', { count: 'exact', head: true });

    if (userError) {
        console.error('❌ Error accessing "user_profiles" table:', userError.message);
        if (userError.code === '404') console.error('   -> Table "user_profiles" does not exist.');
    } else {
        console.log('✅ Connected to "user_profiles" table.');
    }

    if (!eventError && !userError) {
        console.log('\n🎉 DATABASE IS CORRECTLY CONFIGURED!');
    } else {
        console.log('\n⚠️  There are issues with the database configuration.');
    }
}

check();
