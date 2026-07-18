import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import ActionSheet, { Action } from '../components/ActionSheet';
import AppText from '../components/AppText';
import Avatar from '../components/Avatar';
import Card from '../components/Card';
import Fab from '../components/Fab';
import Icon from '../components/Icon';
import PickerSheet from '../components/PickerSheet';
import { Header, Screen } from '../components/Screen';
import { formatAmount } from '../lib/format';
import { filterExpenses, TIMEFRAMES, Timeframe, total } from '../lib/stats';
import { useActiveBooks, useDefaultCurrency, useExpenses } from '../db/queries';
import { archiveBook, deleteBook } from '../db/mutations';
import { colors, radius, space, textMuted } from '../theme';
import type { StackParamList } from '../navigation/types';
import type { Book } from '../types';

type Props = NativeStackScreenProps<StackParamList, 'AllBooks'>;

const TF_LABEL: Record<Timeframe, string> = {
  week: 'This week',
  month: 'This month',
  year: 'This year',
  all: 'All time',
  custom: 'Custom',
};

export default function AllBooksScreen({ navigation }: Props) {
  const books = useActiveBooks();
  const expenses = useExpenses();
  const defaultCurrency = useDefaultCurrency();
  const [tf, setTf] = useState<Timeframe>('month');
  const [pickTf, setPickTf] = useState(false);
  const [menuBook, setMenuBook] = useState<Book | null>(null);

  const bookActions = (b: Book): Action[] => [
    {
      key: 'edit',
      label: 'Edit book',
      icon: 'edit',
      onPress: () => navigation.navigate('BookEdit', { bookId: b.id }),
    },
    {
      key: 'archive',
      label: 'Archive book',
      icon: 'archive',
      onPress: () =>
        Alert.alert('Archive book', `Hide “${b.name}” from your books? Its expenses are kept.`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Archive', onPress: () => archiveBook(b.id) },
        ]),
    },
    {
      key: 'delete',
      label: 'Delete book',
      icon: 'trash',
      destructive: true,
      onPress: () =>
        Alert.alert(
          'Delete book',
          `Permanently delete “${b.name}” and all its expenses? This can't be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteBook(b.id) },
          ]
        ),
    },
  ];

  const grandTotal = useMemo(
    () => total(filterExpenses(expenses, { tf })),
    [expenses, tf]
  );

  const subtitle = (bookId: string) => {
    const items = expenses.filter((e) => e.bookId === bookId);
    return `${items.length} ${items.length === 1 ? 'expense' : 'expenses'}`;
  };
  const bookTotal = (bookId: string) =>
    total(expenses.filter((e) => e.bookId === bookId));

  return (
    <Screen>
      <Header title="All books" large leftIcon="back" onLeft={() => navigation.goBack()} />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <AppText size={12} color={textMuted}>
            Spent across all books
          </AppText>
          <Pressable style={styles.tfPill} onPress={() => setPickTf(true)}>
            <AppText size={12} variant="medium" color={colors.accentRamp[700]}>
              {TF_LABEL[tf]}
            </AppText>
            <Icon name="chevronDown" size={12} color={colors.accentRamp[700]} />
          </Pressable>
        </View>
        <AppText variant="heading" size={34}>
          {formatAmount(grandTotal, defaultCurrency)}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {books.map((b) => (
          <Card key={b.id} row elevated padding={16} style={{ gap: 8 }}>
            <Pressable
              style={styles.cardMain}
              onPress={() => navigation.navigate('Home', { bookId: b.id })}
              onLongPress={() => setMenuBook(b)}
              delayLongPress={250}
            >
              <Avatar emoji={b.emoji} size={44} bg={b.color} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <AppText variant="heading" size={17}>
                  {b.name}
                </AppText>
                <AppText size={11} color={textMuted} style={{ marginTop: 2 }}>
                  {subtitle(b.id)}
                </AppText>
              </View>
              <AppText variant="medium" size={15}>
                {formatAmount(bookTotal(b.id), defaultCurrency)}
              </AppText>
            </Pressable>
            <Pressable onPress={() => setMenuBook(b)} hitSlop={8} style={styles.kebab}>
              <Icon name="more" size={20} color={textMuted} />
            </Pressable>
          </Card>
        ))}
      </ScrollView>

      <Fab onPress={() => navigation.navigate('BookEdit', {})} />

      <PickerSheet
        visible={pickTf}
        onClose={() => setPickTf(false)}
        title="Timeframe"
        options={TIMEFRAMES.map((t) => ({ key: t.key, label: TF_LABEL[t.key] }))}
        selected={tf}
        onSelect={(k) => setTf(k as Timeframe)}
      />

      <ActionSheet
        visible={menuBook !== null}
        onClose={() => setMenuBook(null)}
        title={menuBook?.name}
        actions={menuBook ? bookActions(menuBook) : []}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { paddingHorizontal: space[4], paddingTop: 6 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  tfPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 2,
    paddingLeft: 10,
    paddingRight: 9,
  },
  list: { paddingHorizontal: space[4], paddingTop: 12, paddingBottom: 100, gap: 12 },
  cardMain: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 },
  kebab: { paddingHorizontal: 2, paddingVertical: 4, alignSelf: 'center' },
});
