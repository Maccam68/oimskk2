import { query } from '../src/lib/db.js';

const migrations = [
  // Ofsted Sections
  `CREATE TABLE IF NOT EXISTS ofsted_sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    actions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Ofsted Requirements
  `CREATE TABLE IF NOT EXISTS ofsted_requirements (
    id SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES ofsted_sections(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'not_started',
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Ofsted Evidence
  `CREATE TABLE IF NOT EXISTS ofsted_evidence (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES ofsted_requirements(id),
    file_url TEXT NOT NULL,
    description TEXT,
    uploaded_by INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // Users
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    pin VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`
];

const runMigrations = async () => {
  try {
    for (const migration of migrations) {
      await query(migration);
      console.log('Migration completed:', migration.split('\n')[0]);
    }
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();