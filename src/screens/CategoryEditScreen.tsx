import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import EmojiPicker from '../components/EmojiPicker';
import { Field, Input } from '../components/Field';
import { Header, Screen } from '../components/Screen';
import { getCategoryById } from '../db/queries';
import { addCategory, updateCategory } from '../db/mutations';
import { colors, space } from '../theme';
import type { StackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<StackParamList, 'CategoryEdit'>;

export default function CategoryEditScreen({ navigation, route }: Props) {
  const categoryId = route.params?.categoryId;
  const selectForExpense = route.params?.selectForExpense ?? false;
  const editing = categoryId ? getCategoryById(categoryId) : undefined;

  const [name, setName] = useState(editing?.label ?? '');
  const [emoji, setEmoji] = useState(editing?.emoji ?? '🏷️');
  const [pickEmoji, setPickEmoji] = useState(false);

  const save = () => {
    if (!name.trim()) return;
    if (editing) {
      updateCategory(editing.id, { label: name.trim(), emoji });
      navigation.goBack();
      return;
    }
    const id = addCategory({ label: name.trim(), emoji, color: colors.accentRamp[600] });
    if (selectForExpense) {
      // Hand the new category back to the add/edit expense screen and pop to it.
      navigation.navigate({ name: 'AddExpense', params: { createdCategoryId: id }, merge: true });
    } else {
      navigation.goBack();
    }
  };

  return (
    <Screen>
      <Header
        title={editing ? 'Edit category' : 'New category'}
        leftIcon="back"
        onLeft={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Pressable onPress={() => setPickEmoji(true)}>
            <Avatar emoji={emoji} size={76} bg={colors.accentRamp[600]} />
          </Pressable>
        </View>

        <Field label="Name">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable onPress={() => setPickEmoji(true)}>
              <Avatar emoji={emoji} size={44} bg={colors.accentRamp[600]} />
            </Pressable>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="e.g. Pet Care"
              flex
              autoFocus={!editing}
            />
          </View>
        </Field>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={editing ? 'Save changes' : 'Create category'}
          onPress={save}
          disabled={!name.trim()}
          block
          height={48}
        />
      </View>

      <EmojiPicker visible={pickEmoji} onClose={() => setPickEmoji(false)} onSelect={setEmoji} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space[4], paddingTop: 14 },
  hero: { alignItems: 'center', marginBottom: 20 },
  footer: { paddingHorizontal: space[4], paddingTop: 12, paddingBottom: 24 },
});
