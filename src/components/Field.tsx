import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, divider, fonts, radius, textMuted } from '../theme';
import AppText from './AppText';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <AppText size={12} color={textMuted} style={styles.label}>
        {label}
      </AppText>
      {children}
    </View>
  );
}

type InputProps = TextInputProps & { flex?: boolean };

export function Input({ style, flex, ...rest }: InputProps) {
  return (
    <TextInput
      placeholderTextColor={textMuted}
      {...rest}
      style={[styles.input, flex && { flex: 1 }, style]}
    />
  );
}

/** A tappable pill that looks like an input but opens a picker. */
export function PillControl({
  children,
  onPress,
  bordered = true,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  bordered?: boolean;
}) {
  return (
    <View style={[styles.pill, bordered && styles.pillBordered]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 5 },
  label: { marginBottom: 1 },
  input: {
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: divider,
    borderRadius: radius.pill,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
  },
  pillBordered: { borderWidth: 1, borderColor: divider },
});
