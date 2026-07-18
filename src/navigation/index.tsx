import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AllBooksScreen from '../screens/AllBooksScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookEditScreen from '../screens/BookEditScreen';
import CategoryEditScreen from '../screens/CategoryEditScreen';
import ManageCategoriesScreen from '../screens/ManageCategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import { colors } from '../theme';
import DrawerContent from './DrawerContent';
import type { DrawerParamList, StackParamList } from './types';

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    primary: colors.accent,
    border: colors.surface,
  },
};

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
      <Stack.Screen name="Home" component={BookDetailScreen} />
      <Stack.Screen name="AllBooks" component={AllBooksScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="BookEdit" component={BookEditScreen} />
      <Stack.Screen name="CategoryEdit" component={CategoryEditScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer theme={navTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { backgroundColor: colors.surface, width: '78%', maxWidth: 320 },
        }}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
