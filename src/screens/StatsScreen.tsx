import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import Icon from '../components/Icon';
import { Header, Screen } from '../components/Screen';
import Segmented from '../components/Segmented';
import { formatAmount } from '../lib/format';
import {
  byBook,
  byCategory,
  byDay,
  filterExpenses,
  Slice,
  TIMEFRAMES,
  Timeframe,
  total,
} from '../lib/stats';
import { useActiveBooks, useCategories, useDefaultCurrency, useExpenses } from '../db/queries';
import { colors, divider, radius, space, textMuted } from '../theme';
import type { StackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'Stats'>;

export default function StatsScreen({ navigation, route }: Props) {
  const nav = useNavigation();
  const books = useActiveBooks();
  const categories = useCategories();
  const expenses = useExpenses();
  const defaultCurrency = useDefaultCurrency();

  const [bookId, setBookId] = useState<string | 'all'>(route.params?.bookId ?? 'all');
  const [tf, setTf] = useState<Timeframe>('all');

  const filtered = useMemo(
    () => filterExpenses(expenses, { bookId: bookId === 'all' ? null : bookId, tf }),
    [expenses, bookId, tf]
  );
  const catSlices = useMemo(() => byCategory(filtered, categories), [filtered, categories]);
  const bookSlices = useMemo(() => byBook(filtered, books), [filtered, books]);
  const dayBars = useMemo(() => byDay(filtered), [filtered]);

  const tfLabel = TIMEFRAMES.find((t) => t.key === tf)?.label.toLowerCase() ?? 'all time';

  return (
    <Screen>
      <Header
        title="Stats"
        leftIcon={route.params?.bookId ? 'back' : 'menu'}
        onLeft={() =>
          route.params?.bookId ? navigation.goBack() : nav.dispatch(DrawerActions.openDrawer())
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Filter card */}
        <View style={styles.filterCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookTags}>
            <BookTag label="All books" active={bookId === 'all'} onPress={() => setBookId('all')} />
            {books.map((b) => (
              <BookTag
                key={b.id}
                label={b.name}
                active={bookId === b.id}
                onPress={() => setBookId(b.id)}
              />
            ))}
          </ScrollView>
          <Segmented
            scroll
            options={TIMEFRAMES}
            value={tf}
            onChange={(v) => setTf(v as Timeframe)}
          />
        </View>

        {/* Total */}
        <View style={styles.totalWrap}>
          <AppText size={11} color={textMuted}>
            Total spent · {tfLabel}
          </AppText>
          <AppText variant="heading" size={32}>
            {formatAmount(total(filtered), defaultCurrency)}
          </AppText>
        </View>

        {filtered.length === 0 ? (
          <AppText size={14} color={textMuted} style={{ textAlign: 'center', marginTop: 30 }}>
            No expenses in this range.
          </AppText>
        ) : (
          <View style={{ paddingHorizontal: space[3] }}>
            <SectionLabel>By category</SectionLabel>
            <BarList slices={catSlices} currency={defaultCurrency} />

            {bookId === 'all' && (
              <>
                <SectionLabel>By book</SectionLabel>
                <BarList slices={bookSlices} currency={defaultCurrency} />
              </>
            )}

            <SectionLabel>By day · last 7 days</SectionLabel>
            <View style={styles.chart}>
              {dayBars.map((d) => (
                <View key={d.key} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[styles.bar, { height: `${d.pct}%`, backgroundColor: colors.accentRamp[500] }]}
                    />
                  </View>
                  <AppText size={9} color={textMuted}>
                    {d.label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

function BookTag({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.bookTag, active ? styles.bookTagOn : styles.bookTagOff]}
    >
      <AppText size={11} variant={active ? 'medium' : 'body'} color={active ? colors.bg : colors.neutral[800]}>
        {label}
      </AppText>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <AppText variant="bold" size={11} color={textMuted} style={styles.sectionLabel}>
      {String(children).toUpperCase()}
    </AppText>
  );
}

function BarList({ slices, currency }: { slices: Slice[]; currency: string }) {
  return (
    <View style={{ gap: 9, marginBottom: 20 }}>
      {slices.map((s) => (
        <View key={s.key}>
          <View style={styles.barRow}>
            <View style={styles.barLabel}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <AppText size={12.5}>{s.label}</AppText>
            </View>
            <AppText size={12.5} style={{ opacity: 0.75 }}>
              {formatAmount(s.amount, currency)} · {s.pct}%
            </AppText>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(2, s.pct)}%`, backgroundColor: s.color }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterCard: {
    marginHorizontal: space[3],
    marginBottom: 14,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: 12,
  },
  bookTags: { gap: 8 },
  bookTag: { paddingVertical: 4, paddingHorizontal: 11, borderRadius: radius.pill, borderWidth: 1 },
  bookTagOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  bookTagOff: { backgroundColor: colors.neutral[100], borderColor: 'transparent' },
  totalWrap: { alignItems: 'center', marginBottom: 18 },
  sectionLabel: { letterSpacing: 1, marginBottom: 8 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.surface, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 110, marginBottom: 10 },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: '100%', flex: 1, justifyContent: 'flex-end' },
  bar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6, minHeight: 2 },
});
