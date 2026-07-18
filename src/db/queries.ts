import { desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import type { Book, Category, Expense } from '../types';
import { db } from './index';
import * as t from './schema';

// ── Live hooks (re-render when the underlying table changes) ─────────────────

export function useAllBooks(): Book[] {
  return useLiveQuery(db.select().from(t.books)).data;
}

export function useActiveBooks(): Book[] {
  return useLiveQuery(db.select().from(t.books).where(eq(t.books.archived, false))).data;
}

export function useCategories(): Category[] {
  return useLiveQuery(db.select().from(t.categories)).data;
}

/** All expenses, newest first. */
export function useExpenses(): Expense[] {
  return useLiveQuery(db.select().from(t.expenses).orderBy(desc(t.expenses.date))).data;
}

export function useDefaultCurrency(): string {
  const rows = useLiveQuery(
    db.select().from(t.settings).where(eq(t.settings.key, 'defaultCurrency'))
  ).data;
  return rows[0]?.value ?? 'USD';
}

// ── Synchronous one-shot reads (for initial form state, which can't wait for
//    a live query's effect to populate) ──────────────────────────────────────

export function getActiveBooks(): Book[] {
  return db.select().from(t.books).where(eq(t.books.archived, false)).all();
}

export function getExpenses(): Expense[] {
  return db.select().from(t.expenses).all();
}

export function getExpenseById(id: string): Expense | undefined {
  return db.select().from(t.expenses).where(eq(t.expenses.id, id)).get();
}

export function getBookById(id: string): Book | undefined {
  return db.select().from(t.books).where(eq(t.books.id, id)).get();
}

export function getCategoryById(id: string): Category | undefined {
  return db.select().from(t.categories).where(eq(t.categories.id, id)).get();
}

export function getDefaultCurrency(): string {
  const row = db.select().from(t.settings).where(eq(t.settings.key, 'defaultCurrency')).get();
  return row?.value ?? 'USD';
}
