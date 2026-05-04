export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  RoleSelector: undefined;
};

export type ServerStackParamList = {
  TableMap: undefined;
  Menu: { tableId: string; tableNumber: number };
  Cart: { tableId: string; tableNumber: number };
};

export type KitchenStackParamList = {
  KDS: undefined;
};

export type CashierStackParamList = {
  CashierHome: undefined;
  Checkout: { tableId: string; orderId: string; tableNumber: number };
};

export type OwnerTabParamList = {
  MenuManagement: undefined;
  Dashboard: undefined;
  Logout: undefined;
};
