import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import EmojiPicker from '../components/EmojiPicker';
import { Field, Input } from '../components/Field';
import { Header, Screen } from '../components/Screen';
import { getBookById } from '../db/queries';
import { addBook, archiveBook, updateBook } from '../db/mutations';
import { colors, space } from '../theme';
import type { StackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'BookEdit'>;

const SWATCHES = [
  colors.accentRamp[600],
  colors.accent2Ramp[700],
  colors.accentRamp[800],
  colors.neutral[800],
  colors.accent2Ramp[500],
];

export default function BookEditScreen({ navigation, route }: Props) {
  const bookId = route.params?.bookId;
  const editing = bookId ? getBookById(bookId) : undefined;

  const [name, setName] = useState(editing?.name ?? '');
  const [emoji, setEmoji] = useState(editing?.emoji ?? '✈️');
  const [color, setColor] = useState(editing?.color ?? SWATCHES[0]);
  const [pickEmoji, setPickEmoji] = useState(false);

  const save = () => {
    if (!name.trim()) return;
    if (editing) updateBook(editing.id, { name: name.trim(), emoji, color });
    else addBook({ name: name.trim(), emoji, color });
    navigation.goBack();
  };

  const archive = () => {
    if (editing) {
      archiveBook(editing.id);
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <Header title={editing ? 'Edit book' : 'New book'} leftIcon="back" onLeft={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Pressable onPress={() => setPickEmoji(true)}>
            <Avatar emoji={emoji} size={76} bg={color} />
          </Pressable>
        </View>

        <Field label="Book name">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable onPress={() => setPickEmoji(true)}>
              <Avatar emoji={emoji} size={44} bg={color} />
            </Pressable>
            <Input value={name} onChangeText={setName} placeholder="e.g. Bali Trip" flex autoFocus={!editing} />
          </View>
        </Field>

        <View style={{ marginTop: 14 }}>
          <Field label="Color">
            <View style={{ flexDirection: 'row', gap: 12, paddingTop: 2 }}>
              {SWATCHES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[styles.swatchRing, color === c && { borderColor: c }]}
                >
                  <View style={[styles.swatch, { backgroundColor: c }]} />
                </Pressable>
              ))}
            </View>
          </Field>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Save book" onPress={save} disabled={!name.trim()} block height={48} />
        {editing && (
          <Button
            label="Archive book"
            variant="ghost"
            block
            color={colors.accentRamp[700]}
            onPress={archive}
          />
        )}
      </View>

      <EmojiPicker visible={pickEmoji} onClose={() => setPickEmoji(false)} onSelect={setEmoji} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space[4], paddingTop: 14 },
  hero: { alignItems: 'center', marginBottom: 20 },
  swatchRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: { width: 26, height: 26, borderRadius: 13 },
  footer: { paddingHorizontal: space[4], paddingTop: 12, paddingBottom: 24, gap: 10 },
});
