const knex = require('knex');
const path = require('path');

// Database configuration
const config = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'dev.sqlite3')
  },
  useNullAsDefault: true,
  migrations: {
    directory: path.join(__dirname, 'migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.join(__dirname, 'seeds'),
    extension: 'ts',
  },
};

console.log('Testing database connection...');
console.log('Database file:', config.connection.filename);

const db = knex(config);

// Test the connection
async function testConnection() {
  try {
    console.log('Checking database tables...');
    
    // Check if tables exist
    const hasSchedulesTable = await db.schema.hasTable('schedules');
    const hasExceptionsTable = await db.schema.hasTable('schedule_exceptions');
    
    console.log('Tables exist:');
    console.log('- schedules:', hasSchedulesTable);
    console.log('- schedule_exceptions:', hasExceptionsTable);
    
    if (hasSchedulesTable) {
      // Test a simple query
      const count = await db('schedules').count('* as total').first();
      console.log('Schedules count:', count.total);
      
      // Test get schedules by day
      const schedules = await db('schedules').where('day_of_week', 1).select('*');
      console.log('Monday schedules:', schedules.length);
    }
    
    console.log('✅ Database connection test successful!');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.destroy();
  }
}

testConnection();