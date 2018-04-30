import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/**
 * Use development to start up a DB on your local machine.
 */

export const development = {
  client: 'mysql2',
  connection: {
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 3306,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  migrations: {
    directory: './src/db/migrations',
  },
};
export const staging = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
export const production = {
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user: 'username',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
