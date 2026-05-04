import { useEffect, useState } from 'react';
import { subscribeTableOrder } from '../services/orders.service';
import { Order } from '../types';

export function useRealtimeOrders(tableId: string): Order | null {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const unsub = subscribeTableOrder(tableId, setOrder);
    return unsub;
  }, [tableId]);

  return order;
}
