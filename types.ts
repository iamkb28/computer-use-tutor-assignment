
export type CalendarView = 'month' | 'week' | 'day';

export type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'annually';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format, serves as the start date for recurring events
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  color: 'red' | 'blue' | 'green' | 'indigo' | 'purple' | 'orange';
  recurrence?: RecurrenceFrequency;
}
