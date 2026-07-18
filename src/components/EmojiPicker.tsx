import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ALL_EMOJI, EMOJI_GROUPS } from '../data/emoji';
import { colors, divider, radius } from '../theme';
import { Input } from './Field';
import Sheet from './Sheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
};

/** Shared emoji picker dialog — opens from category & book icon fields. */
export default function EmojiPicker({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState(EMOJI_GROUPS[0].key);

  const list = useMemo(() => {
    if (query.trim()) return ALL_EMOJI;
    return EMOJI_GROUPS.find((g) => g.key === group)?.emoji ?? [];
  }, [query, group]);

  const pick = (e: string) => {
    onSelect(e);
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Choose an icon" heightFraction={0.82}>
      <Input
        placeholder="Search all emoji…"
        value={query}
        onChangeText={setQuery}
        style={{ marginBottom: 10 }}
      />
      {!query.trim() && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
        >
          {EMOJI_GROUPS.map((g) => (
            <Pressable
              key={g.key}
              onPress={() => setGroup(g.key)}
              style={[styles.tab, g.key === group && styles.tabActive]}
            >
              <Text style={{ fontSize: 16 }}>{g.icon}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {list.map((e, i) => (
          <Pressable key={`${e}-${i}`} onPress={() => pick(e)} style={styles.cell}>
            <Text style={{ fontSize: 22 }}>{e}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  tabs: { flexGrow: 0, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: divider },
  tabsContent: { gap: 6, paddingBottom: 8 },
  tab: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  tabActive: { backgroundColor: colors.accentRamp[100] },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 20,
  },
  cell: {
    width: '12.2%',
    aspectRatio: 1,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
