import { Request, Response } from 'express';
import { ScheduleService } from '../services/ScheduleService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { CreateSlotRequest, UpdateSlotRequest } from '../types';

export class ScheduleController {
  // GET /api/slots/week/:date
  static getSlotsForWeek = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.params;
    
    if (!date) {
      throw createError('Date parameter is required', 400);
    }
    
    const slots = await ScheduleService.getSlotsForWeek(date);
    
    res.json({
      success: true,
      data: slots,
    });
  });

  // POST /api/slots
  static createSlot = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateSlotRequest = req.body;
    
    const schedule = await ScheduleService.createSlot(data);
    
    res.status(201).json({
      success: true,
      data: schedule,
      message: 'Recurring slot created successfully',
    });
  });

  // PUT /api/slots/:id/date/:date
  static updateSlotForDate = asyncHandler(async (req: Request, res: Response) => {
    const { id, date } = req.params;
    
    if (!id || !date) {
      throw createError('Schedule ID and date parameters are required', 400);
    }
    
    const data: UpdateSlotRequest = {
      date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    };
    
    const scheduleId = parseInt(id);
    if (isNaN(scheduleId)) {
      throw createError('Invalid schedule ID', 400);
    }
    
    const exception = await ScheduleService.updateSlotForDate(scheduleId, date, data);
    
    res.json({
      success: true,
      data: exception,
      message: 'Slot updated for specific date',
    });
  });

  // DELETE /api/slots/:id/date/:date
  static deleteSlotForDate = asyncHandler(async (req: Request, res: Response) => {
    const { id, date } = req.params;
    
    if (!id || !date) {
      throw createError('Schedule ID and date parameters are required', 400);
    }
    
    const scheduleId = parseInt(id);
    if (isNaN(scheduleId)) {
      throw createError('Invalid schedule ID', 400);
    }
    
    await ScheduleService.deleteSlotForDate(scheduleId, date);
    
    res.json({
      success: true,
      message: 'Slot deleted for specific date',
    });
  });

  // DELETE /api/slots/:id
  static deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      throw createError('Schedule ID parameter is required', 400);
    }
    
    const scheduleId = parseInt(id);
    if (isNaN(scheduleId)) {
      throw createError('Invalid schedule ID', 400);
    }
    
    await ScheduleService.deleteSchedule(scheduleId);
    
    res.json({
      success: true,
      message: 'Recurring schedule deleted successfully',
    });
  });

  // GET /api/health
  static healthCheck = asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Scheduler API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // GET /api/test-db
  static testDatabase = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Import db here to avoid circular dependency issues
      const db = require('../database/connection').default;
      
      // Test basic connection
      await db.raw('SELECT 1 as test');
      
      // Test if tables exist
      const hasSchedules = await db.schema.hasTable('schedules');
      const hasExceptions = await db.schema.hasTable('schedule_exceptions');
      
      res.json({
        success: true,
        message: 'Database connection successful',
        tables: {
          schedules: hasSchedules,
          schedule_exceptions: hasExceptions,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Database test failed:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Database connection failed',
          details: error.message,
        },
      });
    }
  });
}