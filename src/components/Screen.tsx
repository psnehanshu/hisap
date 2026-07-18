import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '../theme';
import AppText from './AppText';
import Icon, { IconName } from './Icon';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

type HeaderProps = {
  title?: string;
  titleSize?: number;
  leftIcon?: IconName;
  onLeft?: () => void;
  right?: React.ReactNode;
  large?: boolean;
};

/** Top bar: a left icon (back / menu), a Caprasimo title, optional right slot. */
export function Header({ title, titleSize, leftIcon, onLeft, right, large }: HeaderProps) {
  return (
    <View style={[styles.header, large && styles.headerLarge]}>
      {leftIcon && (
        <Pressable onPress={onLeft} hitSlop={10} style={styles.iconBtn}>
          <Icon name={leftIcon} size={22} />
        </Pressable>
      )}
      {title != null && (
        <AppText variant="heading" size={titleSize ?? (large ? 24 : 19)} style={{ flex: 1 }}>
          {title}
        </AppText>
      )}
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: space[3],
    paddingTop: space[2],
    paddingBottom: space[1],
  },
  headerLarge: { paddingHorizontal: space[4], paddingTop: space[3] },
  iconBtn: { paddingVertical: 2 },
});
