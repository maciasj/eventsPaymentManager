import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent, isSupabaseConfigured } from '../services/supabase';
import { saveEventLocally, getLocalEvents, deleteEventLocally, addToSyncQueue, getPendingSyncItems, clearSyncQueue } from '../services/indexedDB';

export const useEvents = (username) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncing, setSyncing] = useState(false);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Sync local changes to Supabase when online
    const syncToSupabase = useCallback(async () => {
        if (!isSupabaseConfigured() || !isOnline) return;

        setSyncing(true);
        try {
            const pendingItems = await getPendingSyncItems();

            for (const item of pendingItems) {
                try {
                    // Ensure item has username if missing
                    if (username && !item.data.username) {
                        item.data.username = username;
                    }

                    if (item.action === 'create') {
                        await createEvent(item.data);
                    } else if (item.action === 'update') {
                        await updateEvent(item.eventId, item.data);
                    } else if (item.action === 'delete') {
                        await deleteEvent(item.eventId);
                    }
                } catch (error) {
                    console.error('Sync error for item:', item, error);
                }
            }

            await clearSyncQueue();
            await loadEvents(); // Reload from Supabase
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            setSyncing(false);
        }
    }, [isOnline, username]);

    // Load events from Supabase or local storage
    const loadEvents = useCallback(async () => {
        if (!username) return; // Don't load if no user

        setLoading(true);
        try {
            // 1. Always load local events first (includes User's events AND Orphans)
            const localMixedEvents = await getLocalEvents(username);

            // 2. Identify and Claim Orphans
            const eventsWithClaim = await Promise.all(localMixedEvents.map(async (ev) => {
                if (!ev.username) {
                    // It's an orphan! Claim it.
                    const claimed = { ...ev, username: username, updated_at: new Date().toISOString() };
                    await saveEventLocally(claimed); // Save change locally

                    // Queue for sync so it gets to the cloud
                    await addToSyncQueue('create', claimed.id, claimed);

                    return claimed;
                }
                return ev;
            }));

            let finalEvents = eventsWithClaim;

            // 3. If Online, fetch from Cloud and Merge
            if (isSupabaseConfigured() && isOnline) {
                try {
                    const cloudEvents = await fetchEvents(username);

                    // Merge: Trust Cloud for overlapping IDs, Keep Local for unique IDs (like our orphans)
                    const cloudIds = new Set(cloudEvents.map(e => e.id));
                    const localOnly = finalEvents.filter(e => !cloudIds.has(e.id));

                    // Save cloud events to local cache
                    for (const event of cloudEvents) {
                        await saveEventLocally({ ...event, sync_status: 'synced' });
                    }

                    // Combine them
                    finalEvents = [...cloudEvents, ...localOnly];

                    // Sort by start_date
                    finalEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

                } catch (err) {
                    console.warn("Cloud fetch failed, using local", err);
                }
            } else {
                // Just sort locals
                finalEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
            }

            setEvents(finalEvents);
        } catch (error) {
            console.error('Error loading events:', error);
            // Fallback to local storage
            const localEvents = await getLocalEvents(username);
            setEvents(localEvents);
        } finally {
            setLoading(false);
        }
    }, [isOnline, username]);

    // Initial load and sync when coming online
    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    useEffect(() => {
        if (isOnline) {
            syncToSupabase();
        }
    }, [isOnline, syncToSupabase]);

    // Add new event
    const addEvent = useCallback(async (eventData) => {
        if (!username) return;

        try {
            const newEvent = {
                ...eventData,
                id: crypto.randomUUID(),
                username: username, // Link to user
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                hours_worked: eventData.hours_worked || 0,
                payment_expected: eventData.payment_expected || 0,
                payment_real: eventData.payment_real || 0,
                is_paid: eventData.is_paid || false,
            };

            // Save locally first
            await saveEventLocally(newEvent);
            setEvents(prev => [...prev, newEvent]);

            // Try to sync to Supabase if online
            if (isSupabaseConfigured() && isOnline) {
                try {
                    const created = await createEvent(newEvent);
                    if (created) {
                        await saveEventLocally({ ...created, sync_status: 'synced' });
                        setEvents(prev => prev.map(e => e.id === newEvent.id ? { ...created, sync_status: 'synced' } : e));
                    }
                } catch (error) {
                    // Queue for later sync
                    await addToSyncQueue('create', newEvent.id, newEvent);
                }
            } else {
                // Queue for later sync
                await addToSyncQueue('create', newEvent.id, newEvent);
            }

            return newEvent;
        } catch (error) {
            console.error('Error adding event:', error);
            throw error;
        }
    }, [isOnline, username]);

    // Update event
    const modifyEvent = useCallback(async (id, updates) => {
        try {
            // Update locally first
            const updatedEvent = events.find(e => e.id === id);
            if (!updatedEvent) return;

            const updated = { ...updatedEvent, ...updates, updated_at: new Date().toISOString() };
            await saveEventLocally(updated);
            setEvents(prev => prev.map(e => e.id === id ? updated : e));

            // Try to sync to Supabase if online
            if (isSupabaseConfigured() && isOnline) {
                try {
                    await updateEvent(id, updates);
                    await saveEventLocally({ ...updated, sync_status: 'synced' });
                } catch (error) {
                    // Queue for later sync
                    await addToSyncQueue('update', id, updates);
                }
            } else {
                // Queue for later sync
                await addToSyncQueue('update', id, updates);
            }

            return updated;
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }, [events, isOnline]);

    // Remove event
    const removeEvent = useCallback(async (id) => {
        try {
            // Delete locally first
            await deleteEventLocally(id);
            setEvents(prev => prev.filter(e => e.id !== id));

            // Try to sync to Supabase if online
            if (isSupabaseConfigured() && isOnline) {
                try {
                    await deleteEvent(id);
                } catch (error) {
                    // Queue for later sync
                    await addToSyncQueue('delete', id, null);
                }
            } else {
                // Queue for later sync
                await addToSyncQueue('delete', id, null);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }, [isOnline]);

    return {
        events,
        loading,
        isOnline,
        syncing,
        addEvent,
        modifyEvent,
        removeEvent,
        refreshEvents: loadEvents,
    };
};
