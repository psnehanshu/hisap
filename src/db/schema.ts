import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  emoji: text('emoji').notNull(),
  color: text('color').notNull(),
  archived: integer('archived', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  emoji: text('emoji').notNull(),
  color: text('color').notNull(),
  builtin: integer('builtin', { mode: 'boolean' }).notNull().default(false),
});

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull(),
  categoryId: text('category_id').notNull(),
  description: text('description').notNull().default(''),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  date: text('date').notNull(),
});

/** Simple key/value table — currently just `defaultCurrency`. */
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
