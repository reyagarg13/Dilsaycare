import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

// Validation schemas
export const createSlotSchema = Joi.object({
  day_of_week: Joi.number().integer().min(0).max(6).required()
    .messages({
      'number.base': 'Day of week must be a number',
      'number.integer': 'Day of week must be an integer',
      'number.min': 'Day of week must be between 0 (Sunday) and 6 (Saturday)',
      'number.max': 'Day of week must be between 0 (Sunday) and 6 (Saturday)',
      'any.required': 'Day of week is required',
    }),
  start_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format',
      'any.required': 'Start time is required',
    }),
  end_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format',
      'any.required': 'End time is required',
    }),
});

export const updateSlotSchema = Joi.object({
  start_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'Start time must be in HH:MM format',
      'any.required': 'Start time is required',
    }),
  end_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
    .messages({
      'string.pattern.base': 'End time must be in HH:MM format',
      'any.required': 'End time is required',
    }),
});

export const dateParamSchema = Joi.object({
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    .messages({
      'string.pattern.base': 'Date must be in YYYY-MM-DD format',
      'any.required': 'Date is required',
    }),
});

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be positive',
      'any.required': 'ID is required',
    }),
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const message = error.details?.[0]?.message || 'Validation error';
      throw createError(message, 400);
    }
    
    next();
  };
};