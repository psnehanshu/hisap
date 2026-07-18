import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, divider, fonts, radius, space } from '../theme';
import AppText from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  block?: boolean;
  disabled?: boolean;
  height?: number;
  color?: string;
  left?: React.ReactNode;
  style?: ViewStyle;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  block,
  disabled,
  height,
  color,
  left,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && !disabled && pressedStyle[variant],
        block && styles.block,
        height != null && { height, paddingVertical: 0 },
        disabled && styles.disabled,
        style,
      ]}
    >
      {left}
      <AppText
        style={[
          styles.label,
          { color: color ?? (variant === 'primary' ? colors.bg : variant === 'ghost' ? colors.accent : colors.text) },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: space[2],
    paddingHorizontal: space[3] * 1.2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { borderColor: divider },
  ghost: { paddingHorizontal: space[1], borderColor: 'transparent' },
  block: { width: '100%' },
  disabled: { opacity: 0.45 },
  label: { fontFamily: fonts.body, fontSize: 14, lineHeight: 18 },
});

// pressed tints from the accent ramp
const pressedStyle = StyleSheet.create({
  primary: { backgroundColor: colors.accentRamp[700] },
  secondary: { backgroundColor: '#201e1d24' },
  ghost: { backgroundColor: '#c671391f' },
});
