<div align="center">

# 💰 Hisap

**হিসাপ** — Assamese for *accounting*.

A warm, offline-first expense tracker for Android & iOS, built with Expo & React Native.
Track spending across multiple books, categorise it your way, and see where the money goes —
all stored locally on your device, no account, no server, no internet required.

![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Drizzle%20ORM-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## Overview

Hisap organises expenses into **books** — think of each as a separate ledger: your day-to-day
spending, a trip, a renovation project, a savings goal. Every expense carries its own category,
currency, and timestamp, and the app rolls it all up into live stats. It runs fully offline; your
data lives in an on-device SQLite database and never leaves the phone unless you choose to export it.

The interface uses the **Organic** design system — a warm cream ground, terracotta and sage accents,
Caprasimo display headings over Figtree, and soft over-rounded, pill-shaped controls.

## Features

- 📚 **Multiple books** — swipe or tap between ledgers; the book you used most recently opens first.
- 🧾 **Rich expenses** — amount, per-expense currency, category, description, and date/time.
- 🏷️ **Categories** — built-ins (Food, Transport, Groceries, …) plus your own custom ones with any emoji icon.
- 📊 **Live stats** — spend by category, by book, and a last-7-days chart, filterable by book and timeframe.
- ✏️ **Full CRUD** — create / edit / archive / delete books, edit or delete any expense, manage categories.
- 🌍 **Per-expense currencies** with a default set in Settings.
- 📤 **CSV export** via the native share sheet.
- 📴 **100% offline** — everything persists locally in SQLite; no sign-in, no network.

## Screens

| # | Screen | What it does |
|---|--------|--------------|
| 1 | **Book detail (home)** | Swipeable book pages, grouped expense feed, month summary, stats shortcut, add FAB |
| 2 | **All books** | Spend across all books with a timeframe filter; edit / archive / delete per book |
| 3 | **Add / edit expense** | Amount, currency, category, description, date & time |
| 4 | **Category picker** | Bottom-sheet grid; opens a dedicated screen to create a custom category |
| 5 | **Stats** | By-category, by-book, and last-7-days breakdowns, filtered by book + timeframe |
| 6 | **Create / edit book** | Emoji, name, colour, archive |
| 7 | **Settings** | Default currency, manage categories & books, CSV export, reset |
| 8 | **Side drawer** | Books / Stats / Settings navigation |
| 9 | **Emoji picker** | Shared icon picker for categories & books |

## Tech stack

- **[Expo](https://expo.dev) SDK 54** + **React Native 0.81** (TypeScript)
- **[expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** + **[Drizzle ORM](https://orm.drizzle.team/)** for storage, with `useLiveQuery` for reactive reads
- **[React Navigation](https://reactnavigation.org/)** — drawer + native stack
- **[Reanimated](https://docs.swmansion.com/react-native-reanimated/)** & **Gesture Handler**
- **Lucide** icons; **Caprasimo** + **Figtree** via `@expo-google-fonts`

## Getting started

> Requires an Expo Go build that supports **SDK 54** (Android).

```bash
npm install
npm start        # then scan the QR code with Expo Go
```

On first launch the database is created and seeded with sample data (three books, a mix of
built-in and custom categories, and example expenses).

## Project structure

```
src/
  theme.ts              Organic design tokens (colors, ramps, spacing, radii, shadows, fonts)
  types.ts              data model + currencies
  db/
    schema.ts           Drizzle tables: books, categories, expenses, settings
    index.ts            opens hisap.db, creates tables
    queries.ts          useLiveQuery hooks + synchronous getters
    mutations.ts        insert / update / delete helpers
    seed.ts             first-launch bootstrap + sample data
  data/                 seed dataset + emoji groups
  lib/                  money/date formatting, stats aggregation
  components/           Button, Card, Tag, Field, Sheet, Segmented, pickers, …
  screens/              the nine screens above
  navigation/           drawer + native stack, custom drawer content
```

## Data & storage

All state lives in an on-device SQLite database (`hisap.db`), accessed through Drizzle ORM.
Screens read reactively with Drizzle's `useLiveQuery` — a write anywhere re-renders every view
that depends on it — and mutations are plain functions that write through Drizzle. Nothing is sent
to any server; the only way data leaves the device is the explicit **Settings → Export data (CSV)**
share action.

## License

[MIT](./LICENSE) © Snehanshu Phukon

---

<div align="center">
<sub>Built with the Organic design system · imported from a Claude Design canvas.</sub>
</div>
