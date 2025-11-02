import { useMemo } from 'react';
import { getMonth, getYear } from '../utils/dateUtils.js';

export const useCalendar = (currentDate, view) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthData = useMemo(() => {
    const year = getYear(currentDate);
    const month = getMonth(currentDate);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDayOfMonth);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }

    const calendarDays = [];
    let currentDatePointer = new Date(startDate);

    while (currentDatePointer <= endDate) {
      calendarDays.push(new Date(currentDatePointer));
      currentDatePointer.setDate(currentDatePointer.getDate() + 1);
    }

    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }
    
    return { calendarWeeks };
  }, [currentDate]);


  const weekData = useMemo(() => {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const weekDays = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(startOfWeek);
          day.setDate(day.getDate() + i);
          return day;
      });
      return { weekDays };
  }, [currentDate]);


  if (view === 'month') {
    return { ...monthData, daysOfWeek };
  }

  if (view === 'week') {
    return { ...weekData, daysOfWeek };
  }
  
  return { calendarWeeks: [], weekDays: [], daysOfWeek };
};
