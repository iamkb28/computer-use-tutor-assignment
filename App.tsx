import React, { useState, useReducer, useCallback, useMemo } from 'react';
import CalendarHeader from './components/CalendarHeader.js';
import Sidebar from './components/Sidebar.js';
import MonthView from './components/MonthView.js';
import WeekView from './components/WeekView.js';
import DayView from './components/DayView.js';
import EventModal from './components/EventModal.js';
import { getMonth, getYear, setMonth, setYear, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, parseISO, format } from './utils/dateUtils.js';

const initialEvents = [
  { id: '1', title: 'Design Review', date: '2024-07-15', startTime: '10:00', endTime: '11:00', color: 'blue' },
  { id: '2', title: 'Team Standup', date: '2024-07-16', startTime: '09:00', endTime: '09:30', color: 'green' },
  { id: '3', title: 'Project Kickoff', date: '2024-07-16', startTime: '14:00', endTime: '15:00', color: 'indigo' },
  { id: '4', title: 'Dentist Appointment', date: '2024-07-20', startTime: '11:00', endTime: '12:00', color: 'red' },
  { id: '5', title: 'Weekly All-Hands', date: '2024-07-03', startTime: '11:00', endTime: '12:00', color: 'purple', recurrence: 'weekly' },
];

function eventsReducer(state, action) {
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

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, dispatch] = useReducer(eventsReducer, initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalDate, setModalDate] = useState(null);
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

  const openModalForNewEvent = useCallback((date) => {
    setSelectedEvent(null);
    setModalDate(date);
    setIsModalOpen(true);
  }, []);
  
  const openModalForExistingEvent = useCallback((event) => {
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

  const handleSaveEvent = useCallback((event) => {
    if (event.id) {
      dispatch({ type: 'UPDATE', payload: event });
    } else {
      dispatch({ type: 'ADD', payload: { ...event, id: Date.now().toString() } });
    }
    closeModal();
  }, [closeModal]);

  const handleEventUpdate = useCallback((event) => {
    const originalId = event.id.split('-')[0];
    const originalEvent = events.find(e => e.id === originalId);

    if (originalEvent && originalEvent.recurrence) {
      // If a recurring event instance is dragged, update the start date of the whole series
      const updatedSeries = { ...originalEvent, date: event.date };
       dispatch({ type: 'UPDATE', payload: updatedSeries });
    } else {
      dispatch({ type: 'UPDATE', payload: event });
    }
  }, [events]);

  const handleDeleteEvent = useCallback((id) => {
    dispatch({ type: 'DELETE', payload: id });
    closeModal();
  }, [closeModal]);
  
  const visibleEvents = useMemo(() => {
    let viewStartDate;
    let viewEndDate;

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

    const expandedEvents = [];
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
