import { useEffect } from 'react';
import { subscribeKitchenOrders } from '../services/orders.service';
import { useOrderStore } from '../store';
import { Order } from '../types';

export function useKitchenQueue(): Order[] {
  const { setActiveOrders, activeOrders } = useOrderStore();

  useEffect(() => {
    const unsub = subscribeKitchenOrders((orders) => setActiveOrders(orders));
    return unsub;
  }, []);

  return Object.values(activeOrders).sort(
    (a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0)
  );
}
