import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { KitchenStackParamList } from '../types';
import KDSScreen from '../screens/kitchen/KDSScreen';

const Stack = createStackNavigator<KitchenStackParamList>();

export default function KitchenNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KDS" component={KDSScreen} />
    </Stack.Navigator>
  );
}
