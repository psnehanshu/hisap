import { DrawerActions, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import Icon from '../components/Icon';
import PickerSheet from '../components/PickerSheet';
import { Header, Screen } from '../components/Screen';
import { useAllBooks, useCategories, useDefaultCurrency, useExpenses } from '../db/queries';
import { resetToSeed, setDefaultCurrency } from '../db/mutations';
import { colors, divider, space, textMuted } from '../theme';
import { CURRENCIES, currencySymbol } from '../types';
import type { StackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const nav = useNavigation();
  const books = useAllBooks();
  const categories = useCategories();
  const expenses = useExpenses();
  const defaultCurrency = useDefaultCurrency();
  const [pickCurrency, setPickCurrency] = useState(false);

  const exportCsv = async () => {
    const rows = [['Date', 'Book', 'Category', 'Description', 'Amount', 'Currency']];
    const bookName = (id: string) => books.find((b) => b.id === id)?.name ?? '';
    const catName = (id: string) => categories.find((c) => c.id === id)?.label ?? '';
    for (const e of [...expenses].sort((a, b) => +new Date(a.date) - +new Date(b.date))) {
      rows.push([
        new Date(e.date).toISOString(),
        bookName(e.bookId),
        catName(e.categoryId),
        e.description.replace(/,/g, ' '),
        e.amount.toFixed(2),
        e.currency,
      ]);
    }
    const csv = rows.map((r) => r.join(',')).join('\n');
    try {
      await Share.share({ message: csv, title: 'Hisap expenses.csv' });
    } catch {
      // user dismissed
    }
  };

  const confirmReset = () =>
    Alert.alert('Reset sample data', 'Replace all books, categories and expenses with the demo set?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetToSeed() },
    ]);

  const rows: {
    label: string;
    value?: string;
    onPress: () => void;
  }[] = [
    {
      label: 'Default currency',
      value: `${defaultCurrency} ${currencySymbol(defaultCurrency)}`,
      onPress: () => setPickCurrency(true),
    },
    {
      label: 'Manage categories',
      value: String(categories.length),
      onPress: () => navigation.navigate('ManageCategories'),
    },
    {
      label: 'Manage books',
      value: String(books.filter((b) => !b.archived).length),
      onPress: () => navigation.navigate('AllBooks'),
    },
    { label: 'Export data (CSV)', onPress: exportCsv },
    {
      label: 'Backup & restore',
      value: 'Local only',
      onPress: () =>
        Alert.alert('Backup & restore', 'Your data is stored on this device only and never leaves it.'),
    },
    {
      label: 'About',
      value: 'v1.0',
      onPress: () => Alert.alert('Hisap', 'Offline expense tracker · v1.0\nBuilt with the Organic design system.'),
    },
  ];

  return (
    <Screen>
      <Header title="Settings" large leftIcon="menu" onLeft={() => nav.dispatch(DrawerActions.openDrawer())} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <AppText variant="bold" size={11} color={textMuted} style={styles.section}>
          GENERAL
        </AppText>
        {rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} onPress={r.onPress} />
        ))}

        <AppText variant="bold" size={11} color={textMuted} style={styles.section}>
          DATA
        </AppText>
        <Row label="Reset sample data" value="" onPress={confirmReset} danger />
      </ScrollView>

      <PickerSheet
        visible={pickCurrency}
        onClose={() => setPickCurrency(false)}
        title="Default currency"
        options={CURRENCIES.map((c) => ({ key: c.code, label: `${c.code} ${c.symbol}` }))}
        selected={defaultCurrency}
        onSelect={setDefaultCurrency}
      />
    </Screen>
  );
}

function Row({
  label,
  value,
  onPress,
  danger,
}: {
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <AppText size={14} style={{ flex: 1 }} color={danger ? colors.accentRamp[700] : colors.text}>
        {label}
      </AppText>
      {!!value && (
        <AppText size={13} color={textMuted} style={{ marginRight: 6 }}>
          {value}
        </AppText>
      )}
      <Icon name="chevronRight" size={15} color={textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space[4], paddingBottom: 40 },
  section: { letterSpacing: 1, marginTop: 12, marginBottom: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: divider,
  },
});
