import { create } from 'zustand';
import { MenuItem } from '../types';

interface MenuState {
  items: MenuItem[];
  categories: string[];
  selectedCategory: string;
  setItems: (items: MenuItem[]) => void;
  setSelectedCategory: (cat: string) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  items: [],
  categories: ['ทั้งหมด'],
  selectedCategory: 'ทั้งหมด',
  setItems: (items) => {
    const cats = Array.from(new Set(items.map((i) => i.category)));
    set({ items, categories: ['ทั้งหมด', ...cats] });
  },
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
