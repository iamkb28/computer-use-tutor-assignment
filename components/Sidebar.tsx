
import React from 'react';
import MiniCalendar from './MiniCalendar';

interface SidebarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onNewEventClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentDate, onDateChange, onNewEventClick }) => {
  return (
    <aside className="w-64 p-4 border-r border-gray-200 flex flex-col space-y-4">
      <button onClick={onNewEventClick} className="flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 p-3 w-max">
        <svg className="w-6 h-6 text-blue-500" viewBox="0 0 36 36">
          <path fill="#34A853" d="M16 16v14h4V20z"></path>
          <path fill="#4285F4" d="M30 16H20l-4 4h14z"></path>
          <path fill="#FBBC05" d="M6 16v4h10l4-4z"></path>
          <path fill="#EA4335" d="M20 16V6h-4v14z"></path>
          <path fill="none" d="M0 0h36v36H0z"></path>
        </svg>
        <span className="ml-3 text-sm font-medium text-gray-600 pr-4">Create</span>
      </button>
      <MiniCalendar selectedDate={currentDate} onDateSelect={onDateChange} />
    </aside>
  );
};

export default Sidebar;
