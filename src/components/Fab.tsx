import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, shadow } from '../theme';
import Icon from './Icon';

export default function Fab({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && { backgroundColor: colors.accentRamp[700] }]}
    >
      <Icon name="plus" size={26} color={colors.bg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },
});
