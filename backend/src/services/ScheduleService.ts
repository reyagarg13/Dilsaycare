import { ScheduleModel } from '../models/ScheduleModel';
import { ScheduleExceptionModel } from '../models/ScheduleExceptionModel';
import { SlotResponse, CreateSlotRequest, UpdateSlotRequest } from '../types';
import { 
  startOfWeek, 
  addDays, 
  format, 
  parseISO, 
  getDay, 
  isValid,
  isBefore,
  parse
} from 'date-fns';

export class ScheduleService {
  // Get slots for a specific week
  static async getSlotsForWeek(weekStartDate: string): Promise<SlotResponse[]> {
    const startDate = parseISO(weekStartDate);
    if (!isValid(startDate)) {
      throw new Error('Invalid date format');
    }

    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 }); // Sunday = 0
    const weekDates: SlotResponse[] = [];

    // Generate 7 days of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(weekStart, i);
      const dateString = format(currentDate, 'yyyy-MM-dd');
      const dayOfWeek = getDay(currentDate);

      // Get base schedules for this day
      const schedules = await ScheduleModel.getSchedulesByDay(dayOfWeek);
      
      // Get exceptions for this date
      const exceptions = await ScheduleExceptionModel.getExceptionsForDateRange(dateString, dateString);
      
      const slots = [];

      // Process base schedules
      for (const schedule of schedules) {
        const exception = exceptions.find(e => e.schedule_id === schedule.id);
        
        if (exception) {
          if (exception.exception_type === 'modified') {
            // Use exception times
            slots.push({
              id: schedule.id,
              start_time: exception.start_time!,
              end_time: exception.end_time!,
              is_exception: true,
              schedule_id: schedule.id,
              exception_id: exception.id,
            });
          }
          // If deleted, don't add to slots
        } else {
          // Use base schedule times
          slots.push({
            id: schedule.id,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            is_exception: false,
            schedule_id: schedule.id,
          });
        }
      }

      weekDates.push({
        date: dateString,
        slots: slots.sort((a, b) => a.start_time.localeCompare(b.start_time)),
      });
    }

    return weekDates;
  }

  // Create a new recurring slot
  static async createSlot(data: CreateSlotRequest): Promise<any> {
    // Validate time format
    if (!this.isValidTimeFormat(data.start_time) || !this.isValidTimeFormat(data.end_time)) {
      throw new Error('Invalid time format. Use HH:MM format.');
    }

    // Validate time logic
    if (!this.isValidTimeRange(data.start_time, data.end_time)) {
      throw new Error('Start time must be before end time.');
    }

    // Check for conflicts
    const hasConflict = await ScheduleModel.checkTimeConflict(
      data.day_of_week,
      data.start_time,
      data.end_time
    );

    if (hasConflict) {
      throw new Error('Time slot conflicts with existing schedule.');
    }

    // Check slot limit per day
    const currentSlotCount = await this.countSlotsForDay(data.day_of_week);
    if (currentSlotCount >= 2) {
      throw new Error('Maximum 2 slots allowed per day.');
    }

    return ScheduleModel.createSchedule(data);
  }

  // Update a specific slot for a specific date (creates exception)
  static async updateSlotForDate(
    scheduleId: number,
    date: string,
    data: UpdateSlotRequest
  ): Promise<any> {
    // Validate date
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date format');
    }

    // Validate time format
    if (!this.isValidTimeFormat(data.start_time) || !this.isValidTimeFormat(data.end_time)) {
      throw new Error('Invalid time format. Use HH:MM format.');
    }

    // Validate time logic
    if (!this.isValidTimeRange(data.start_time, data.end_time)) {
      throw new Error('Start time must be before end time.');
    }

    // Check if schedule exists
    const schedule = await ScheduleModel.getScheduleById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check for time conflicts with other exceptions on the same date
    const hasConflict = await ScheduleExceptionModel.checkExceptionTimeConflict(
      date,
      data.start_time,
      data.end_time,
      scheduleId
    );

    if (hasConflict) {
      throw new Error('Time slot conflicts with existing schedule on this date.');
    }

    // Check if exception already exists
    const existingException = await ScheduleExceptionModel.getException(scheduleId, date);
    
    if (existingException) {
      // Update existing exception
      return ScheduleExceptionModel.updateException(
        scheduleId,
        date,
        data.start_time,
        data.end_time
      );
    } else {
      // Create new exception
      return ScheduleExceptionModel.createException(
        scheduleId,
        date,
        'modified',
        data.start_time,
        data.end_time
      );
    }
  }

  // Delete a slot for a specific date (creates deletion exception)
  static async deleteSlotForDate(scheduleId: number, date: string): Promise<void> {
    // Validate date
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      throw new Error('Invalid date format');
    }

    // Check if schedule exists
    const schedule = await ScheduleModel.getScheduleById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    // Check if exception already exists
    const existingException = await ScheduleExceptionModel.getException(scheduleId, date);
    
    if (existingException) {
      if (existingException.exception_type === 'deleted') {
        throw new Error('Slot is already deleted for this date');
      }
      // Update existing exception to deleted
      await ScheduleExceptionModel.createException(
        scheduleId,
        date,
        'deleted'
      );
    } else {
      // Create new deletion exception
      await ScheduleExceptionModel.createException(
        scheduleId,
        date,
        'deleted'
      );
    }
  }

  // Delete entire recurring schedule
  static async deleteSchedule(scheduleId: number): Promise<void> {
    const schedule = await ScheduleModel.getScheduleById(scheduleId);
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    await ScheduleModel.deleteSchedule(scheduleId);
  }

  // Helper methods
  private static isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  private static isValidTimeRange(startTime: string, endTime: string): boolean {
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    return isBefore(start, end);
  }

  private static async countSlotsForDay(dayOfWeek: number): Promise<number> {
    const schedules = await ScheduleModel.getSchedulesByDay(dayOfWeek);
    return schedules.length;
  }
}