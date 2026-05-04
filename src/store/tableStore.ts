import { create } from 'zustand';
import { Table } from '../types';

interface TableState {
  tables: Table[];
  selectedTableId: string | null;
  setTables: (tables: Table[]) => void;
  selectTable: (id: string) => void;
  clearSelection: () => void;
}

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  selectedTableId: null,
  setTables: (tables) => set({ tables }),
  selectTable: (selectedTableId) => set({ selectedTableId }),
  clearSelection: () => set({ selectedTableId: null }),
}));
