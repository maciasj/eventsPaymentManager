import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './EventModal.css';

export const EventModal = ({ isOpen, onClose, onSubmit, selectedDate }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Partido',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        if (selectedDate) {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            setFormData(prev => ({
                ...prev,
                start_date: dateStr,
                end_date: dateStr,
            }));
        }
    }, [selectedDate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const eventData = {
            ...formData,
            // If not Fira, ensure end_date matches start_date
            end_date: formData.type === 'Fira' ? formData.end_date : formData.start_date,
            // Initialize other fields with defaults
            start_time: '',
            end_time: '',
            hours_worked: 0,
            payment_expected: 0,
            payment_real: 0,
            is_paid: false
        };

        onSubmit(eventData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({ name: '', type: 'Partido', start_date: '', end_date: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleClose}>
            <div className="modal slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Crear Evento</h3>
                    <button onClick={handleClose} className="btn-icon" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label htmlFor="event-name">Nombre del Evento</label>
                        <input
                            id="event-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Evento en el centro"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="event-type">Tipo de Evento</label>
                        <div className="event-type-selector">
                            {['Partido', 'Concierto', 'Fira'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`event-type-btn ${formData.type === type ? 'active' : ''} type-${type.toLowerCase()}`}
                                    onClick={() => setFormData({ ...formData, type })}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="start-date">
                            {formData.type === 'Fira' ? 'Fecha de Inicio' : 'Fecha'}
                        </label>
                        <input
                            id="start-date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            required
                        />
                    </div>

                    {formData.type === 'Fira' && (
                        <div className="form-group">
                            <label htmlFor="end-date">Fecha de Fin</label>
                            <input
                                id="end-date"
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                min={formData.start_date}
                                required
                            />
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" onClick={handleClose} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Crear Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
