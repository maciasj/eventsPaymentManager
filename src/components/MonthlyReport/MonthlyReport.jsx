import { useState } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, parseISO, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import './MonthlyReport.css';

export const MonthlyReport = ({ events }) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());

    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);

    const eventsInMonth = events.filter(event => {
        const eventDate = parseISO(event.start_date);
        return isWithinInterval(eventDate, { start: monthStart, end: monthEnd });
    });

    const stats = eventsInMonth.reduce((acc, event) => {
        const isPaid = event.is_paid;
        const paymentExpected = parseFloat(event.payment_expected) || 0;
        const paymentReal = parseFloat(event.payment_real) || 0;

        if (isPaid) {
            acc.totalPaid += paymentReal;
        } else {
            acc.outstandingPayments += paymentExpected;
        }

        acc.totalExpected += paymentExpected;
        acc.totalHours += parseFloat(event.hours_worked) || 0;
        acc.eventCount++;

        // Count by type
        acc.byType[event.type] = (acc.byType[event.type] || 0) + 1;

        return acc;
    }, {
        totalPaid: 0,
        outstandingPayments: 0,
        totalExpected: 0,
        totalHours: 0,
        eventCount: 0,
        byType: {}
    });

    const paidEvents = eventsInMonth.filter(e => e.is_paid);
    const unpaidEvents = eventsInMonth.filter(e => !e.is_paid);

    const previousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
    const nextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));
    const goToThisMonth = () => setSelectedMonth(new Date());

    return (
        <div className="monthly-report-container fade-in">
            <div className="report-header">
                <button onClick={previousMonth} className="btn-icon" aria-label="Previous month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="report-title">
                    <h2>{format(selectedMonth, 'MMMM yyyy', { locale: es })}</h2>
                    <button onClick={goToThisMonth} className="btn-small btn-secondary">Este mes</button>
                </div>

                <button onClick={nextMonth} className="btn-icon" aria-label="Next month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-primary">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Pagado</div>
                        <div className="stat-value">{stats.totalPaid.toFixed(2)} €</div>
                        <div className="stat-detail">{paidEvents.length} evento{paidEvents.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div className="stat-card stat-warning">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Pendiente de Pago</div>
                        <div className="stat-value">{stats.outstandingPayments.toFixed(2)} €</div>
                        <div className="stat-detail">{unpaidEvents.length} evento{unpaidEvents.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div className="stat-card stat-success">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Horas Totales</div>
                        <div className="stat-value">{stats.totalHours.toFixed(1)} h</div>
                        <div className="stat-detail">{stats.eventCount} evento{stats.eventCount !== 1 ? 's' : ''}</div>
                    </div>
                </div>

                <div className="stat-card stat-info">
                    <div className="stat-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-label">Total Esperado</div>
                        <div className="stat-value">{stats.totalExpected.toFixed(2)} €</div>
                        <div className="stat-detail">
                            {stats.totalPaid > 0 ? `${((stats.totalPaid / stats.totalExpected) * 100).toFixed(0)}% cobrado` : 'Sin cobros'}
                        </div>
                    </div>
                </div>
            </div>

            {Object.keys(stats.byType).length > 0 && (
                <div className="breakdown-section">
                    <h3>Desglose por tipo</h3>
                    <div className="type-breakdown">
                        {Object.entries(stats.byType).map(([type, count]) => (
                            <div key={type} className={`type-item type-${type.toLowerCase()}`}>
                                <span className={`badge badge-${type.toLowerCase()}`}>{type}</span>
                                <span className="type-count">{count} evento{count !== 1 ? 's' : ''}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {eventsInMonth.length === 0 && (
                <div className="empty-report">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p>No hay eventos en este mes</p>
                </div>
            )}
        </div>
    );
};
