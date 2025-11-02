import React, { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar.js';
import { isSameDay, getMonth, format } from '../utils/dateUtils.js';

const colorClasses = {
  red: 'bg-red-200 border-red-500 text-red-800',
  blue: 'bg-blue-200 border-blue-500 text-blue-800',
  green: 'bg-green-200 border-green-500 text-green-800',
  indigo: 'bg-indigo-200 border-indigo-500 text-indigo-800',
  purple: 'bg-purple-200 border-purple-500 text-purple-800',
  orange: 'bg-orange-200 border-orange-500 text-orange-800',
};

const MonthView = ({ currentDate, events, onEventClick, onCellClick, onEventUpdate }) => {
  const { calendarWeeks, daysOfWeek } = useCalendar(currentDate, 'month');
  const today = new Date();
  const [draggedEventId, setDraggedEventId] = useState(null);

  const handleDragStart = (e, event) => {
    e.dataTransfer.setData('eventId', event.id);
    setDraggedEventId(event.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('eventId');
    const eventToUpdate = events.find(ev => ev.id === eventId);

    if (eventToUpdate) {
      const updatedEvent = {
        ...eventToUpdate,
        date: format(day, 'yyyy-MM-dd'),
      };
      onEventUpdate(updatedEvent);
    }
    setDraggedEventId(null);
  };

  const handleDragEnd = () => {
    setDraggedEventId(null);
  };

  return (
    <div className="flex flex-col flex-grow">
      <div className="grid grid-cols-7 border-b border-l border-gray-200">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 flex-grow border-l border-gray-200">
        {calendarWeeks.flat().map((day, index) => {
          const isCurrentMonth = getMonth(day) === getMonth(currentDate);
          const isToday = isSameDay(day, today);
          const dayEvents = events.filter(e => isSameDay(new Date(e.date), day));
          
          return (
            <div
              key={index}
              className={`relative border-r border-b border-gray-200 p-1 min-h-[120px] ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
              onClick={(e) => {
                if(e.target === e.currentTarget) onCellClick(day);
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <span
                className={`flex items-center justify-center h-7 w-7 text-sm rounded-full ${
                  isToday ? 'bg-blue-600 text-white' : ''
                } ${isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onEventClick(event)}
                    className={`text-xs p-1 rounded border-l-4 truncate ${draggedEventId === event.id ? 'opacity-50 cursor-grabbing' : 'cursor-pointer'} ${colorClasses[event.color]}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                   <div className="text-xs text-gray-500 cursor-pointer">{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
