import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../dev.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../../migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, '../../seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
    migrations: {
      directory: path.join(__dirname, '../../migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.join(__dirname, '../../seeds'),
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};

export default config;