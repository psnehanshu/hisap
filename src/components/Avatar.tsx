import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

type Props = {
  emoji: string;
  size?: number;
  bg?: string;
  style?: ViewStyle;
};

/** Soft circular emoji avatar — the recurring book/category shape. */
export default function Avatar({ emoji, size = 40, bg = colors.accentRamp[100], style }: Props) {
  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.46 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
