import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { Distributor, Product, ProductVariant, Category } from '../types';

export type RootStackParamList = {
  Main: undefined;
  Storefront: { distributor?: Distributor };
  ProductListing: { category?: Category; isBrand?: boolean; brandName?: string };
  Cart: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Reorder: undefined;
  CartTab: undefined;
  Account: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;
