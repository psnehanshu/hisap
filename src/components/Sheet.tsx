import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors, radius, scrim, shadow, space } from '../theme';
import AppText from './AppText';
import Icon from './Icon';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Fraction of screen height (0–1). Omit to size to content. */
  heightFraction?: number;
};

/**
 * A bottom sheet over a scrim. The backdrop appears instantly and only fades
 * out on dismiss, while the panel itself slides up/down — so the two don't
 * travel together the way `Modal`'s built-in "slide" animation makes them.
 */
export default function Sheet({ visible, onClose, title, children, heightFraction }: Props) {
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      backdrop.setValue(1); // scrim shows instantly
      translateY.setValue(height);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 160,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!mounted) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { backgroundColor: scrim, opacity: backdrop }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            heightFraction != null && { height: `${heightFraction * 100}%` },
            { transform: [{ translateY }] },
          ]}
        >
          {title != null && (
            <View style={styles.header}>
              <AppText variant="heading" size={20} style={{ flex: 1 }}>
                {title}
              </AppText>
              <Pressable onPress={onClose} hitSlop={10}>
                <Icon name="close" size={22} />
              </Pressable>
            </View>
          )}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: space[4],
    paddingTop: space[4],
    paddingBottom: space[6],
    ...shadow.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space[3],
  },
});
