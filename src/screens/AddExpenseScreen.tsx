import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AppText from '../components/AppText';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import CategoryPickerSheet from '../components/CategoryPickerSheet';
import { Field, Input } from '../components/Field';
import Icon from '../components/Icon';
import PickerSheet from '../components/PickerSheet';
import { Header, Screen } from '../components/Screen';
import { dateChipLabel, timeLabel } from '../lib/format';
import { getActiveBooks, getDefaultCurrency, getExpenseById, useCategories } from '../db/queries';
import { addExpense, deleteExpense, updateExpense } from '../db/mutations';
import { colors, divider, radius, space, textMuted } from '../theme';
import { CURRENCIES, currencySymbol } from '../types';
import type { StackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'AddExpense'>;

export default function AddExpenseScreen({ navigation, route }: Props) {
  const expenseId = route.params?.expenseId;
  const editing = expenseId ? getExpenseById(expenseId) : undefined;

  // Books can't change from this screen, so a one-shot snapshot is enough.
  const books = useMemo(() => getActiveBooks(), []);
  // Categories are live — a new one may be created via the CategoryEdit screen.
  const categories = useCategories();

  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [currency, setCurrency] = useState(editing?.currency ?? getDefaultCurrency());
  const [bookId, setBookId] = useState(editing?.bookId ?? route.params?.bookId ?? books[0]?.id);
  const [categoryId, setCategoryId] = useState<string | undefined>(editing?.categoryId);
  const [description, setDescription] = useState(editing?.description ?? '');
  const [date, setDate] = useState<Date>(editing ? new Date(editing.date) : new Date());

  const [pickBook, setPickBook] = useState(false);
  const [pickCurrency, setPickCurrency] = useState(false);
  const [pickCategory, setPickCategory] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // A category created on the CategoryEdit screen comes back as a route param.
  useEffect(() => {
    if (route.params?.createdCategoryId) {
      setCategoryId(route.params.createdCategoryId);
      navigation.setParams({ createdCategoryId: undefined });
    }
  }, [route.params?.createdCategoryId]);

  const book = books.find((b) => b.id === bookId);
  const category = categories.find((c) => c.id === categoryId);
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0;
  const canSave = numericAmount > 0 && !!categoryId && !!bookId;

  const save = () => {
    if (!canSave || !bookId || !categoryId) return;
    const payload = {
      bookId,
      categoryId,
      description: description.trim(),
      amount: Math.round(numericAmount * 100) / 100,
      currency,
      date: date.toISOString(),
    };
    if (editing) updateExpense(editing.id, payload);
    else addExpense(payload);
    navigation.goBack();
  };

  const remove = () => {
    if (editing) {
      deleteExpense(editing.id);
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <Header
        title={editing ? 'Edit expense' : 'New expense'}
        leftIcon="back"
        onLeft={() => navigation.goBack()}
        right={
          editing ? (
            <Pressable onPress={remove} hitSlop={10} style={{ padding: 4 }}>
              <Icon name="trash" size={20} color={colors.accentRamp[700]} />
            </Pressable>
          ) : undefined
        }
      />

      {/* Book selector */}
      <View style={styles.bookRow}>
        <AppText size={12} color={textMuted}>
          In
        </AppText>
        <Pressable style={styles.bookPill} onPress={() => setPickBook(true)}>
          <AppText size={13} variant="medium">
            {book?.name ?? 'Select book'}
          </AppText>
          <Icon name="chevronDown" size={14} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amount */}
        <View style={styles.amountWrap}>
          <View style={styles.amountRow}>
            <Pressable style={styles.currencyTag} onPress={() => setPickCurrency(true)}>
              <AppText variant="medium" size={13} color={colors.accent}>
                {currency} {currencySymbol(currency)}
              </AppText>
            </Pressable>
            <Input
              value={amount}
              onChangeText={(t) => setAmount(t.replace(/[^0-9.]/g, ''))}
              keyboardType="decimal-pad"
              placeholder="0.00"
              style={styles.amountInput}
            />
          </View>
          <AppText size={11} color={textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
            Tap currency to switch — default set in Settings
          </AppText>
        </View>

        {/* Category */}
        <Field label="Category">
          <Pressable style={styles.pill} onPress={() => setPickCategory(true)}>
            {category ? (
              <>
                <Avatar emoji={category.emoji} size={24} />
                <AppText size={14} style={{ flex: 1 }}>
                  {category.label}
                </AppText>
              </>
            ) : (
              <AppText size={14} color={textMuted} style={{ flex: 1 }}>
                Choose a category
              </AppText>
            )}
            <Icon name="chevronRight" size={16} />
          </Pressable>
        </Field>

        {/* Description */}
        <View style={{ marginTop: 14 }}>
          <Field label="Description">
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="What was it for?"
            />
          </Field>
        </View>

        {/* Date & time */}
        <View style={{ marginTop: 14 }}>
          <Field label="Date & time">
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable style={[styles.pill, { flex: 1 }]} onPress={() => setShowDate(true)}>
                <Icon name="calendar" size={16} />
                <AppText size={14}>{dateChipLabel(date.toISOString())}</AppText>
              </Pressable>
              <Pressable style={styles.pill} onPress={() => setShowTime(true)}>
                <Icon name="clock" size={16} />
                <AppText size={14}>{timeLabel(date.toISOString())}</AppText>
              </Pressable>
            </View>
          </Field>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Save expense" onPress={save} disabled={!canSave} block height={48} />
      </View>

      {/* Pickers */}
      <PickerSheet
        visible={pickBook}
        onClose={() => setPickBook(false)}
        title="Choose book"
        options={books.map((b) => ({ key: b.id, label: b.name }))}
        selected={bookId}
        onSelect={setBookId}
      />
      <PickerSheet
        visible={pickCurrency}
        onClose={() => setPickCurrency(false)}
        title="Currency"
        options={CURRENCIES.map((c) => ({ key: c.code, label: `${c.code} ${c.symbol}` }))}
        selected={currency}
        onSelect={setCurrency}
      />
      <CategoryPickerSheet
        visible={pickCategory}
        onClose={() => setPickCategory(false)}
        selectedId={categoryId}
        onSelect={setCategoryId}
        onCreateNew={() => {
          setPickCategory(false);
          navigation.navigate('CategoryEdit', { selectForExpense: true });
        }}
      />

      {showDate && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(_, d) => {
            setShowDate(Platform.OS === 'ios');
            if (d) {
              const next = new Date(date);
              next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
              setDate(next);
            }
          }}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={date}
          mode="time"
          onChange={(_, d) => {
            setShowTime(Platform.OS === 'ios');
            if (d) {
              const next = new Date(date);
              next.setHours(d.getHours(), d.getMinutes());
              setDate(next);
            }
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 44,
    paddingRight: 16,
    paddingBottom: 6,
  },
  bookPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingLeft: 12,
    paddingRight: 10,
  },
  body: { paddingHorizontal: space[4], paddingTop: 12, paddingBottom: 24 },
  amountWrap: { paddingVertical: 12 },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  currencyTag: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  amountInput: {
    fontFamily: 'Caprasimo_400Regular',
    fontSize: 44,
    minHeight: 64,
    minWidth: 120,
    maxWidth: 220,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: divider,
    borderRadius: radius.pill,
  },
  footer: { paddingHorizontal: space[4], paddingTop: 12, paddingBottom: 24 },
});
