import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

const SCHEMA = `
-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  current_question INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL CHECK (question_id BETWEEN 1 AND 20),
  selected_pole TEXT NOT NULL CHECK (selected_pole IN ('E', 'I', 'S', 'N', 'T', 'F', 'J', 'P')),
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, question_id)
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_answers_session ON answers(session_id);
`;

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function initDatabase(dbPath?: string): Database.Database {
  if (db) {
    return db;
  }

  const finalPath =
    dbPath || process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'personality-test.db');

  // Ensure data directory exists
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(finalPath);

  // Enable foreign keys and WAL mode for better performance
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  // Create tables
  db.exec(SCHEMA);

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDatabase(): void {
  if (db) {
    db.exec('DELETE FROM answers');
    db.exec('DELETE FROM sessions');
  }
}

// For testing - create in-memory database
export function initTestDatabase(): Database.Database {
  if (db) {
    closeDatabase();
  }

  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);

  return db;
}
