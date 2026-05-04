import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Table, TableStatus, TableSection } from '../types';

export function subscribeTables(
  section: TableSection | null,
  callback: (tables: Table[]) => void
): () => void {
  const ref = collection(db, 'tables');
  const q = section ? query(ref, where('section', '==', section)) : ref;
  return onSnapshot(q, (snap) => {
    const tables = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Table));
    callback(tables.sort((a, b) => a.number - b.number));
  });
}

export async function updateTableStatus(
  tableId: string,
  status: TableStatus,
  extra?: Partial<Table>
): Promise<void> {
  await updateDoc(doc(db, 'tables', tableId), { status, ...extra });
}

export async function openTable(tableId: string, orderId: string): Promise<void> {
  await updateDoc(doc(db, 'tables', tableId), {
    status: 'busy',
    openedAt: serverTimestamp(),
    orderId,
  });
}

export async function closeTable(tableId: string): Promise<void> {
  await updateDoc(doc(db, 'tables', tableId), {
    status: 'free',
    openedAt: null,
    orderId: null,
  });
}
