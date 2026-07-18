# Hisap

An offline expense-tracker mobile app, built with Expo / React Native from the
**Expense Tracker** Claude Design canvas. Styled with the **Organic** design
system — warm cream ground, terracotta + sage accents, Caprasimo headings over
Figtree, over-rounded pill controls.

Everything is stored locally on the device (AsyncStorage); the app works fully
offline.

## Run

```bash
npm install
npx expo start        # then press "a" (Android) / "i" (iOS), or scan the QR in Expo Go
```

## Screens

1. **Book detail (home)** — swipe or tap the pills to switch between books; grouped expense feed, month summary, Stats shortcut, add FAB.
2. **All books** — spend across all books with a timeframe filter, per-book cards.
3. **Add / edit expense** — amount + per-expense currency, category, description, date & time; delete when editing.
4. **Category picker** — grid of categories with inline custom-category creation.
5. **Stats** — filter by book + timeframe; by-category, by-book, and last-7-days breakdowns (opening a book's Stats lands here pre-filtered).
6. **Create / edit book** — emoji, name, color; archive.
7. **Settings** — default currency, manage categories/books, CSV export, reset.
8. **Side drawer** — Books / Stats / Settings navigation (hamburger).
9. **Emoji picker** — shared icon picker for categories & books.

## Structure

```
src/
  theme.ts              Organic design tokens (colors, ramps, spacing, radii, shadows, fonts)
  types.ts              data model + currencies
  store.ts              Zustand store persisted to AsyncStorage
  data/seed.ts          sample books, categories, expenses
  data/emoji.ts         emoji picker groups
  lib/format.ts         money / date formatting
  lib/stats.ts          filtering, totals, category/book/day aggregation
  components/           Button, Card, Tag, Field, Sheet, Segmented, EmojiPicker, ...
  screens/              the nine screens above
  navigation/           drawer + native stack, custom drawer content
```
