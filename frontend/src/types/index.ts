export interface Slot {
  id: number;
  start_time: string;
  end_time: string;
  is_exception: boolean;
  schedule_id?: number;
  exception_id?: number;
}

export interface DaySlots {
  date: string; // YYYY-MM-DD format
  slots: Slot[];
}

export interface CreateSlotRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpdateSlotRequest {
  start_time: string;
  end_time: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
  };
}

export interface WeekData {
  startDate: string;
  endDate: string;
  days: DaySlots[];
}

export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export const DAY_NAMES: DayOfWeek[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const DAY_INDICES = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};