// A simple date utility library to avoid a full dependency.

export function getYear(date) {
  return date.getFullYear();
}

export function getMonth(date) {
  return date.getMonth();
}

export function addMonths(date, amount) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
}

export function subMonths(date, amount) {
  return addMonths(date, -amount);
}

export function addWeeks(date, amount) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount * 7);
  return newDate;
}

export function subWeeks(date, amount) {
  return addWeeks(date, -amount);
}

export function addDays(date, amount) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + amount);
    return newDate;
}

export function subDays(date, amount) {
    return addDays(date, -amount);
}

export function setMonth(date, month) {
  const newDate = new Date(date);
  newDate.setMonth(month);
  return newDate;
}

export function setYear(date, year) {
  const newDate = new Date(date);
  newDate.setFullYear(year);
  return newDate;
}

export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function parseISO(dateString) {
    // This is a simplified ISO parser that works for YYYY-MM-DD
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // month is 0-indexed in JS Date
    const day = parseInt(parts[2], 10);
    
    // To handle timezone issues, create the date in UTC
    return new Date(Date.UTC(year, month, day));
}


export function getHours(date) {
  return date.getHours();
}

export function getMinutes(date) {
  return date.getMinutes();
}

export function format(date, formatStr) {
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
