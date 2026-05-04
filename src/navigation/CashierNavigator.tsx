import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CashierStackParamList } from '../types';
import CashierHomeScreen from '../screens/cashier/CashierHomeScreen';
import CheckoutScreen from '../screens/cashier/CheckoutScreen';

const Stack = createStackNavigator<CashierStackParamList>();

export default function CashierNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CashierHome" component={CashierHomeScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
