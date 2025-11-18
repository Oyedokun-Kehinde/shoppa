const { Pool } = require('pg');

let pool;

const connectDB = async () => {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // Supabase hosted Postgres requires SSL
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('PostgreSQL (Supabase) Connected Successfully');

    return pool;
  } catch (error) {
    console.error(`PostgreSQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDB first.');
  }
  return pool;
};

module.exports = { connectDB, getPool };
