import { createClient } from '@supabase/supabase-js';
import { verifyLocalUser, createLocalUser } from './indexedDB';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => {
    return supabase !== null;
};

export const testConnection = async () => {
    if (!supabase) return false;
    try {
        const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Test connection error:', error);
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export const verifyUser = async (username, password) => {
    if (!supabase) return await verifyLocalUser(username, password);

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('password')
            .eq('username', username)
            .single();

        if (error && error.code === 'PGRST116') return null; // Not found
        if (error) {
            console.error('Database Error:', error);
            alert('Error al verificar usuario: ' + error.message + ' (Code: ' + error.code + ')');
            throw error;
        }

        return data.password === password;
    } catch (error) {
        console.warn('Supabase auth failed:', error);
        // ONLY fallback to local if it's a network error, not a permission error
        if (error.message === 'Failed to fetch') {
            return await verifyLocalUser(username, password);
        }
        return false;
    }
};

export const createUser = async (username, password) => {
    // 1. Save local
    await createLocalUser(username, password);

    if (!supabase) return true;

    // 2. Try cloud
    try {
        const { error } = await supabase
            .from('user_profiles')
            .insert([{ username, password }]);

        if (error) {
            console.error('Registration failed:', error);
            if (error.code === '23505') {
                // Already exists
                return true;
            }
            alert('Error en Registro: ' + error.message + ' (Código: ' + error.code + ')');
            return false;
        }
        return true;
    } catch (err) {
        console.error('Critical registration error:', err);
        return false;
    }
};

export const fetchEvents = async (username) => {
    if (!supabase) return [];
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('username', username)
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching:', error);
        return [];
    }
};

export const createEvent = async (event) => {
    if (!supabase) return null;
    try {
        // Remove sync_status for cloud save
        const { sync_status, ...cloudData } = event;
        const { data, error } = await supabase
            .from('events')
            .insert([cloudData])
            .select()
            .single();

        if (error) {
            console.error('Sync error:', error);
            alert('Error al sincronizar evento: ' + error.message);
            throw error;
        }
        return data;
    } catch (error) {
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
        console.error('Update error:', error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    if (!supabase) return null;
    try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};
