import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useCategories } from '../db/queries';
import { colors, divider, radius } from '../theme';
import AppText from './AppText';
import Avatar from './Avatar';
import Icon from './Icon';
import Sheet from './Sheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedId?: string;
  onSelect: (id: string) => void;
  /** Fired when the "New category" tile is tapped — opens the create screen. */
  onCreateNew: () => void;
};

/** Category chooser as a bottom sheet. Creating a new category is a full screen. */
export default function CategoryPickerSheet({
  visible,
  onClose,
  selectedId,
  onSelect,
  onCreateNew,
}: Props) {
  const categories = useCategories();

  const choose = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Choose category" heightFraction={0.72}>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {categories.map((c) => {
          const on = c.id === selectedId;
          return (
            <Pressable
              key={c.id}
              onPress={() => choose(c.id)}
              style={[styles.tile, { borderColor: on ? colors.accent : divider }]}
            >
              <Avatar emoji={c.emoji} size={40} />
              <AppText size={11} style={styles.tileLabel} numberOfLines={2}>
                {c.label}
              </AppText>
            </Pressable>
          );
        })}
        <Pressable onPress={onCreateNew} style={[styles.tile, styles.tileDashed]}>
          <View style={styles.plusCircle}>
            <Icon name="plus" size={20} color={colors.accent} />
          </View>
          <AppText size={11} style={styles.tileLabel} color={colors.accentRamp[700]}>
            New category
          </AppText>
        </Pressable>
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 12 },
  tile: {
    width: '30.5%',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  tileDashed: { borderStyle: 'dashed', borderColor: divider },
  tileLabel: { textAlign: 'center', lineHeight: 14 },
  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
