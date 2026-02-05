import { createClient } from '@supabase/supabase-js';
import { verifyLocalUser, createLocalUser } from './indexedDB';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (will be null if env vars not set)
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
    return supabase !== null;
};

// Simple Auth Operations
export const verifyUser = async (username, password) => {
    // If Supabase is not configured, implement strict local check instead of bypassing
    if (!supabase) {
        return await verifyLocalUser(username, password);
    }

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('password')
            .eq('username', username)
            .single();

        if (error && error.code === 'PGRST116') return null; // User not found
        if (error) throw error;

        return data.password === password;
    } catch (error) {
        console.warn('Supabase auth error, falling back to local:', error);
        // Fallback to local authentication if cloud fails (e.g. table missing or network error)
        return await verifyLocalUser(username, password);
    }
};

export const createUser = async (username, password) => {
    // Always save locally first so we have it offline
    await createLocalUser(username, password);

    if (!supabase) return true;

    const { error } = await supabase
        .from('user_profiles')
        .insert([{ username, password }]);

    if (error) {
        // If error (e.g. offline), we already saved locally, so just warn
        console.warn('Could not sync user to cloud:', error);
    }
    return true;
};

// Event operations
export const fetchEvents = async (username) => {
    if (!supabase) return [];

    try {
        let query = supabase
            .from('events')
            .select('*')
            .order('start_date', { ascending: true });

        if (username) {
            query = query.eq('username', username);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const createEvent = async (event) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('events')
            .insert([event])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const updateEvent = async (id, updates) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('events')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    if (!supabase) return null;

    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
