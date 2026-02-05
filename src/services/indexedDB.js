import Dexie from 'dexie';

// Local database for offline support
export const db = new Dexie('EventManagerDB');

db.version(1).stores({
    events: 'id, name, type, start_date, end_date, start_time, end_time, hours_worked, payment_expected, payment_real, is_paid, created_at, updated_at, sync_status, username',
    user_profiles: 'username, password',
    syncQueue: '++id, action, eventId, data, timestamp'
});

// Helper functions
export const saveEventLocally = async (event) => {
    const eventWithSync = {
        ...event,
        sync_status: 'pending',
        updated_at: new Date().toISOString()
    };
    await db.events.put(eventWithSync);
    return eventWithSync;
};

export const getLocalEvents = async (username) => {
    // Return events belonging to user OR events with no user (orphans)
    // This ensures legacy data is visible to the first person who logs in
    return await db.events
        .filter(event => event.username === username || !event.username)
        .toArray();
};

export const deleteEventLocally = async (id) => {
    await db.events.delete(id);
};

export const addToSyncQueue = async (action, eventId, data) => {
    await db.syncQueue.add({
        action,
        eventId,
        data,
        timestamp: new Date().toISOString()
    });
};

export const getPendingSyncItems = async () => {
    return await db.syncQueue.toArray();
};

// Local Auth Operations
export const verifyLocalUser = async (username, password) => {
    const user = await db.user_profiles.get(username);
    if (!user) return null; // User not found
    return user.password === password;
};

export const createLocalUser = async (username, password) => {
    await db.user_profiles.put({ username, password });
    return true;
};

export const clearSyncQueue = async () => {
    await db.syncQueue.clear();
};
