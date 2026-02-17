import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_TYPE = process.env.DB_TYPE || 'sqlite';

let db;

// SQLite Database Initialization (Development)
if (DB_TYPE === 'sqlite') {
  const dbPath = path.join(__dirname, '../database/tensed_intern.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Database connection error:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });

  // Initialize SQLite database tables
  const initializeDatabase = () => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          phone TEXT,
          bio TEXT,
          profile_image TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Job Applications table
      db.run(`
        CREATE TABLE IF NOT EXISTS job_applications (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          company_name TEXT NOT NULL,
          position_title TEXT NOT NULL,
          status TEXT DEFAULT 'Applied',
          notes TEXT,
          rating INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Saved Jobs table
      db.run(`
        CREATE TABLE IF NOT EXISTS saved_jobs (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          job_title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          salary TEXT,
          job_url TEXT,
          source TEXT,
          saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Job Listings table
      db.run(`
        CREATE TABLE IF NOT EXISTS job_listings (
          id TEXT PRIMARY KEY,
          job_title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          salary TEXT,
          job_url TEXT,
          source TEXT,
          is_hot BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database tables initialized');
    });
  };

  initializeDatabase();
}

// PostgreSQL Database Initialization (Production)
else if (DB_TYPE === 'postgres') {
  import('pg').then((module) => {
    const { Pool } = module.default;
    
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    db = pool;

    // Initialize PostgreSQL database tables
    const initializeDatabase = async () => {
      try {
        // Users table
        await db.query(`
          CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            bio TEXT,
            profile_image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Job Applications table
        await db.query(`
          CREATE TABLE IF NOT EXISTS job_applications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            company_name TEXT NOT NULL,
            position_title TEXT NOT NULL,
            status TEXT DEFAULT 'Applied',
            notes TEXT,
            rating INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Saved Jobs table
        await db.query(`
          CREATE TABLE IF NOT EXISTS saved_jobs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            job_title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT,
            salary TEXT,
            job_url TEXT,
            source TEXT,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Job Listings table
        await db.query(`
          CREATE TABLE IF NOT EXISTS job_listings (
            id TEXT PRIMARY KEY,
            job_title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT,
            salary TEXT,
            job_url TEXT,
            source TEXT,
            is_hot BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Create indexes for better performance
        await db.query(`
          CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
          CREATE INDEX IF NOT EXISTS idx_applications_user_id ON job_applications(user_id);
          CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
          CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
          CREATE INDEX IF NOT EXISTS idx_job_listings_source ON job_listings(source);
          CREATE INDEX IF NOT EXISTS idx_job_listings_hot ON job_listings(is_hot);
        `);

        console.log('PostgreSQL database tables and indexes initialized');
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };

    initializeDatabase();
  }).catch((error) => {
    console.error('Failed to load PostgreSQL module:', error);
  });
}

export default db;
