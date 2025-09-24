import knex from 'knex';

const environment = process.env.NODE_ENV || 'development';

// Direct database configuration
const dbConfig = environment === 'production' 
  ? {
      client: 'postgresql',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: false
      },
      pool: {
        min: 2,
        max: 20,
      },
    }
  : {
      client: 'sqlite3',
      connection: {
        filename: './dev.sqlite3'
      },
      useNullAsDefault: true,
    };

const db = knex(dbConfig);

export default db;