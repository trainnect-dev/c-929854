import Database from 'better-sqlite3';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseConfig {
  useSupabase: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
}

let db: Database | null = null;

export const initializeDatabase = () => {
  const config: DatabaseConfig = {
    useSupabase: process.env.USE_SUPABASE === 'true',
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  };

  if (!config.useSupabase) {
    if (!db) {
      db = new Database('local.db');
      // Initialize your local database schema here
      db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    return db;
  }

  return supabase;
};

export const getDatabase = () => {
  if (process.env.USE_SUPABASE === 'true') {
    return supabase;
  }
  return db;
};