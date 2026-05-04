import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Order, OrderStatus, OrderItem, CartItem } from '../types';

function calcTotals(items: CartItem[]): { subtotal: number; serviceCharge: number; total: number } {
  const subtotal = items.reduce((s, i) => s + i.menuItem.price * i.qty, 0);
  const serviceCharge = Math.round(subtotal * 0.1);
  return { subtotal, serviceCharge, total: subtotal + serviceCharge };
}

export async function submitOrder(
  tableId: string,
  tableNumber: number,
  serverId: string,
  cartItems: CartItem[],
  notes?: string
): Promise<string> {
  const { subtotal, serviceCharge, total } = calcTotals(cartItems);
  const items: OrderItem[] = cartItems.map((ci) => ({
    menuItemId: ci.menuItem.id,
    nameTh: ci.menuItem.nameTh,
    qty: ci.qty,
    price: ci.menuItem.price,
    note: ci.note,
    status: 'pending',
  }));

  const ref = await addDoc(collection(db, 'orders'), {
    tableId,
    tableNumber,
    serverId,
    status: 'submitted',
    items,
    createdAt: serverTimestamp(),
    submittedAt: serverTimestamp(),
    subtotal,
    serviceCharge,
    total,
    notes: notes ?? '',
    source: 'server',
  });
  return ref.id;
}

export function subscribeKitchenOrders(callback: (orders: Order[]) => void): () => void {
  const q = query(
    collection(db, 'orders'),
    where('status', 'in', ['submitted', 'cooking', 'ready']),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const extra: Record<string, unknown> = { status };
  if (status === 'ready') extra.readyAt = serverTimestamp();
  await updateDoc(doc(db, 'orders', orderId), extra);
}

export function subscribeTableOrder(
  tableId: string,
  callback: (order: Order | null) => void
): () => void {
  const q = query(
    collection(db, 'orders'),
    where('tableId', '==', tableId),
    where('status', 'not-in', ['paid', 'voided']),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
  return onSnapshot(q, (snap) => {
    if (snap.empty) {
      callback(null);
    } else {
      callback({ id: snap.docs[0].id, ...snap.docs[0].data() } as Order);
    }
  });
}

export function subscribeAllActiveOrders(callback: (orders: Order[]) => void): () => void {
  const q = query(
    collection(db, 'orders'),
    where('status', 'not-in', ['paid', 'voided']),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
  });
}
