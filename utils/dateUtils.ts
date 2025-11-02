
// A simple date utility library to avoid a full dependency.

export function getYear(date: Date): number {
  return date.getFullYear();
}

export function getMonth(date: Date): number {
  return date.getMonth();
}

export function addMonths(date: Date, amount: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
}

export function subMonths(date: Date, amount: number): Date {
  return addMonths(date, -amount);
}

export function addWeeks(date: Date, amount: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount * 7);
  return newDate;
}

export function subWeeks(date: Date, amount: number): Date {
  return addWeeks(date, -amount);
}

export function addDays(date: Date, amount: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
}

export function subDays(date: Date, amount: number): Date {
    return addDays(date, -amount);
}

export function setMonth(date: Date, month: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(month);
  return newDate;
}

export function setYear(date: Date, year: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(year);
  return newDate;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function parseISO(dateString: string): Date {
    // This is a simplified ISO parser that works for YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    // Note: month is 0-indexed in JS Date
    return new Date(year, month - 1, day);
}

export function getHours(date: Date): number {
  return date.getHours();
}

export function getMinutes(date: Date): number {
  return date.getMinutes();
}

export function format(date: Date, formatStr: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthShortNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return formatStr
    .replace(/yyyy/g, String(year))
    .replace(/MMMM/g, monthNames[month])
    .replace(/MMM/g, monthShortNames[month])
    .replace(/MM/g, String(month + 1).padStart(2, '0'))
    .replace(/dd/g, String(day).padStart(2, '0'))
    .replace(/d/g, String(day))
    .replace(/EEEE/g, dayNames[dayOfWeek])
    .replace(/EEE/g, dayShortNames[dayOfWeek]);
}
