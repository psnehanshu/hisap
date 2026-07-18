import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/AppText';
import Icon, { IconName } from '../components/Icon';
import { colors, divider, radius, space, textFaint, textMuted } from '../theme';

type Item = { key: string; label: string; icon: IconName; target: string };

const ITEMS: Item[] = [
  { key: 'books', label: 'Books', icon: 'wallet', target: 'Home' },
  { key: 'stats', label: 'Stats', icon: 'stats', target: 'Stats' },
  { key: 'settings', label: 'Settings', icon: 'settings', target: 'Settings' },
];

const ACTIVE_FOR: Record<string, string> = {
  Home: 'books',
  AllBooks: 'books',
  AddExpense: 'books',
  BookEdit: 'books',
  Stats: 'stats',
  Settings: 'settings',
  ManageCategories: 'settings',
};

export default function DrawerContent(props: DrawerContentComponentProps) {
  const stackState = props.state.routes[0]?.state as { routes: { name: string }[]; index?: number } | undefined;
  const current = stackState?.routes?.[stackState.index ?? 0]?.name ?? 'Home';
  const activeKey = ACTIVE_FOR[current] ?? 'books';
  const insets = useSafeAreaInsets();

  const go = (target: string) => {
    props.navigation.closeDrawer();
    props.navigation.navigate('Main', { screen: target });
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + space[3], paddingBottom: insets.bottom + space[6] },
      ]}
    >
      <View style={styles.brand}>
        <View style={styles.brandIcon}>
          <Icon name="card" size={18} color={colors.bg} />
        </View>
        <AppText variant="heading" size={18}>
          Hisap
        </AppText>
      </View>

      <View style={styles.items}>
        {ITEMS.map((it) => {
          const on = it.key === activeKey;
          return (
            <Pressable
              key={it.key}
              onPress={() => go(it.target)}
              style={[styles.item, on && styles.itemActive]}
            >
              <Icon name={it.icon} size={18} color={on ? colors.accentRamp[800] : textMuted} />
              <AppText
                size={14}
                variant={on ? 'medium' : 'body'}
                color={on ? colors.accentRamp[800] : textMuted}
              >
                {it.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />
      <AppText size={11} color={textFaint} style={styles.footer}>
        v1.0 · Offline
      </AppText>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingTop: 24, paddingBottom: 24 },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: space[4],
    paddingBottom: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: divider,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentRamp[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  items: { paddingHorizontal: 12, gap: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  itemActive: { backgroundColor: colors.accentRamp[100] },
  footer: { paddingHorizontal: space[4] },
});
