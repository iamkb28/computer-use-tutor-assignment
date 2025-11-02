
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../types';
import { format } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
  event: CalendarEvent | null;
  date: Date | null;
}

const colors: Array<CalendarEvent['color']> = ['blue', 'green', 'indigo', 'purple', 'orange', 'red'];

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, event, date }) => {
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setEventDate(event.date);
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setColor(event.color);
    } else if (date) {
      setTitle('');
      setEventDate(format(date, 'yyyy-MM-dd'));
      const startHour = date.getHours().toString().padStart(2, '0');
      const endHour = (date.getHours() + 1).toString().padStart(2, '0');
      setStartTime(`${startHour}:00`);
      setEndTime(`${endHour}:00`);
      setColor('blue');
    }
  }, [event, date, isOpen]);

  const handleSave = () => {
    onSave({
      id: event?.id,
      title,
      date: eventDate,
      startTime,
      endTime,
      color,
    });
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">{event ? 'Edit event' : 'Add event'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            className="w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none text-xl py-2"
          />
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
            <span>-</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button onClick={() => setShowColorPicker(!showColorPicker)}
                className={`w-6 h-6 rounded-full bg-${color}-500 focus:outline-none`}
              ></button>
              {showColorPicker && (
                <div className="absolute top-8 left-0 bg-white shadow-lg rounded-md p-2 flex space-x-1 z-10">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => { setColor(c); setShowColorPicker(false); }}
                      className={`w-6 h-6 rounded-full bg-${c}-500 hover:ring-2 ring-offset-1 ring-${c}-500`}
                    />
                  ))}
                </div>
              )}
            </div>
            <span className="capitalize">{color}</span>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end items-center space-x-4">
          {event && (
            <button onClick={handleDelete} className="text-red-600 hover:text-red-800 font-medium">
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={!title || !eventDate}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
