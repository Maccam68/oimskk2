import { Pool, PoolConfig } from 'pg';

// Configuration for different environments
const config: PoolConfig = {
  connectionString: import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create pool only in server environment
const createPool = () => {
  if (typeof window === 'undefined') {
    return new Pool(config);
  }
  return null;
};

const pool = createPool();

export const query = async (text: string, params?: any[]) => {
  if (!pool) {
    throw new Error('Database operations are not available in browser environment');
  }
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export const transaction = async <T>(callback: (client: any) => Promise<T>) => {
  if (!pool) {
    throw new Error('Database operations are not available in browser environment');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default {
  query,
  transaction,
  pool
};