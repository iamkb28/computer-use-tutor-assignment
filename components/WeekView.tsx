import React, { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { CalendarEvent } from '../types';
import { isSameDay, format, parseISO, getHours, getMinutes } from '../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCellClick: (date: Date) => void;
  onEventUpdate: (event: CalendarEvent) => void;
}

const colorClasses = {
  red: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800' },
  green: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
  indigo: { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-800' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-800' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-800' },
};


const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onEventClick, onCellClick, onEventUpdate }) => {
  const { weekDays } = useCalendar(currentDate, 'week');
  const today = new Date();
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const HOUR_HEIGHT = 48; // 48px per hour

  const getEventPosition = (event: CalendarEvent) => {
    const [startHour, startMinute] = event.startTime.split(':').map(Number);
    const [endHour, endMinute] = event.endTime.split(':').map(Number);
    const top = (startHour + startMinute / 60) * HOUR_HEIGHT;
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const height = (duration / 60) * HOUR_HEIGHT;
    return { top, height };
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, event: CalendarEvent) => {
    e.dataTransfer.setData('eventId', event.id);
    setDraggedEvent(event);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    if (!draggedEvent) return;

    const [startH, startM] = draggedEvent.startTime.split(':').map(Number);
    const [endH, endM] = draggedEvent.endTime.split(':').map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    const rect = e.currentTarget.getBoundingClientRect();
    const dropY = e.clientY - rect.top;

    const totalMinutes = (dropY / HOUR_HEIGHT) * 60;
    const snappedMinutes = Math.round(totalMinutes / 15) * 15;
    const newStartHour = Math.floor(snappedMinutes / 60);
    const newStartMinute = snappedMinutes % 60;

    const newEndTotalMinutes = snappedMinutes + durationMinutes;
    const newEndHour = Math.floor(newEndTotalMinutes / 60);
    const newEndMinute = newEndTotalMinutes % 60;

    if (newEndHour > 24 || (newEndHour === 24 && newEndMinute > 0)) return;

    const updatedEvent: CalendarEvent = {
      ...draggedEvent,
      date: format(day, 'yyyy-MM-dd'),
      startTime: `${String(newStartHour).padStart(2, '0')}:${String(newStartMinute).padStart(2, '0')}`,
      endTime: `${String(newEndHour).padStart(2, '0')}:${String(newEndMinute).padStart(2, '0')}`,
    };

    onEventUpdate(updatedEvent);
    setDraggedEvent(null);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="grid grid-cols-[auto_1fr] sticky top-0 bg-white z-[5]">
        <div className="w-16 border-r border-b border-gray-200"></div>
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-2 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-xs text-gray-500 uppercase">{format(day, 'EEE')}</div>
              <div className={`text-2xl mt-1 ${isSameDay(day, today) ? 'text-blue-600' : ''}`}>{day.getDate()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow grid grid-cols-[auto_1fr]">
        {/* Time column */}
        <div className="w-16">
          {timeSlots.map(time => (
            <div key={time} className="h-12 text-right pr-2 text-xs text-gray-400 border-r border-gray-200 relative -top-2">
              {time}
            </div>
          ))}
        </div>
        {/* Days columns */}
        <div className="grid grid-cols-7 flex-grow">
          {weekDays.map(day => {
            const dayEvents = events.filter(e => isSameDay(parseISO(e.date), day));
            return (
              <div 
                key={day.toISOString()} 
                className="relative border-r border-gray-200 last:border-r-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
              >
                 {timeSlots.map((_, index) => (
                    <div 
                        key={index} 
                        className="h-12 border-b border-gray-200"
                        onClick={() => {
                            const clickedDate = new Date(day);
                            clickedDate.setHours(index, 0, 0, 0);
                            onCellClick(clickedDate);
                        }}
                    ></div>
                 ))}
                {dayEvents.map(event => {
                  const { top, height } = getEventPosition(event);
                  const color = colorClasses[event.color];
                  return (
                    <div
                      key={event.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, event)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onEventClick(event)}
                      className={`absolute left-1 right-1 p-1 rounded border-l-4 ${draggedEvent?.id === event.id ? 'opacity-50 cursor-grabbing' : 'cursor-pointer'} ${color.bg} ${color.border} ${color.text}`}
                      style={{ top: `${top}px`, height: `${height}px`, zIndex: 10 }}
                    >
                      <p className="font-semibold text-xs">{event.title}</p>
                      <p className="text-xs">{event.startTime} - {event.endTime}</p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;