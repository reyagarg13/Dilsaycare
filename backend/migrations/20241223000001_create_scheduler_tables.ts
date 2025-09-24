import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create schedules table for recurring patterns
  await knex.schema.createTable('schedules', (table) => {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable(); // 0 = Sunday, 6 = Saturday
    table.string('start_time', 5).notNullable(); // HH:MM format
    table.string('end_time', 5).notNullable(); // HH:MM format
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
    
    // Ensure no time overlap for the same day
    table.index(['day_of_week', 'start_time', 'end_time']);
  });

  // Create schedule_exceptions table for specific date modifications
  await knex.schema.createTable('schedule_exceptions', (table) => {
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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('schedule_exceptions');
  await knex.schema.dropTableIfExists('schedules');
}