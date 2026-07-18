import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

/**
 * The underlying expo-sqlite database (on-device, in the app sandbox).
 * `enableChangeListener` is required for Drizzle's `useLiveQuery` to receive
 * table-change events and re-run its queries.
 */
export const sqlite = openDatabaseSync('hisap.db', { enableChangeListener: true });

// Write-ahead logging for better concurrency/perf.
sqlite.execSync('PRAGMA journal_mode = WAL;');

/** Drizzle handle used for all reads and writes. */
export const db = drizzle(sqlite);
