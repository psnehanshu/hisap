import { colors } from '../theme';
import type { Book, Category, Expense, Settings } from '../types';

const C = colors;

/** Relative date helper — days back from a fixed "now" so the seed reads well. */
function daysAgo(n: number, hour = 13, min = 30): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

function marchDay(day: number, hour = 12): string {
  const d = new Date();
  d.setMonth(2, day); // March
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const seedBooks: Book[] = [
  { id: 'daytoday', name: 'Day-to-day expenses', emoji: '📒', color: C.accentRamp[600], archived: false, createdAt: daysAgo(120) },
  { id: 'bali', name: 'Bali Trip', emoji: '✈️', color: C.accent2Ramp[700], archived: false, createdAt: marchDay(1) },
  { id: 'reno', name: 'Home Renovation', emoji: '🏠', color: C.neutral[800], archived: false, createdAt: daysAgo(60) },
];

export const seedCategories: Category[] = [
  { id: 'food', label: 'Food', emoji: '🍔', color: C.accentRamp[600], builtin: true },
  { id: 'transportation', label: 'Transportation', emoji: '🚗', color: C.accent2Ramp[700], builtin: true },
  { id: 'accommodation', label: 'Accommodation', emoji: '🏨', color: C.accentRamp[800], builtin: true },
  { id: 'groceries', label: 'Groceries', emoji: '🛒', color: C.accent2Ramp[500], builtin: true },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: C.accentRamp[500], builtin: true },
  { id: 'utilities', label: 'Utilities', emoji: '💡', color: C.neutral[700], builtin: true },
  { id: 'health', label: 'Health', emoji: '💊', color: C.accent2Ramp[600], builtin: true },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️', color: C.accent2Ramp[800], builtin: true },
  { id: 'visa', label: 'Visa & Fees', emoji: '🛂', color: C.accentRamp[700], builtin: false },
  { id: 'decor', label: 'Home Decor', emoji: '🎨', color: C.neutral[800], builtin: false },
  { id: 'labor', label: 'Labor', emoji: '👷', color: C.accentRamp[900], builtin: false },
];

let seq = 0;
const eid = () => `seed-${(++seq).toString().padStart(3, '0')}`;

function exp(
  bookId: string,
  categoryId: string,
  description: string,
  amount: number,
  date: string,
  currency = 'USD'
): Expense {
  return { id: eid(), bookId, categoryId, description, amount, currency, date };
}

export const seedExpenses: Expense[] = [
  // Day-to-day — recent, so "this month / week" stats populate
  exp('daytoday', 'groceries', 'Grocery run', 64.2, daysAgo(0, 9, 15)),
  exp('daytoday', 'food', 'Lunch with team', 18.5, daysAgo(0, 13, 5)),
  exp('daytoday', 'transportation', 'Uber to airport', 23.0, daysAgo(1, 7, 40)),
  exp('daytoday', 'entertainment', 'Netflix', 15.99, daysAgo(1, 20, 0)),
  exp('daytoday', 'utilities', 'Electric bill', 92.4, daysAgo(3, 10, 0)),
  exp('daytoday', 'health', 'Pharmacy', 12.75, daysAgo(3, 16, 30)),
  exp('daytoday', 'food', 'Coffee & pastry', 8.4, daysAgo(2, 8, 30)),
  exp('daytoday', 'groceries', 'Weekly groceries', 86.0, daysAgo(5, 18, 0)),
  exp('daytoday', 'shopping', 'New headphones', 30.0, daysAgo(6, 15, 0)),
  exp('daytoday', 'transportation', 'Monthly transit pass', 75.34, daysAgo(4, 8, 0)),
  exp('daytoday', 'entertainment', 'Concert tickets', 60.0, daysAgo(6, 19, 0)),
  exp('daytoday', 'food', 'Dinner out', 42.0, daysAgo(5, 20, 30)),
  exp('daytoday', 'health', 'Gym day pass', 31.85, daysAgo(2, 7, 0)),
  exp('daytoday', 'utilities', 'Internet', 51.0, daysAgo(7, 11, 0)),

  // Bali Trip — March, various currencies (IDR default abroad but stored per-expense)
  exp('bali', 'accommodation', 'Villa — 4 nights', 420.0, marchDay(3, 15)),
  exp('bali', 'transportation', 'Airport transfer', 38.0, marchDay(2, 22)),
  exp('bali', 'food', 'Beach club lunch', 64.6, marchDay(4, 13)),
  exp('bali', 'visa', 'Visa on arrival', 35.0, marchDay(2, 9)),
  exp('bali', 'entertainment', 'Surf lesson', 55.0, marchDay(5, 10)),
  exp('bali', 'groceries', 'Snacks & water', 28.0, marchDay(4, 18)),
  exp('bali', 'transportation', 'Scooter rental', 45.0, marchDay(3, 8)),
  exp('bali', 'accommodation', 'Ubud homestay', 160.0, marchDay(6, 15)),

  // Home Renovation — goal book, big-ticket items
  exp('reno', 'labor', 'Contractor — framing', 1200.0, daysAgo(40, 10)),
  exp('reno', 'accommodation', 'Temporary rental', 1800.0, daysAgo(35, 12)),
  exp('reno', 'decor', 'Living room furniture', 538.0, daysAgo(20, 14)),
];

export const seedSettings: Settings = {
  defaultCurrency: 'USD',
};
