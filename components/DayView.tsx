import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { isSameDay, format, parseISO } from '../utils/dateUtils';

interface DayViewProps {
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

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onEventClick, onCellClick, onEventUpdate }) => {
  const today = new Date();
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const dayEvents = events.filter(e => isSameDay(parseISO(e.date), currentDate));
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const HOUR_HEIGHT = 60; // 60px per hour

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
      date: format(currentDate, 'yyyy-MM-dd'),
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
      <div className="flex-grow grid grid-cols-[auto_1fr]">
        {/* Time column */}
        <div className="w-16">
          {timeSlots.map(time => (
            <div key={time} className="h-[60px] text-right pr-2 text-xs text-gray-400 border-r border-gray-200 relative -top-2">
              {time}
            </div>
          ))}
        </div>
        {/* Day column */}
        <div 
          className="relative border-r border-gray-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {timeSlots.map((_, index) => (
            <div key={index} className="h-[60px] border-b border-gray-200"
              onClick={() => {
                const clickedDate = new Date(currentDate);
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
                className={`absolute left-2 right-2 p-2 rounded border-l-4 ${draggedEvent?.id === event.id ? 'opacity-50 cursor-grabbing' : 'cursor-pointer'} ${color.bg} ${color.border} ${color.text}`}
                style={{ top: `${top}px`, height: `${height}px`, zIndex: 10 }}
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm">{event.startTime} - {event.endTime}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;