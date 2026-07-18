import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { colors, divider, radius } from '../theme';
import AppText from './AppText';

type Option<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  scroll?: boolean;
};

export default function Segmented<T extends string>({ options, value, onChange, scroll }: Props<T>) {
  const row = (
    <View style={styles.seg}>
      {options.map((o, i) => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.opt, i > 0 && styles.divider, active && styles.active]}
          >
            <AppText size={13} variant={active ? 'medium' : 'body'} color={active ? colors.bg : colors.text}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
  if (scroll) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 0 }}>
        {row}
      </ScrollView>
    );
  }
  return row;
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: divider,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  opt: { paddingVertical: 7, paddingHorizontal: 14 },
  divider: { borderLeftWidth: 1, borderLeftColor: divider },
  active: { backgroundColor: colors.accent },
});
