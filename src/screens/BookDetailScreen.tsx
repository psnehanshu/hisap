import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Fab from '../components/Fab';
import Icon from '../components/Icon';
import { Screen } from '../components/Screen';
import { formatAmount } from '../lib/format';
import { filterExpenses, groupByDay, total } from '../lib/stats';
import {
  getExpenses,
  useActiveBooks,
  useCategories,
  useDefaultCurrency,
  useExpenses,
} from '../db/queries';
import { colors, divider, radius, space, textFaint, textMuted } from '../theme';
import type { StackParamList } from '../navigation/types';
import type { Book, Category, Expense } from '../types';

type Props = NativeStackScreenProps<StackParamList, 'Home'>;

/** The book requested by param, else the one with the most recent expense. */
function pickInitialIndex(books: Book[], requestedId?: string): number {
  if (requestedId) {
    const i = books.findIndex((b) => b.id === requestedId);
    if (i >= 0) return i;
  }
  const expenses = getExpenses();
  let bestIdx = 0;
  let bestTime = -Infinity;
  books.forEach((b, i) => {
    const latest = expenses.reduce(
      (m, e) => (e.bookId === b.id ? Math.max(m, new Date(e.date).getTime()) : m),
      -Infinity
    );
    if (latest > bestTime) {
      bestTime = latest;
      bestIdx = i;
    }
  });
  return bestIdx;
}

export default function BookDetailScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const { width } = useWindowDimensions();
  const books = useActiveBooks();
  const requestedId = route.params?.bookId;

  const [index, setIndex] = useState(0);
  const initializedRef = useRef(false);
  const listRef = useRef<FlatList<Book>>(null);

  // Keep the pill bar scrolled in sync with the swiped page.
  const pillsRef = useRef<ScrollView>(null);
  const pillLayouts = useRef<{ x: number; width: number }[]>([]);
  const pillsViewportW = useRef(0);

  const active = books[Math.min(index, books.length - 1)];

  /** Scroll the pill bar so the pill at (fractional) `progress` stays centered. */
  const syncPills = (progress: number) => {
    const layouts = pillLayouts.current;
    const vw = pillsViewportW.current;
    if (!vw || layouts.length === 0) return;
    const clamped = Math.max(0, Math.min(layouts.length - 1, progress));
    const lo = Math.floor(clamped);
    const hi = Math.min(layouts.length - 1, lo + 1);
    const frac = clamped - lo;
    const centerOf = (i: number) => {
      const l = layouts[i];
      return l ? l.x + l.width / 2 : 0;
    };
    const center = centerOf(lo) + (centerOf(hi) - centerOf(lo)) * frac;
    pillsRef.current?.scrollTo({ x: Math.max(0, center - vw / 2), animated: false });
  };

  const goTo = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToOffset({ offset: i * width, animated: true });
  };

  // Once books have loaded (live query populates after mount), select the
  // default book — the one requested, else the one with the latest expense.
  useEffect(() => {
    if (initializedRef.current || books.length === 0) return;
    initializedRef.current = true;
    const target = pickInitialIndex(books, requestedId);
    if (target > 0) {
      setIndex(target);
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: target * width, animated: false });
        requestAnimationFrame(() => syncPills(target));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  // Jump to a book requested from elsewhere (e.g. All books list).
  useEffect(() => {
    if (!requestedId || !initializedRef.current) return;
    const i = books.findIndex((b) => b.id === requestedId);
    if (i >= 0) goTo(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedId]);

  // Safety net: recenter the pill bar whenever the settled index changes.
  useEffect(() => {
    const raf = requestAnimationFrame(() => syncPills(index));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Screen>
      {/* Tab bar: menu + book pills */}
      <View style={styles.tabbar}>
        <Pressable onPress={() => nav.dispatch(DrawerActions.openDrawer())} hitSlop={10}>
          <Icon name="menu" size={22} />
        </Pressable>
        <ScrollView
          ref={pillsRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
          onLayout={(e) => {
            pillsViewportW.current = e.nativeEvent.layout.width;
          }}
        >
          {books.map((b, i) => {
            const on = i === index;
            return (
              <Pressable
                key={b.id}
                onPress={() => goTo(i)}
                onLayout={(e) => {
                  const { x, width: w } = e.nativeEvent.layout;
                  pillLayouts.current[i] = { x, width: w };
                }}
                style={[styles.pill, on && styles.pillActive]}
              >
                <AppText
                  size={13}
                  variant={on ? 'medium' : 'body'}
                  color={on ? colors.bg : textMuted}
                >
                  {b.name.split(' ')[0] === 'Day-to-day' ? 'Day-to-day' : b.name}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        ref={listRef}
        data={books}
        keyExtractor={(b) => b.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        scrollEventThrottle={16}
        onScroll={(e) => syncPills(e.nativeEvent.contentOffset.x / width)}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <BookPage
            book={item}
            width={width}
            onOpenStats={() => navigation.navigate('Stats', { bookId: item.id })}
            onOpenExpense={(id) => navigation.navigate('AddExpense', { expenseId: id })}
          />
        )}
      />

      <Fab onPress={() => navigation.navigate('AddExpense', { bookId: active?.id })} />
    </Screen>
  );
}

function BookPage({
  book,
  width,
  onOpenStats,
  onOpenExpense,
}: {
  book: Book;
  width: number;
  onOpenStats: () => void;
  onOpenExpense: (id: string) => void;
}) {
  const allExpenses = useExpenses();
  const categories = useCategories();
  const defaultCurrency = useDefaultCurrency();

  const monthExpenses = useMemo(
    () => filterExpenses(allExpenses, { bookId: book.id, tf: 'month' }),
    [allExpenses, book.id]
  );
  const bookExpenses = useMemo(
    () => allExpenses.filter((e) => e.bookId === book.id),
    [allExpenses, book.id]
  );
  const groups = useMemo(() => groupByDay(bookExpenses), [bookExpenses]);
  const catOf = (id: string) => categories.find((c) => c.id === id);

  return (
    <View style={{ width }}>
      <Card row style={styles.summary}>
        <View>
          <AppText size={11} color={textMuted}>
            This month · {monthExpenses.length}{' '}
            {monthExpenses.length === 1 ? 'expense' : 'expenses'}
          </AppText>
          <AppText variant="heading" size={24} style={{ marginTop: 2 }}>
            {formatAmount(total(monthExpenses), defaultCurrency)}
          </AppText>
        </View>
        <Pressable onPress={onOpenStats} style={styles.statsBtn}>
          <Icon name="stats" size={14} />
          <AppText size={12} variant="medium">
            Stats
          </AppText>
        </Pressable>
      </Card>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {groups.length === 0 && (
          <View style={styles.empty}>
            <Avatar emoji={book.emoji} size={64} bg={colors.surface} />
            <AppText size={15} color={textMuted} style={{ marginTop: 12 }}>
              No expenses yet
            </AppText>
            <AppText size={12} color={textFaint}>
              Tap + to add your first one
            </AppText>
          </View>
        )}
        {groups.map((g) => (
          <View key={g.label}>
            <AppText variant="bold" size={11} color={textMuted} style={styles.groupLabel}>
              {g.label.toUpperCase()}
            </AppText>
            <View style={{ gap: 8 }}>
              {g.items.map((e) => (
                <ExpenseRow
                  key={e.id}
                  expense={e}
                  category={catOf(e.categoryId)}
                  onPress={() => onOpenExpense(e.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export function ExpenseRow({
  expense,
  category,
  onPress,
}: {
  expense: Expense;
  category?: Category;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Avatar emoji={category?.emoji ?? '💸'} size={36} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText size={14} numberOfLines={1}>
          {expense.description || category?.label || 'Expense'}
        </AppText>
        <AppText size={11} color={textMuted}>
          {category?.label ?? 'Uncategorized'}
        </AppText>
      </View>
      <AppText variant="medium" size={14}>
        {formatAmount(expense.amount, expense.currency)}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: space[3],
    paddingTop: space[2],
  },
  pills: { gap: 6, alignItems: 'center', paddingRight: 8 },
  pill: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: radius.pill },
  pillActive: { backgroundColor: colors.accent },
  summary: {
    justifyContent: 'space-between',
    marginHorizontal: space[3],
    marginTop: 10,
    marginBottom: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
  },
  statsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: divider,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  listContent: { paddingHorizontal: space[3], paddingBottom: 100 },
  groupLabel: { letterSpacing: 1, marginTop: 14, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  empty: { alignItems: 'center', paddingTop: 80 },
});
