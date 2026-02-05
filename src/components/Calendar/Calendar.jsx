import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import './Calendar.css';

export const Calendar = ({ events, onDayClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());

    const getEventsForDay = (day) => {
        return events.filter(event => {
            // Create dates and reset time components to ensure pure date comparison
            const eventStart = new Date(event.start_date);
            eventStart.setHours(0, 0, 0, 0);

            const eventEnd = event.end_date ? new Date(event.end_date) : new Date(eventStart);
            eventEnd.setHours(23, 59, 59, 999); // End of day for interval check convention

            const currentDay = new Date(day);
            currentDay.setHours(12, 0, 0, 0); // Mid-day to avoid edge cases

            // Check if current day is between start and end
            return currentDay >= eventStart && currentDay <= eventEnd;
        });
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        onDayClick(day);
    };

    return (
        <div className="calendar-container fade-in">
            <div className="calendar-header">
                <button onClick={previousMonth} className="btn-icon" aria-label="Previous month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

                <div className="calendar-title">
                    <h2>{format(currentMonth, 'MMMM yyyy', { locale: es })}</h2>
                    <button onClick={goToToday} className="btn-small btn-secondary">Hoy</button>
                </div>

                <button onClick={nextMonth} className="btn-icon" aria-label="Next month">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="calendar-weekdays">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={i} className="weekday">{day}</div>
                ))}
            </div>

            <div className="calendar-grid">
                {days.map((day, i) => {
                    const dayEvents = getEventsForDay(day);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const isSelected = selectedDay && isSameDay(day, selectedDay);

                    return (
                        <button
                            key={i}
                            className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dayEvents.length > 0 ? 'has-events' : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleDayClick(day)}
                            disabled={!isCurrentMonth}
                        >
                            <span className="day-number">{format(day, 'd')}</span>
                            {dayEvents.length > 0 && (
                                <div className="day-events-list">
                                    {dayEvents.slice(0, 2).map((event, idx) => (
                                        <div
                                            key={idx}
                                            className={`event-item event-${event.type.toLowerCase()}`}
                                            title={event.name}
                                        >
                                            <span className="event-name">{event.name}</span>
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <span className="more-events">+{dayEvents.length - 2} más</span>
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
