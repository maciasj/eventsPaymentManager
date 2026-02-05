import { useState, useMemo } from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import './EventList.css';

export const EventList = ({ events, onUpdateEvent, onDeleteEvent }) => {
    const [filter, setFilter] = useState('all'); // all, upcoming, unpaid

    const filteredEvents = useMemo(() => {
        let sorted = [...events].sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

        if (filter === 'upcoming') {
            return sorted.filter(e => !isPast(new Date(e.start_date)));
        }
        if (filter === 'unpaid') {
            return sorted.filter(e => !e.is_paid);
        }
        return sorted;
    }, [events, filter]);

    // Handle changes with business logic
    const handleChange = (id, field, value) => {
        const event = events.find(e => e.id === id);
        if (!event) return;

        let updates = { [field]: value };

        // Auto-calculate hours if times change
        if (field === 'start_time' || field === 'end_time') {
            const start = field === 'start_time' ? value : event.start_time;
            const end = field === 'end_time' ? value : event.end_time;

            if (start && end) {
                const [startH, startM] = start.split(':').map(Number);
                const [endH, endM] = end.split(':').map(Number);
                let diff = (endH * 60 + endM) - (startH * 60 + startM);
                if (diff < 0) diff += 24 * 60; // Overnight
                updates.hours_worked = parseFloat((diff / 60).toFixed(2));
            }
        }

        // Auto-set paid status if real payment is entered
        if (field === 'payment_real') {
            const realAmount = parseFloat(value);
            if (realAmount > 0) {
                updates.is_paid = true;
            }
        }

        onUpdateEvent(id, updates);
    };

    const togglePaid = (id, currentStatus) => {
        onUpdateEvent(id, { is_paid: !currentStatus });
    };

    if (events.length === 0) {
        return (
            <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3>No hay eventos</h3>
                <p>Crea tu primer evento desde el calendario.</p>
            </div>
        );
    }

    return (
        <div className="event-list-container fade-in">
            <div className="event-list-header">
                <h2>Mis Eventos</h2>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setFilter('upcoming')}
                    >
                        Próximos
                    </button>
                    <button
                        className={`filter-btn ${filter === 'unpaid' ? 'active' : ''}`}
                        onClick={() => setFilter('unpaid')}
                    >
                        Pendientes
                    </button>
                </div>
            </div>

            <div className="event-list">
                {filteredEvents.map(event => (
                    <div key={event.id} className={`event-card type-${event.type.toLowerCase()}`}>
                        <div className="card-top-row">
                            <div className="event-date-badge">
                                <div className="date-day">{format(parseISO(event.start_date), 'd')}</div>
                                <div className="date-month">{format(parseISO(event.start_date), 'MMM', { locale: es })}</div>
                            </div>

                            <div className="event-main-info">
                                <h3>{event.name}</h3>
                                <span className={`type-badge type-${event.type.toLowerCase()}`}>{event.type}</span>
                            </div>

                            <button
                                className="btn-delete-icon"
                                onClick={() => onDeleteEvent(event.id)}
                                aria-label="Delete"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        <div className="card-controls">
                            {/* Row 1: Time & Hours */}
                            {/* Row 1: Time & Hours (Custom 24h Selectors) */}
                            <div className="control-group time-group">
                                <div className="input-field time-select-container">
                                    <label>Inicio</label>
                                    <div className="time-select-wrapper">
                                        <select
                                            value={event.start_time ? event.start_time.split(':')[0] : ''}
                                            onChange={(e) => {
                                                const h = e.target.value;
                                                const m = event.start_time ? event.start_time.split(':')[1] : '00';
                                                handleChange(event.id, 'start_time', `${h}:${m}`);
                                            }}
                                            className="time-select"
                                        >
                                            <option value="" disabled>HH</option>
                                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                        <span className="time-separator">:</span>
                                        <select
                                            value={event.start_time ? event.start_time.split(':')[1] : ''}
                                            onChange={(e) => {
                                                const m = e.target.value;
                                                const h = event.start_time ? event.start_time.split(':')[0] : '00';
                                                handleChange(event.id, 'start_time', `${h}:${m}`);
                                            }}
                                            className="time-select"
                                        >
                                            <option value="" disabled>MM</option>
                                            {['00', '15', '30', '45'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-field time-select-container">
                                    <label>Fin</label>
                                    <div className="time-select-wrapper">
                                        <select
                                            value={event.end_time ? event.end_time.split(':')[0] : ''}
                                            onChange={(e) => {
                                                const h = e.target.value;
                                                const m = event.end_time ? event.end_time.split(':')[1] : '00';
                                                handleChange(event.id, 'end_time', `${h}:${m}`);
                                            }}
                                            className="time-select"
                                        >
                                            <option value="" disabled>HH</option>
                                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                                <option key={h} value={h}>{h}</option>
                                            ))}
                                        </select>
                                        <span className="time-separator">:</span>
                                        <select
                                            value={event.end_time ? event.end_time.split(':')[1] : ''}
                                            onChange={(e) => {
                                                const m = e.target.value;
                                                const h = event.end_time ? event.end_time.split(':')[0] : '00';
                                                handleChange(event.id, 'end_time', `${h}:${m}`);
                                            }}
                                            className="time-select"
                                        >
                                            <option value="" disabled>MM</option>
                                            {['00', '15', '30', '45'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="input-field readonly">
                                    <label>Horas</label>
                                    <div className="fake-input">{event.hours_worked || 0}</div>
                                </div>
                            </div>

                            {/* Row 2: Payments & Status */}
                            <div className="control-group money-group">
                                <div className="input-field">
                                    <label>Previsión (€)</label>
                                    <input
                                        type="number"
                                        value={event.payment_expected || ''}
                                        onChange={(e) => handleChange(event.id, 'payment_expected', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="input-field">
                                    <label>Cobrado (€)</label>
                                    <input
                                        type="number"
                                        value={event.payment_real || ''}
                                        onChange={(e) => handleChange(event.id, 'payment_real', e.target.value)}
                                        placeholder="0"
                                        className={event.payment_real > 0 ? 'has-value' : ''}
                                    />
                                </div>

                                <button
                                    className={`status-btn ${event.is_paid ? 'paid' : 'pending'}`}
                                    onClick={() => togglePaid(event.id, event.is_paid)}
                                >
                                    {event.is_paid ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                            Pagado
                                        </>
                                    ) : (
                                        'Pendiente'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
