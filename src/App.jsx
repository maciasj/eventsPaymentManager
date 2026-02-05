import { useState, useEffect } from 'react';
import { useEvents } from './hooks/useEvents';
import { Auth } from './components/Auth/Auth';
import { Calendar } from './components/Calendar/Calendar';
import { EventList } from './components/EventList/EventList';
import { MonthlyReport } from './components/MonthlyReport/MonthlyReport';
import { EventModal } from './components/shared/EventModal';
import { Navigation } from './components/shared/Navigation';
import './styles/globals.css';
import './App.css';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('eventManagerUser') || null);
  const [currentView, setCurrentView] = useState('calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { events, loading, isOnline, syncing, addEvent, modifyEvent, removeEvent } = useEvents(user);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('eventManagerUser');
    setUser(null);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await addEvent(eventData);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Error al crear el evento. Por favor, intenta de nuevo.');
    }
  };

  const handleUpdateEvent = async (id, updates) => {
    try {
      await modifyEvent(id, updates);
    } catch (error) {
      console.error('Failed to update event:', error);
      alert('Error al actualizar el evento. Por favor, intenta de nuevo.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await removeEvent(id);
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Error al eliminar el evento. Por favor, intenta de nuevo.');
      }
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando eventos de {user}...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="app-branding">
            <div className="app-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1>Event Manager</h1>
              <p className="subtitle">Hola, <strong>{user}</strong></p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-small btn-secondary" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
            Salir
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {currentView === 'calendar' && (
            <Calendar events={events} onDayClick={handleDayClick} />
          )}

          {currentView === 'events' && (
            <EventList
              events={events}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {currentView === 'report' && (
            <MonthlyReport events={events} />
          )}
        </div>
      </main>

      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        isOnline={isOnline}
        syncing={syncing}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default App;
