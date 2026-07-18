import { seedBooks, seedCategories, seedExpenses, seedSettings } from '../data/seed';
import { db } from './index';
import * as t from './schema';

/** Insert the sample dataset. Assumes the relevant tables are empty. */
export function seedInto() {
  for (const b of seedBooks) db.insert(t.books).values(b).run();
  for (const c of seedCategories) db.insert(t.categories).values(c).run();
  for (const e of seedExpenses) db.insert(t.expenses).values(e).run();
  db.insert(t.settings).values({ key: 'defaultCurrency', value: seedSettings.defaultCurrency }).run();
}

/**
 * Seed the sample data on first launch. Run after migrations have created the
 * schema (see `useMigrations` in App). Idempotent: only seeds an empty database.
 */
export function seedIfEmpty() {
  const hasBooks = db.select().from(t.books).all().length > 0;
  const hasCategories = db.select().from(t.categories).all().length > 0;
  if (!hasBooks && !hasCategories) seedInto();
}
