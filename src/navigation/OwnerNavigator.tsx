import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity } from 'react-native';
import { OwnerTabParamList } from '../types';
import { Colors, FontFamily } from '../theme';
import { useAuthStore } from '../store';
import { signOut } from '../services/auth.service';
import MenuManagementScreen from '../screens/owner/MenuManagementScreen';
import DashboardScreen from '../screens/owner/DashboardScreen';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

function LogoutScreen() { return null; }

export default function OwnerNavigator() {
  const logout = useAuthStore((s) => s.logout);

  async function handleLogout() {
    await signOut();
    logout();
  }

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
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          tabBarLabel: 'ออก',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🚪</Text>,
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={handleLogout} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
