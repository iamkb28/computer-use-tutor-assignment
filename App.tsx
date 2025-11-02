
import React, { useState, useReducer, useCallback, useMemo } from 'react';
import { CalendarEvent, CalendarView } from './types';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import { getMonth, getYear, setMonth, setYear, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, parseISO, format } from './utils/dateUtils';

type EventsAction =
  | { type: 'SET'; payload: CalendarEvent[] }
  | { type: 'ADD'; payload: CalendarEvent }
  | { type: 'UPDATE'; payload: CalendarEvent }
  | { type: 'DELETE'; payload: string };

function eventsReducer(state: CalendarEvent[], action: EventsAction): CalendarEvent[] {
  switch (action.type) {
    case 'SET':
      return action.payload;
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map(event => event.id === action.payload.id ? action.payload : event);
    case 'DELETE':
      return state.filter(event => event.id !== action.payload);
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [events, dispatch] = useReducer(eventsReducer, []);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/events');
        const data = await response.json();
        dispatch({ type: 'SET', payload: data.events });
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handlePrev = useCallback(() => {
    if (view === 'month') setCurrentDate(prev => subMonths(prev, 1));
    if (view === 'week') setCurrentDate(prev => subWeeks(prev, 1));
    if (view === 'day') setCurrentDate(prev => subDays(prev, 1));
  }, [view]);

  const handleNext = useCallback(() => {
    if (view === 'month') setCurrentDate(prev => addMonths(prev, 1));
    if (view === 'week') setCurrentDate(prev => addWeeks(prev, 1));
    if (view === 'day') setCurrentDate(prev => addDays(prev, 1));
  }, [view]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const openModalForNewEvent = useCallback((date: Date) => {
    setSelectedEvent(null);
    setModalDate(date);
    setIsModalOpen(true);
  }, []);
  
  const openModalForExistingEvent = useCallback((event: CalendarEvent) => {
    const originalId = event.id.split('-')[0];
    const originalEvent = events.find(e => e.id === originalId);

    setSelectedEvent(originalEvent || event);
    setModalDate(null);
    setIsModalOpen(true);
  }, [events]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalDate(null);
  }, []);

  const handleSaveEvent = useCallback(async (event: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (event.id) {
      dispatch({ type: 'UPDATE', payload: event as CalendarEvent });
    } else {
      try {
        const response = await fetch('http://localhost:3001/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
        const newEvent = await response.json();
        dispatch({ type: 'ADD', payload: { ...event, id: newEvent.id.toString() } });
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
    closeModal();
  }, [closeModal]);

  const handleEventUpdate = useCallback(async (event: CalendarEvent) => {
    try {
      const response = await fetch(`http://localhost:3001/events/${event.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );
      await response.json();
      dispatch({ type: 'UPDATE', payload: event });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }, []);

  const handleDeleteEvent = useCallback(async (id: string) => {
    try {
      await fetch(`http://localhost:3001/events/${id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'DELETE', payload: id });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    closeModal();
  }, [closeModal]);
  
  const visibleEvents = useMemo(() => {
    let viewStartDate: Date;
    let viewEndDate: Date;

    if (view === 'month') {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        viewStartDate = new Date(firstDay);
        viewStartDate.setDate(viewStartDate.getDate() - firstDay.getDay());
        
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        viewEndDate = new Date(lastDay);
        viewEndDate.setDate(viewEndDate.getDate() + (6 - lastDay.getDay()));
    } else if (view === 'week') {
        viewStartDate = new Date(currentDate);
        viewStartDate.setDate(currentDate.getDate() - currentDate.getDay());
        viewEndDate = new Date(viewStartDate);
        viewEndDate.setDate(viewEndDate.getDate() + 6);
    } else { // day view
        viewStartDate = new Date(currentDate);
        viewEndDate = new Date(currentDate);
    }
    viewStartDate.setHours(0, 0, 0, 0);
    viewEndDate.setHours(23, 59, 59, 999);

    const expandedEvents: CalendarEvent[] = [];
    const recurrenceLimit = new Date(viewEndDate);
    recurrenceLimit.setFullYear(recurrenceLimit.getFullYear() + 1);

    events.forEach(event => {
      if (!event.recurrence || event.recurrence === 'none') {
        const eventDate = parseISO(event.date);
        if (eventDate >= viewStartDate && eventDate <= viewEndDate) {
          expandedEvents.push(event);
        }
      } else {
        const startDate = parseISO(event.date);
        let cursorDate = new Date(startDate);
        const originalDayOfMonth = startDate.getDate();

        while(cursorDate < startDate && cursorDate < viewEndDate) {
           if (event.recurrence === 'daily') cursorDate.setDate(cursorDate.getDate() + 1);
           else if (event.recurrence === 'weekly') cursorDate.setDate(cursorDate.getDate() + 7);
           else if (event.recurrence === 'monthly') cursorDate.setMonth(cursorDate.getMonth() + 1);
           else if (event.recurrence === 'annually') cursorDate.setFullYear(cursorDate.getFullYear() + 1);
        }

        while (cursorDate <= viewEndDate && cursorDate <= recurrenceLimit) {
            if (cursorDate >= viewStartDate) {
                expandedEvents.push({
                    ...event,
                    date: format(cursorDate, 'yyyy-MM-dd'),
                    id: `${event.id}-${format(cursorDate, 'yyyyMMdd')}`,
                });
            }

            switch(event.recurrence) {
                case 'daily':
                    cursorDate.setDate(cursorDate.getDate() + 1);
                    break;
                case 'weekly':
                    cursorDate.setDate(cursorDate.getDate() + 7);
                    break;
                case 'monthly':
                    const currentMonth = cursorDate.getMonth();
                    cursorDate.setMonth(currentMonth + 1);
                    // If we skipped a month (e.g., Jan 31 to Mar), go to last day of Feb
                    if (cursorDate.getMonth() === currentMonth + 2) {
                        cursorDate.setDate(0);
                    } else {
                       cursorDate.setDate(originalDayOfMonth);
                    }
                    break;
                case 'annually':
                    cursorDate.setFullYear(cursorDate.getFullYear() + 1);
                    break;
            }
        }
      }
    });
    return expandedEvents;
  }, [events, currentDate, view]);

  const renderView = useMemo(() => {
    const props = { 
        currentDate, 
        events: visibleEvents, 
        onEventClick: openModalForExistingEvent, 
        onCellClick: openModalForNewEvent,
        onEventUpdate: handleEventUpdate
    };
    switch (view) {
      case 'month':
        return <MonthView {...props} />;
      case 'week':
        return <WeekView {...props} />;
      case 'day':
        return <DayView {...props} />;
      default:
        return <MonthView {...props} />;
    }
  }, [view, currentDate, visibleEvents, openModalForExistingEvent, openModalForNewEvent, handleEventUpdate]);

  return (
    <div className="flex h-screen bg-white text-gray-700 font-sans">
      {isSidebarOpen && <Sidebar currentDate={currentDate} onDateChange={setCurrentDate} onNewEventClick={() => openModalForNewEvent(new Date())} />}
      <div className="flex flex-col flex-grow">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-grow overflow-auto custom-scrollbar">
          {renderView}
        </main>
      </div>
      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          event={selectedEvent}
          date={modalDate}
        />
      )}
    </div>
  );
};

export default App;
