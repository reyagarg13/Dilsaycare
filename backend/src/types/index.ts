export interface Schedule {
  id: number;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ScheduleException {
  id: number;
  schedule_id: number;
  exception_date: Date;
  start_time?: string; // null if deleted, modified time if updated
  end_time?: string; // null if deleted, modified time if updated
  exception_type: 'modified' | 'deleted';
  created_at: Date;
}

export interface SlotResponse {
  date: string; // YYYY-MM-DD format
  slots: Array<{
    id: number;
    start_time: string;
    end_time: string;
    is_exception: boolean;
    schedule_id?: number;
    exception_id?: number;
  }>;
}

export interface CreateSlotRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface UpdateSlotRequest {
  date: string;
  start_time: string;
  end_time: string;
}