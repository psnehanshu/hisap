import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { colors, divider } from '../theme';
import AppText from './AppText';
import Icon from './Icon';
import Sheet from './Sheet';

export type PickerOption = { key: string; label: string; sublabel?: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption[];
  selected?: string;
  onSelect: (key: string) => void;
};

/** A simple list-of-options bottom sheet (currency, book selector, etc.). */
export default function PickerSheet({ visible, onClose, title, options, selected, onSelect }: Props) {
  return (
    <Sheet visible={visible} onClose={onClose} title={title}>
      <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
        {options.map((o) => {
          const active = o.key === selected;
          return (
            <Pressable
              key={o.key}
              onPress={() => {
                onSelect(o.key);
                onClose();
              }}
              style={styles.row}
            >
              <View style={{ flex: 1 }}>
                <AppText size={15} variant={active ? 'medium' : 'body'}>
                  {o.label}
                </AppText>
                {o.sublabel != null && (
                  <AppText size={12} muted>
                    {o.sublabel}
                  </AppText>
                )}
              </View>
              {active && <Icon name="check" size={20} color={colors.accent} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: divider,
  },
});
