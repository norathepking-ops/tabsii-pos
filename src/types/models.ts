import { Timestamp } from 'firebase/firestore';

export type TableStatus = 'free' | 'busy' | 'paying' | 'reserved';
export type TableSection = 'floor1' | 'floor2' | 'patio';

export interface Table {
  id: string;
  number: number;
  section: TableSection;
  seats: number;
  status: TableStatus;
  openedAt?: Timestamp;
  orderId?: string;
  reservedFor?: string;
}

export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'cooking'
  | 'ready'
  | 'served'
  | 'paid'
  | 'voided';

export type ItemStatus = 'pending' | 'cooking' | 'ready' | 'served';

export interface OrderItem {
  menuItemId: string;
  qty: number;
  price: number;
  note?: string;
  status: ItemStatus;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  serverId: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Timestamp;
  submittedAt?: Timestamp;
  readyAt?: Timestamp;
  subtotal: number;
  serviceCharge: number;
  total: number;
  notes?: string;
  source: 'server' | 'customer-qr';
}

export type StockLevel = 'high' | 'low' | 'out';

export interface MenuItem {
  id: string;
  nameTh: string;
  nameEn: string;
  category: string;
  price: number;
  thumbnail?: string;
  active: boolean;
  stock: StockLevel;
  isHot?: boolean;
  sortOrder?: number;
}

export type UserRole = 'server' | 'kitchen' | 'cashier' | 'owner';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface CartItem {
  menuItem: MenuItem;
  qty: number;
  note?: string;
}
