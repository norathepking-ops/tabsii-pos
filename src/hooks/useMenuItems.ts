import { useEffect } from 'react';
import { subscribeMenuItems } from '../services/menu.service';
import { useMenuStore } from '../store';
import { MenuItem } from '../types';

export function useMenuItems(): MenuItem[] {
  const { setItems, items } = useMenuStore();

  useEffect(() => {
    const unsub = subscribeMenuItems(setItems);
    return unsub;
  }, []);

  return items;
}
