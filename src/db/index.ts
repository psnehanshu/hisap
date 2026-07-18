import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

/**
 * The underlying expo-sqlite database (on-device, in the app sandbox).
 * `enableChangeListener` is required for Drizzle's `useLiveQuery` to receive
 * table-change events and re-run its queries.
 */
export const sqlite = openDatabaseSync('hisap.db', { enableChangeListener: true });

/** Drizzle handle used for all reads and writes. */
export const db = drizzle(sqlite);

/**
 * Create the tables if they don't exist yet. We create them at runtime (rather
 * than shipping drizzle-kit migrations) since the schema is small and stable —
 * `CREATE TABLE IF NOT EXISTS` is idempotent and safe to run on every launch.
 */
export function initDb() {
  sqlite.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      archived INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      label TEXT NOT NULL,
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      builtin INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      book_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
