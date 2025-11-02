import React from 'react';
import { CalendarView } from '../types';
import { format } from '../utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleSidebar: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onToggleSidebar,
}) => {
  const formattedDate = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${format(startOfWeek, 'MMMM d')} – ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
        }
        return `${format(startOfWeek, 'MMM d')} – ${format(endOfWeek, 'MMM d, yyyy')}`;
      case 'day':
        return format(currentDate, 'MMMM d, yyyy');
      default:
        return '';
    }
  };

  const calendarIconDataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrElEQVR42u2Zz0tUYRTHP/85O64jQk1EhBDRRkVRFAlpEBsttFDQSkk3LbWoqIs2Uf/An6CVQpCCLrcFIdpFhGghIlqEih5vo3tmFnrwztxz3o9z5s75A8+559573u8P73u/dwBw/pHDwGDAATAS2AJ2gAPgG/gEnAGPCl4c4aPAAXAIeA20gBtgl6b6S7ADfEzw7g74C7gCTgN9YDEo9sV3gDHgQcCXDvAJfAJeAFeAn0CBL/Aq8CfwDPgBfPZGHwY+BZ4AATYBHwPvA1uB/yABnsEHoA1YBvwH3AGfge+A/2ACjsEfoG0L4SfwGvgE/AJuAy+Bl+B74BvwnY9zC3wFvCzwDbgFfAbeB/4I/A2ci5wEXgIPA08Cb8GXgY/B14D/gL3A/sCpwL7AbcD+z/7Av8GRwO/A/uAswO/Ac4D/gZOA3wGnAb8DlwO/A+8D/gdfBv4OvA58Hfga+DPwNfBj4MvAl4GXgZeBl4F/gEcBf4EHgUeAnwGPAU8DnwJPAb8BrgG/Aa8D/wFfAj8BvwZfA78Bvwa/AV8GvgY+DV4GvgZeBk4DPgZOA54EngI+A+4B1gDngN/BJ4CfgTeA5zC3gV8Db0D4C3gL+A2g6u4r/A5sAmL/An8LPA2sBLoBO8FXgK/AE2Aj8ADgL8DtwF+AB0BfwA/AFwF/AH8AvwBfAX8AfwD/AD8AP8Dfgv+ANwD/AX8D/gS+Af4K/AR8A/wF/Br4Bvgn+A74BvgG+Cr4CvgK+Cf4A/gp+An4E/gp+BP4KfgT+DP4C/gL+BX4C/gX+C34Lfgd+F34Hfg9+A74Hvh+Ab/DfwJ3D/0P1A/8AnwJ/AF8BfwDfA/8G1wbY2+Bm4H/gI+Ab4L/gR+B64A7gf9vT8C/B74M/AZ8/gjwKPAI8GvgeuAp8A7wD/AF8Engk8DTwHPAU8DLwGXgS8CnwB/A/cAZ/AM4O8uACvAbcD/wMHA7cA/wGPAw8D/b05+Am4A/ga+Av4AfgV+B74Cfg/8Cvwa/Cb8DvwOfBj8BvwM/Ab8DvwY/A78D/wA/Bn8D3wA/AT8AvgM+BP4EfgL+BD4E/gb+A/4B/gf0P8A3s/4/3f+B8j+A8A/kP4Dwq+fzP/B5f/AdcAAAAASUVORK5CYII=";

  return (
    <header className="flex items-center justify-between p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <img src={calendarIconDataUri} alt="Calendar Logo" className="w-8 h-8 ml-2" />
        <span className="text-xl text-gray-500 ml-2">Calendar</span>
        <button onClick={onToday} className="ml-6 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">
          Today
        </button>
        <div className="flex items-center ml-2">
          <button onClick={onPrev} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <button onClick={onNext} className="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
        <h2 className="text-xl text-gray-500 ml-4">{formattedDate()}</h2>
      </div>
      <div className="relative">
        <select
          value={view}
          onChange={(e) => onViewChange(e.target.value as CalendarView)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 appearance-none bg-white pr-8"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader;
