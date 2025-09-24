import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';
import { 
  validate, 
  createSlotSchema, 
  updateSlotSchema, 
  dateParamSchema, 
  idParamSchema 
} from '../middleware/validation';

const router = Router();

// Health check
router.get('/health', ScheduleController.healthCheck);

// Database test
router.get('/test-db', ScheduleController.testDatabase);

// Simple test route (no database)
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Simple test route working',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
  });
});

// Get slots for a specific week
router.get(
  '/slots/week/:date',
  validate(dateParamSchema, 'params'),
  ScheduleController.getSlotsForWeek
);

// Create a new recurring slot
router.post(
  '/slots',
  validate(createSlotSchema),
  ScheduleController.createSlot
);

// Update a slot for a specific date (creates exception)
router.put(
  '/slots/:id/date/:date',
  validate(idParamSchema, 'params'),
  validate(updateSlotSchema),
  ScheduleController.updateSlotForDate
);

// Delete a slot for a specific date (creates exception)
router.delete(
  '/slots/:id/date/:date',
  validate(idParamSchema, 'params'),
  validate(dateParamSchema, 'params'),
  ScheduleController.deleteSlotForDate
);

// Delete entire recurring schedule
router.delete(
  '/slots/:id',
  validate(idParamSchema, 'params'),
  ScheduleController.deleteSchedule
);

export default router;