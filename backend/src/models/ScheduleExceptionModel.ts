import db from '../database/connection';
import { ScheduleException, UpdateSlotRequest } from '../types';

export class ScheduleExceptionModel {
  // Create a new exception (modification or deletion)
  static async createException(
    scheduleId: number,
    date: string,
    type: 'modified' | 'deleted',
    startTime?: string,
    endTime?: string
  ): Promise<ScheduleException> {
    const [exception] = await db('schedule_exceptions')
      .insert({
        schedule_id: scheduleId,
        exception_date: date,
        exception_type: type,
        start_time: startTime || null,
        end_time: endTime || null,
      })
      .returning('*');
    
    return exception;
  }

  // Get exception for a specific schedule and date
  static async getException(scheduleId: number, date: string): Promise<ScheduleException | undefined> {
    return db('schedule_exceptions')
      .where({
        schedule_id: scheduleId,
        exception_date: date,
      })
      .first();
  }

  // Get all exceptions for a date range
  static async getExceptionsForDateRange(startDate: string, endDate: string): Promise<ScheduleException[]> {
    return db('schedule_exceptions')
      .whereBetween('exception_date', [startDate, endDate])
      .orderBy('exception_date');
  }

  // Update an exception
  static async updateException(
    scheduleId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<ScheduleException> {
    const [exception] = await db('schedule_exceptions')
      .where({
        schedule_id: scheduleId,
        exception_date: date,
      })
      .update({
        exception_type: 'modified',
        start_time: startTime,
        end_time: endTime,
        updated_at: new Date(),
      })
      .returning('*');
    
    return exception;
  }

  // Delete an exception (remove the exception, reverting to original schedule)
  static async deleteException(scheduleId: number, date: string): Promise<void> {
    await db('schedule_exceptions')
      .where({
        schedule_id: scheduleId,
        exception_date: date,
      })
      .del();
  }

  // Check if exception exists
  static async exceptionExists(scheduleId: number, date: string): Promise<boolean> {
    const exception = await this.getException(scheduleId, date);
    return !!exception;
  }

  // Get exceptions by schedule ID
  static async getExceptionsByScheduleId(scheduleId: number): Promise<ScheduleException[]> {
    return db('schedule_exceptions')
      .where('schedule_id', scheduleId)
      .orderBy('exception_date');
  }

  // Check for time conflicts with exceptions on the same date
  static async checkExceptionTimeConflict(
    date: string,
    startTime: string,
    endTime: string,
    excludeScheduleId?: number
  ): Promise<boolean> {
    const query = db('schedule_exceptions')
      .where({
        exception_date: date,
        exception_type: 'modified',
      })
      .where(function() {
        this.where(function() {
          // New slot starts before existing ends and ends after existing starts
          this.where('start_time', '<', endTime)
              .andWhere('end_time', '>', startTime);
        });
      });

    if (excludeScheduleId) {
      query.whereNot('schedule_id', excludeScheduleId);
    }

    const conflicts = await query;
    return conflicts.length > 0;
  }
}