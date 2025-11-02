
import React, { useState, useMemo } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { format, isSameDay, getMonth, getYear, addMonths, subMonths } from '../utils/dateUtils';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [displayDate, setDisplayDate] = useState(selectedDate);
  const { calendarWeeks, daysOfWeek } = useCalendar(displayDate, 'month');

  const handlePrevMonth = () => setDisplayDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setDisplayDate(prev => addMonths(prev, 1));
  
  const today = new Date();

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{format(displayDate, 'MMMM yyyy')}</h3>
        <div>
          <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500">
        {daysOfWeek.map(day => <div key={day}>{day.charAt(0)}</div>)}
      </div>
      <div className="grid grid-cols-7 mt-1">
        {calendarWeeks.flat().map((day, index) => {
          const isCurrentMonth = getMonth(day) === getMonth(displayDate);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          
          let className = 'text-center text-xs p-1 rounded-full cursor-pointer hover:bg-gray-100';
          if (!isCurrentMonth) className += ' text-gray-300';
          if (isSelected) className += ' bg-blue-100 text-blue-600 font-bold';
          if (isToday) className += ' bg-blue-500 text-white';

          return (
            <div key={index} onClick={() => onDateSelect(day)} className={className}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
