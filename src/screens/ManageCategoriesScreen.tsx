import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import Avatar from '../components/Avatar';
import Fab from '../components/Fab';
import Icon from '../components/Icon';
import { Header, Screen } from '../components/Screen';
import Tag from '../components/Tag';
import { useCategories } from '../db/queries';
import { deleteCategory } from '../db/mutations';
import { colors, divider, space } from '../theme';
import type { StackParamList } from '../navigation/types';
import type { Category } from '../types';

type Props = NativeStackScreenProps<StackParamList, 'ManageCategories'>;

export default function ManageCategoriesScreen({ navigation }: Props) {
  const categories = useCategories();

  const confirmDelete = (c: Category) =>
    Alert.alert('Delete category', `Delete “${c.label}”? Expenses keep their record but lose this label.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(c.id) },
    ]);

  return (
    <Screen>
      <Header title="Categories" leftIcon="back" onLeft={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            style={styles.row}
            onPress={() => navigation.navigate('CategoryEdit', { categoryId: c.id })}
          >
            <Avatar emoji={c.emoji} size={38} />
            <AppText size={14} style={{ flex: 1 }}>
              {c.label}
            </AppText>
            {c.builtin ? (
              <Tag label="Built-in" variant="neutral" />
            ) : (
              <Pressable onPress={() => confirmDelete(c)} hitSlop={8} style={{ padding: 4 }}>
                <Icon name="trash" size={18} color={colors.accentRamp[700]} />
              </Pressable>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <Fab onPress={() => navigation.navigate('CategoryEdit', {})} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space[4], paddingBottom: 100 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: divider,
  },
});
