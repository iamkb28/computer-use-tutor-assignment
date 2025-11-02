
import React, { useState, useReducer, useCallback, useMemo } from 'react';
import { CalendarEvent, CalendarView } from './types';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import EventModal from './components/EventModal';
import { getMonth, getYear, setMonth, setYear, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from './utils/dateUtils';

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Design Review', date: '2024-07-15', startTime: '10:00', endTime: '11:00', color: 'blue' },
  { id: '2', title: 'Team Standup', date: '2024-07-16', startTime: '09:00', endTime: '09:30', color: 'green' },
  { id: '3', title: 'Project Kickoff', date: '2024-07-16', startTime: '14:00', endTime: '15:00', color: 'indigo' },
  { id: '4', title: 'Dentist Appointment', date: '2024-07-20', startTime: '11:00', endTime: '12:00', color: 'red' },
];

type EventsAction =
  | { type: 'ADD'; payload: CalendarEvent }
  | { type: 'UPDATE'; payload: CalendarEvent }
  | { type: 'DELETE'; payload: string };

function eventsReducer(state: CalendarEvent[], action: EventsAction): CalendarEvent[] {
  switch (action.type) {
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
  const [events, dispatch] = useReducer(eventsReducer, initialEvents);
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
    setSelectedEvent(event);
    setModalDate(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setModalDate(null);
  }, []);

  const handleSaveEvent = useCallback((event: Omit<CalendarEvent, 'id'> & { id?: string }) => {
    if (event.id) {
      dispatch({ type: 'UPDATE', payload: event as CalendarEvent });
    } else {
      dispatch({ type: 'ADD', payload: { ...event, id: Date.now().toString() } });
    }
    closeModal();
  }, [closeModal]);

  const handleEventUpdate = useCallback((event: CalendarEvent) => {
    dispatch({ type: 'UPDATE', payload: event });
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    dispatch({ type: 'DELETE', payload: id });
    closeModal();
  }, [closeModal]);

  const renderView = useMemo(() => {
    const props = { 
        currentDate, 
        events, 
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
  }, [view, currentDate, events, openModalForExistingEvent, openModalForNewEvent, handleEventUpdate]);

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
