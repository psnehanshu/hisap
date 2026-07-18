import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';
import AppText from './AppText';

type Variant = 'accent' | 'accent2' | 'neutral' | 'outline' | 'solid';

type Props = {
  label: string;
  variant?: Variant;
  style?: ViewStyle;
};

export default function Tag({ label, variant = 'neutral', style }: Props) {
  const conf = variants[variant];
  return (
    <View style={[styles.base, conf.box, style]}>
      <AppText variant="medium" size={11} color={conf.fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

const variants: Record<Variant, { box: ViewStyle; fg: string }> = {
  accent: { box: { backgroundColor: colors.accentRamp[100] }, fg: colors.accentRamp[800] },
  accent2: { box: { backgroundColor: colors.accent2Ramp[100] }, fg: colors.accent2Ramp[800] },
  neutral: { box: { backgroundColor: colors.neutral[100] }, fg: colors.neutral[800] },
  outline: { box: { borderColor: colors.accent }, fg: colors.accent },
  solid: { box: { backgroundColor: colors.accent, borderColor: colors.accent }, fg: colors.bg },
};
