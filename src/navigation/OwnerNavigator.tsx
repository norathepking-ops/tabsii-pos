import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { OwnerTabParamList } from '../types';
import { Colors, FontFamily } from '../theme';
import MenuManagementScreen from '../screens/owner/MenuManagementScreen';
import DashboardScreen from '../screens/owner/DashboardScreen';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export default function OwnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.paper, borderTopColor: Colors.paper3 },
        tabBarActiveTintColor: Colors.emerald,
        tabBarInactiveTintColor: Colors.ink4,
        tabBarLabelStyle: { fontFamily: FontFamily.thaiMedium, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="MenuManagement"
        component={MenuManagementScreen}
        options={{
          tabBarLabel: 'เมนู',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🍜</Text>,
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'ยอดขาย',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📊</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
