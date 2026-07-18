import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { colors, fonts } from '../theme';

type Variant = 'heading' | 'body' | 'medium' | 'bold';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  size?: number;
  muted?: boolean;
};

const family: Record<Variant, string> = {
  heading: fonts.heading,
  body: fonts.body,
  medium: fonts.bodyMedium,
  bold: fonts.bodyBold,
};

/** Text with the Organic font families baked in. Caprasimo for headings. */
export default function AppText({
  variant = 'body',
  color = colors.text,
  size,
  muted,
  style,
  ...rest
}: Props) {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: family[variant], color: muted ? colors.text : color },
        muted && styles.muted,
        size != null && { fontSize: size },
        variant === 'heading' && styles.heading,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  heading: { letterSpacing: -0.2 },
  muted: { opacity: 0.55 },
});
