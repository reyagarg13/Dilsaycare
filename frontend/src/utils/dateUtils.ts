import { 
  startOfWeek, 
  addDays, 
  format, 
  parseISO, 
  addWeeks, 
  subWeeks,
  getDay,
  isToday,
  isSameDay,
  parse
} from 'date-fns';
import type { WeekData, DaySlots } from '../types';

// Get the start of the week (Sunday)
export const getWeekStart = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return startOfWeek(dateObj, { weekStartsOn: 0 }); // Sunday = 0
};

// Generate week data structure with all 7 days
export const generateWeekData = (weekStartDate: Date | string): WeekData => {
  const startDate = getWeekStart(weekStartDate);
  const endDate = addDays(startDate, 6);
  
  const days: DaySlots[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    days.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      slots: [],
    });
  }
  
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(endDate, 'yyyy-MM-dd'),
    days,
  };
};

// Get next week's start date
export const getNextWeek = (currentWeekStart: string): string => {
  const date = parseISO(currentWeekStart);
  const nextWeek = addWeeks(date, 1);
  return format(nextWeek, 'yyyy-MM-dd');
};

// Get previous week's start date
export const getPreviousWeek = (currentWeekStart: string): string => {
  const date = parseISO(currentWeekStart);
  const prevWeek = subWeeks(date, 1);
  return format(prevWeek, 'yyyy-MM-dd');
};

// Format date for display (e.g., "Mon, 15")
export const formatDateForDisplay = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'EEE, d');
};

// Format date for header (e.g., "January 15-21, 2024")
export const formatWeekRange = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  const startMonth = format(start, 'MMMM');
  const endMonth = format(end, 'MMMM');
  const year = format(start, 'yyyy');
  
  if (startMonth === endMonth) {
    return `${startMonth} ${format(start, 'd')}-${format(end, 'd')}, ${year}`;
  } else {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}, ${year}`;
  }
};

// Get day of week index (0 = Sunday)
export const getDayOfWeek = (dateString: string): number => {
  const date = parseISO(dateString);
  return getDay(date);
};

// Check if date is today
export const isDateToday = (dateString: string): boolean => {
  const date = parseISO(dateString);
  return isToday(date);
};

// Check if two dates are the same day
export const isSameDate = (date1: string, date2: string): boolean => {
  const d1 = parseISO(date1);
  const d2 = parseISO(date2);
  return isSameDay(d1, d2);
};

// Validate time format (HH:MM)
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Parse time string to Date object for comparison
export const parseTime = (timeString: string): Date => {
  return parse(timeString, 'HH:mm', new Date());
};

// Check if start time is before end time
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
    return false;
  }
  
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  
  return start < end;
};

// Format time for display (e.g., "9:00 AM")
export const formatTimeForDisplay = (timeString: string): string => {
  if (!isValidTimeFormat(timeString)) {
    return timeString;
  }
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  
  return format(date, 'h:mm a');
};

// Get current week start date
export const getCurrentWeekStart = (): string => {
  return format(getWeekStart(new Date()), 'yyyy-MM-dd');
};

// Convert 12-hour time to 24-hour format
export const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours.padStart(2, '0')}:${minutes}`;
};

// Generate time options for dropdowns (30-minute intervals)
export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  
  return times;
};

// Get week days array with formatted dates
export const getWeekDays = (weekStart?: string): string[] => {
  const startDate = weekStart ? parseISO(weekStart) : getWeekStart(new Date());
  const days: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    days.push(format(currentDate, 'MMM d'));
  }
  
  return days;
};

// General date formatter
export const formatDate = (date: Date | string, formatString: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};