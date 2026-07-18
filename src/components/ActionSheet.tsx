import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, divider } from '../theme';
import AppText from './AppText';
import Icon, { IconName } from './Icon';
import Sheet from './Sheet';

export type Action = {
  key: string;
  label: string;
  icon: IconName;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: Action[];
};

/** A bottom sheet listing tappable actions (Edit / Archive / Delete, …). */
export default function ActionSheet({ visible, onClose, title, actions }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <View>
        {actions.map((a, i) => (
          <Pressable
            key={a.key}
            onPress={() => {
              onClose();
              // let the sheet dismiss before running the action
              requestAnimationFrame(a.onPress);
            }}
            style={[styles.row, i > 0 && styles.divider]}
          >
            <Icon
              name={a.icon}
              size={20}
              color={a.destructive ? colors.accentRamp[700] : colors.text}
            />
            <AppText size={15} color={a.destructive ? colors.accentRamp[700] : colors.text}>
              {a.label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15 },
  divider: { borderTopWidth: 1, borderTopColor: divider },
});
