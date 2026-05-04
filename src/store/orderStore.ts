import { create } from 'zustand';
import { Order, CartItem, MenuItem } from '../types';

interface OrderState {
  activeOrders: Record<string, Order>;
  setActiveOrders: (orders: Order[]) => void;

  cart: CartItem[];
  cartTableId: string | null;
  cartTableNumber: number | null;

  initCart: (tableId: string, tableNumber: number) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartQty: (menuItemId: string, qty: number) => void;
  updateCartNote: (menuItemId: string, note: string) => void;
  clearCart: () => void;

  getCartTotal: () => number;
  getCartCount: () => number;
  getCartSubtotal: () => number;
  getCartServiceCharge: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  activeOrders: {},
  setActiveOrders: (orders) => {
    const map: Record<string, Order> = {};
    orders.forEach((o) => (map[o.id] = o));
    set({ activeOrders: map });
  },

  cart: [],
  cartTableId: null,
  cartTableNumber: null,

  initCart: (tableId, tableNumber) =>
    set({ cartTableId: tableId, cartTableNumber: tableNumber, cart: [] }),

  addToCart: (item) =>
    set((s) => {
      const existing = s.cart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return {
          cart: s.cart.map((c) =>
            c.menuItem.id === item.id ? { ...c, qty: c.qty + 1 } : c
          ),
        };
      }
      return { cart: [...s.cart, { menuItem: item, qty: 1 }] };
    }),

  removeFromCart: (menuItemId) =>
    set((s) => ({ cart: s.cart.filter((c) => c.menuItem.id !== menuItemId) })),

  updateCartQty: (menuItemId, qty) =>
    set((s) => {
      if (qty <= 0) return { cart: s.cart.filter((c) => c.menuItem.id !== menuItemId) };
      return {
        cart: s.cart.map((c) => (c.menuItem.id === menuItemId ? { ...c, qty } : c)),
      };
    }),

  updateCartNote: (menuItemId, note) =>
    set((s) => ({
      cart: s.cart.map((c) => (c.menuItem.id === menuItemId ? { ...c, note } : c)),
    })),

  clearCart: () => set({ cart: [], cartTableId: null, cartTableNumber: null }),

  getCartSubtotal: () => {
    const { cart } = get();
    return cart.reduce((s, i) => s + i.menuItem.price * i.qty, 0);
  },
  getCartServiceCharge: () => {
    return Math.round(get().getCartSubtotal() * 0.1);
  },
  getCartTotal: () => {
    const sub = get().getCartSubtotal();
    return sub + Math.round(sub * 0.1);
  },
  getCartCount: () => {
    return get().cart.reduce((s, i) => s + i.qty, 0);
  },
}));
