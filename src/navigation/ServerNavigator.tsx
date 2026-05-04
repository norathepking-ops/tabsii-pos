import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ServerStackParamList } from '../types';
import TableMapScreen from '../screens/server/TableMapScreen';
import MenuScreen from '../screens/server/MenuScreen';
import CartScreen from '../screens/server/CartScreen';

const Stack = createStackNavigator<ServerStackParamList>();

export default function ServerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="TableMap" component={TableMapScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
}
