import { eq } from 'drizzle-orm';
import type { Book, Category, Expense } from '../types';
import { db } from './index';
import * as t from './schema';
import { seedInto } from './seed';

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── expenses ────────────────────────────────────────────────────────────────
export function addExpense(e: Omit<Expense, 'id'>): string {
  const id = uid('exp');
  db.insert(t.expenses).values({ id, ...e }).run();
  return id;
}
export function updateExpense(id: string, patch: Partial<Omit<Expense, 'id'>>) {
  db.update(t.expenses).set(patch).where(eq(t.expenses.id, id)).run();
}
export function deleteExpense(id: string) {
  db.delete(t.expenses).where(eq(t.expenses.id, id)).run();
}

// ── books ────────────────────────────────────────────────────────────────────
export function addBook(b: Omit<Book, 'id' | 'archived' | 'createdAt'>): string {
  const id = uid('book');
  db.insert(t.books)
    .values({ ...b, id, archived: false, createdAt: new Date().toISOString() })
    .run();
  return id;
}
export function updateBook(id: string, patch: Partial<Omit<Book, 'id'>>) {
  db.update(t.books).set(patch).where(eq(t.books.id, id)).run();
}
export function archiveBook(id: string) {
  db.update(t.books).set({ archived: true }).where(eq(t.books.id, id)).run();
}
export function deleteBook(id: string) {
  db.delete(t.expenses).where(eq(t.expenses.bookId, id)).run();
  db.delete(t.books).where(eq(t.books.id, id)).run();
}

// ── categories ───────────────────────────────────────────────────────────────
export function addCategory(c: Omit<Category, 'id' | 'builtin'>): string {
  const id = uid('cat');
  db.insert(t.categories).values({ ...c, id, builtin: false }).run();
  return id;
}
export function updateCategory(id: string, patch: Partial<Omit<Category, 'id'>>) {
  db.update(t.categories).set(patch).where(eq(t.categories.id, id)).run();
}
export function deleteCategory(id: string) {
  db.delete(t.categories).where(eq(t.categories.id, id)).run();
}

// ── settings ─────────────────────────────────────────────────────────────────
export function setDefaultCurrency(code: string) {
  db.insert(t.settings)
    .values({ key: 'defaultCurrency', value: code })
    .onConflictDoUpdate({ target: t.settings.key, set: { value: code } })
    .run();
}

// ── whole-dataset ────────────────────────────────────────────────────────────
export function resetToSeed() {
  db.delete(t.expenses).where(eq(t.expenses.id, t.expenses.id)).run();
  db.delete(t.books).where(eq(t.books.id, t.books.id)).run();
  db.delete(t.categories).where(eq(t.categories.id, t.categories.id)).run();
  db.delete(t.settings).where(eq(t.settings.key, t.settings.key)).run();
  seedInto();
}
