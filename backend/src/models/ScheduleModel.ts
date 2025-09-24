import db from '../database/connection';
import { Schedule, ScheduleException, CreateSlotRequest, UpdateSlotRequest } from '../types';
import { startOfWeek, addDays, format, parseISO, getDay } from 'date-fns';

export class ScheduleModel {
  // Create a new recurring schedule
  static async createSchedule(data: CreateSlotRequest): Promise<Schedule> {
    const [schedule] = await db('schedules')
      .insert({
        day_of_week: data.day_of_week,
        start_time: data.start_time,
        end_time: data.end_time,
        is_active: true,
      })
      .returning('*');
    
    return schedule;
  }

  // Get all active schedules
  static async getAllSchedules(): Promise<Schedule[]> {
    return db('schedules')
      .where('is_active', true)
      .orderBy(['day_of_week', 'start_time']);
  }

  // Get schedules for a specific day of week
  static async getSchedulesByDay(dayOfWeek: number): Promise<Schedule[]> {
    return db('schedules')
      .where({
        day_of_week: dayOfWeek,
        is_active: true,
      })
      .orderBy('start_time');
  }

  // Update a schedule (deactivate old, create new)
  static async updateSchedule(id: number, data: CreateSlotRequest): Promise<Schedule> {
    // Deactivate the old schedule
    await db('schedules')
      .where('id', id)
      .update({ is_active: false });

    // Create new schedule
    return this.createSchedule(data);
  }

  // Delete a schedule (set inactive)
  static async deleteSchedule(id: number): Promise<void> {
    await db('schedules')
      .where('id', id)
      .update({ is_active: false });
  }

  // Get schedule by ID
  static async getScheduleById(id: number): Promise<Schedule | undefined> {
    return db('schedules')
      .where('id', id)
      .first();
  }

  // Check for time conflicts
  static async checkTimeConflict(
    dayOfWeek: number, 
    startTime: string, 
    endTime: string, 
    excludeId?: number
  ): Promise<boolean> {
    const query = db('schedules')
      .where({
        day_of_week: dayOfWeek,
        is_active: true,
      })
      .where(function() {
        this.where(function() {
          // New slot starts before existing ends and ends after existing starts
          this.where('start_time', '<', endTime)
              .andWhere('end_time', '>', startTime);
        });
      });

    if (excludeId) {
      query.whereNot('id', excludeId);
    }

    const conflicts = await query;
    return conflicts.length > 0;
  }

  // Count slots for a specific day and date
  static async countSlotsForDate(date: string): Promise<number> {
    const dayOfWeek = getDay(parseISO(date));
    
    // Count active schedules for this day
    const scheduleCount = await db('schedules')
      .where({
        day_of_week: dayOfWeek,
        is_active: true,
      })
      .count('id as count')
      .first();

    // Count exceptions for this date
    const deletedExceptions = await db('schedule_exceptions')
      .where({
        exception_date: date,
        exception_type: 'deleted',
      })
      .count('id as count')
      .first();

    const modifiedExceptions = await db('schedule_exceptions')
      .where({
        exception_date: date,
        exception_type: 'modified',
      })
      .count('id as count')
      .first();

    const totalSchedules = parseInt(scheduleCount?.count as string || '0');
    const totalDeleted = parseInt(deletedExceptions?.count as string || '0');
    const totalModified = parseInt(modifiedExceptions?.count as string || '0');

    return totalSchedules - totalDeleted + totalModified;
  }
}