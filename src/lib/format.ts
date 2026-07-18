import { currencySymbol } from '../types';

export function formatAmount(amount: number, currency = 'USD', withSymbol = true): string {
  const fixed = Math.abs(amount) >= 1000 || amount % 1 !== 0 ? 2 : 2;
  const n = amount.toLocaleString('en-US', {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  });
  return withSymbol ? `${currencySymbol(currency)}${n}` : n;
}

/** "Today", "Yesterday", or "Jul 2" / "Mar 3, 2025". */
export function groupLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** "Today, Jul 17" for the date-field chip. */
export function dateChipLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86400000);
  const md = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (diffDays === 0) return `Today, ${md}`;
  if (diffDays === 1) return `Yesterday, ${md}`;
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
