import { useEffect } from 'react';
import { subscribeTables } from '../services/tables.service';
import { useTableStore } from '../store';
import { Table, TableSection } from '../types';

export function useRealtimeTables(section?: TableSection): Table[] {
  const setTables = useTableStore((s) => s.setTables);
  const tables = useTableStore((s) => s.tables);

  useEffect(() => {
    const unsub = subscribeTables(section ?? null, setTables);
    return unsub;
  }, [section]);

  return tables;
}
