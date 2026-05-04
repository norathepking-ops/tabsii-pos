import React from 'react';
import { useAuthStore } from '../store';
import ServerNavigator from './ServerNavigator';
import KitchenNavigator from './KitchenNavigator';
import CashierNavigator from './CashierNavigator';
import OwnerNavigator from './OwnerNavigator';

export default function AppNavigator() {
  const role = useAuthStore((s) => s.user?.role);

  switch (role) {
    case 'server':
      return <ServerNavigator />;
    case 'kitchen':
      return <KitchenNavigator />;
    case 'cashier':
      return <CashierNavigator />;
    case 'owner':
      return <OwnerNavigator />;
    default:
      return <ServerNavigator />;
  }
}
