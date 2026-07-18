import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow, space } from '../theme';

type Props = {
  children: React.ReactNode;
  row?: boolean;
  elevated?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
};

export default function Card({ children, row, elevated, onPress, style, padding }: Props) {
  const content = (
    <View
      style={[
        styles.card,
        row && styles.row,
        elevated && shadow.sm,
        padding != null && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.85 }}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    gap: space[2],
    padding: space[3],
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
