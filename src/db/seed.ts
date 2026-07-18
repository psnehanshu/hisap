import { seedBooks, seedCategories, seedExpenses, seedSettings } from '../data/seed';
import { db, initDb } from './index';
import * as t from './schema';

/** Insert the sample dataset. Assumes the relevant tables are empty. */
export function seedInto() {
  for (const b of seedBooks) db.insert(t.books).values(b).run();
  for (const c of seedCategories) db.insert(t.categories).values(c).run();
  for (const e of seedExpenses) db.insert(t.expenses).values(e).run();
  db.insert(t.settings).values({ key: 'defaultCurrency', value: seedSettings.defaultCurrency }).run();
}

/**
 * Create the schema and seed on first launch. Synchronous (expo-sqlite sync
 * API), so it can run before the first render — screens can query immediately.
 */
export function bootstrapDb() {
  initDb();
  const hasBooks = db.select().from(t.books).all().length > 0;
  const hasCategories = db.select().from(t.categories).all().length > 0;
  if (!hasBooks && !hasCategories) seedInto();
}
