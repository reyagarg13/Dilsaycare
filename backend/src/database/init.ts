import db from './connection';

// Create tables programmatically
export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create schedules table
    const hasSchedulesTable = await db.schema.hasTable('schedules');
    if (!hasSchedulesTable) {
      await db.schema.createTable('schedules', (table) => {
        table.increments('id').primary();
        table.integer('day_of_week').notNullable(); // 0 = Sunday, 6 = Saturday
        table.string('start_time', 5).notNullable(); // HH:MM format
        table.string('end_time', 5).notNullable(); // HH:MM format
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
        
        // Ensure no time overlap for the same day
        table.index(['day_of_week', 'start_time', 'end_time']);
      });
      console.log('✅ Created schedules table');
    }

    // Create schedule_exceptions table
    const hasExceptionsTable = await db.schema.hasTable('schedule_exceptions');
    if (!hasExceptionsTable) {
      await db.schema.createTable('schedule_exceptions', (table) => {
        table.increments('id').primary();
        table.integer('schedule_id').references('id').inTable('schedules').onDelete('CASCADE');
        table.date('exception_date').notNullable();
        table.string('start_time', 5).nullable(); // null if deleted
        table.string('end_time', 5).nullable(); // null if deleted
        table.enum('exception_type', ['modified', 'deleted']).notNullable();
        table.timestamps(true, true);
        
        // Unique constraint to prevent multiple exceptions for same schedule on same date
        table.unique(['schedule_id', 'exception_date']);
        table.index(['exception_date']);
      });
      console.log('✅ Created schedule_exceptions table');
    }

    console.log('✅ Database migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Seed sample data
export const runSeeds = async (): Promise<void> => {
  try {
    console.log('🌱 Running database seeds...');
    
    // Check if data already exists
    const existingSchedules = await db('schedules').count('* as count').first();
    if (Number(existingSchedules?.count) > 0) {
      console.log('📋 Sample data already exists, skipping seeds');
      return;
    }

    // Insert sample schedules
    await db('schedules').insert([
      {
        day_of_week: 1, // Monday
        start_time: '09:00',
        end_time: '11:00',
        is_active: true,
      },
      {
        day_of_week: 3, // Wednesday
        start_time: '14:00',
        end_time: '16:00',
        is_active: true,
      },
      {
        day_of_week: 5, // Friday
        start_time: '10:00',
        end_time: '12:00',
        is_active: true,
      },
    ]);

    console.log('✅ Database seeds completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Initialize database (run migrations and seeds)
export const initializeDatabase = async (): Promise<void> => {
  console.log('🚀 Initializing database...');
  await runMigrations();
  await runSeeds();
  console.log('🎉 Database initialization complete!');
};