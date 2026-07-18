import type { Book, Category, Expense } from '../types';
import { groupLabel } from './format';

export type Timeframe = 'week' | 'month' | 'year' | 'all' | 'custom';

export const TIMEFRAMES: { key: Timeframe; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All time' },
  { key: 'custom', label: 'Custom' },
];

export function timeframeStart(tf: Timeframe): number {
  const now = new Date();
  switch (tf) {
    case 'week': {
      const d = new Date(now);
      d.setDate(d.getDate() - 6);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    case 'year':
      return new Date(now.getFullYear(), 0, 1).getTime();
    default:
      return 0;
  }
}

export function filterExpenses(
  expenses: Expense[],
  opts: { bookId?: string | null; tf?: Timeframe } = {}
): Expense[] {
  const start = opts.tf ? timeframeStart(opts.tf) : 0;
  return expenses.filter((e) => {
    if (opts.bookId && e.bookId !== opts.bookId) return false;
    if (start && new Date(e.date).getTime() < start) return false;
    return true;
  });
}

export function total(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export type Slice = { key: string; label: string; color: string; amount: number; pct: number };

export function byCategory(expenses: Expense[], categories: Category[]): Slice[] {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount);
  const sum = total(expenses) || 1;
  return [...map.entries()]
    .map(([catId, amount]) => {
      const c = categories.find((x) => x.id === catId);
      return {
        key: catId,
        label: c?.label ?? 'Uncategorized',
        color: c?.color ?? '#999',
        amount,
        pct: Math.round((amount / sum) * 100),
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function byBook(expenses: Expense[], books: Book[]): Slice[] {
  const map = new Map<string, number>();
  for (const e of expenses) map.set(e.bookId, (map.get(e.bookId) ?? 0) + e.amount);
  const sum = total(expenses) || 1;
  return [...map.entries()]
    .map(([bookId, amount]) => {
      const b = books.find((x) => x.id === bookId);
      return {
        key: bookId,
        label: b?.name ?? 'Unknown',
        color: b?.color ?? '#999',
        amount,
        pct: Math.round((amount / sum) * 100),
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export type DayBar = { key: string; label: string; amount: number; pct: number };

/** Last 7 days as bars, normalized to the tallest. */
export function byDay(expenses: Expense[]): DayBar[] {
  const days: DayBar[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = d.getTime() + 86400000;
    const amount = expenses
      .filter((e) => {
        const t = new Date(e.date).getTime();
        return t >= d.getTime() && t < next;
      })
      .reduce((s, e) => s + e.amount, 0);
    days.push({
      key: d.toISOString(),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      amount,
      pct: 0,
    });
  }
  const max = Math.max(1, ...days.map((d) => d.amount));
  return days.map((d) => ({ ...d, pct: Math.max(d.amount > 0 ? 6 : 0, Math.round((d.amount / max) * 100)) }));
}

export type ExpenseGroup = { label: string; items: Expense[] };

/** Group expenses by day label (Today / Yesterday / date), newest first. */
export function groupByDay(expenses: Expense[]): ExpenseGroup[] {
  const sorted = [...expenses].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const groups: ExpenseGroup[] = [];
  for (const e of sorted) {
    const label = groupLabel(e.date);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(e);
    else groups.push({ label, items: [e] });
  }
  return groups;
}

export function monthLabel(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
}
