import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('schedule_exceptions').del();
  await knex('schedules').del();

  // Insert sample schedules
  await knex('schedules').insert([
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
}