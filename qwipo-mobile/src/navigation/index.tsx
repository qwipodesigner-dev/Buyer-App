import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';

import { colors, fontSize, fontWeight } from '../theme/tokens';
import { Icon } from '../components/Icons';
import HomeScreen from '../screens/HomeScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// Placeholder screens — will be ported in subsequent turns.
function Placeholder({ title }: { title: string }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderTitle}>{title}</Text>
      <Text style={styles.placeholderSub}>Screen port in progress</Text>
    </View>
  );
}

const ReorderScreen = () => <Placeholder title="Reorder" />;
const CartScreen = () => <Placeholder title="Your cart" />;
const ProfileScreen = () => <Placeholder title="My account" />;

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 24,
          height: 78,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.micro,
          fontWeight: fontWeight.medium,
        },
        tabBarIcon: ({ color }) => {
          const size = 22;
          if (route.name === 'Home') return <Icon.Home size={size} color={color} />;
          if (route.name === 'Reorder') return <Icon.Reorder size={size} color={color} />;
          if (route.name === 'Cart') return <Icon.Cart size={size} color={color} />;
          return <Icon.Profile size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reorder" component={ReorderScreen} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarBadge: 4 }} />
      <Tab.Screen name="Account" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  placeholderSub: {
    fontSize: fontSize.sm,
    color: colors.mutedFg,
    marginTop: 8,
  },
});
