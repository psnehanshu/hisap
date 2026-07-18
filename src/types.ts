export type Book = {
  id: string;
  name: string;
  emoji: string;
  /** Resolved hex color for the book's avatar / accent. */
  color: string;
  archived: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  label: string;
  emoji: string;
  /** Resolved hex color used for the stats swatch. */
  color: string;
  builtin: boolean;
};

export type Expense = {
  id: string;
  bookId: string;
  categoryId: string;
  description: string;
  /** Stored in the expense's own currency (major units). */
  amount: number;
  currency: string;
  /** ISO timestamp. */
  date: string;
};

export type Settings = {
  defaultCurrency: string;
};

export type CurrencyInfo = {
  code: string;
  symbol: string;
};

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'IDR', symbol: 'Rp' },
];

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? '$';
}
