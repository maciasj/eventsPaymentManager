import './Navigation.css';

export const Navigation = ({ currentView, onViewChange, isOnline, syncing }) => {
    return (
        <nav className="bottom-nav">
            <button
                className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                onClick={() => onViewChange('calendar')}
                aria-label="Calendar view"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Calendario</span>
            </button>

            <button
                className={`nav-item ${currentView === 'events' ? 'active' : ''}`}
                onClick={() => onViewChange('events')}
                aria-label="Events list view"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
                <span>Eventos</span>
            </button>

            <button
                className={`nav-item ${currentView === 'report' ? 'active' : ''}`}
                onClick={() => onViewChange('report')}
                aria-label="Monthly report view"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9M13 17V5M8 17v-3" />
                </svg>
                <span>Resumen</span>
            </button>

            <div className="sync-status">
                {syncing ? (
                    <div className="sync-indicator syncing">
                        <div className="spinner-small"></div>
                        <span>Sincronizando...</span>
                    </div>
                ) : (
                    <div className={`sync-indicator ${isOnline ? 'online' : 'offline'}`}>
                        <div className="status-dot"></div>
                        <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
                    </div>
                )}
            </div>
        </nav>
    );
};
