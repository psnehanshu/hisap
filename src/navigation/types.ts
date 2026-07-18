import type { NavigatorScreenParams } from '@react-navigation/native';

export type StackParamList = {
  Home: { bookId?: string } | undefined;
  AllBooks: undefined;
  AddExpense: { expenseId?: string; bookId?: string; createdCategoryId?: string } | undefined;
  Stats: { bookId?: string } | undefined;
  BookEdit: { bookId?: string } | undefined;
  CategoryEdit: { categoryId?: string; selectForExpense?: boolean } | undefined;
  Settings: undefined;
  ManageCategories: undefined;
};

export type DrawerParamList = {
  Main: NavigatorScreenParams<StackParamList> | undefined;
};
