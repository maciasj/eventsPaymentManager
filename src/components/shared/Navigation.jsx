import { useState, useEffect } from 'react';
import { isSupabaseConfigured, testConnection } from '../../services/supabase';
import './Navigation.css';

export const Navigation = ({ currentView, onViewChange }) => {
    const [cloudStatus, setCloudStatus] = useState('checking');

    useEffect(() => {
        const checkStatus = async () => {
            if (!isSupabaseConfigured()) {
                setCloudStatus('offline');
                return;
            }
            const isOk = await testConnection();
            setCloudStatus(isOk ? 'online' : 'error');
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="bottom-nav">
            <div className="nav-items-container">
                <button
                    className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
                    onClick={() => onViewChange('calendar')}
                    aria-label="Calendar view"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Calendario</span>
                </button>

                <button
                    className={`nav-item ${currentView === 'list' ? 'active' : ''}`}
                    onClick={() => onViewChange('list')}
                    aria-label="List view"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                    <span>Lista</span>
                </button>

                <button
                    className={`nav-item ${currentView === 'report' ? 'active' : ''}`}
                    onClick={() => onViewChange('report')}
                    aria-label="Report view"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>Resumen</span>
                </button>
            </div>

            <div className={`cloud-status-mini ${cloudStatus}`}>
                <div className="status-dot"></div>
                <span>{cloudStatus === 'online' ? 'Sincronizado' : 'Solo Local'}</span>
            </div>
        </nav>
    );
};
