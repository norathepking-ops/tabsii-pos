import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { MenuItem } from '../types';

export function subscribeMenuItems(callback: (items: MenuItem[]) => void): () => void {
  const q = query(collection(db, 'menu_items'), orderBy('sortOrder', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem)));
  });
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'menu_items'), {
    ...item,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
  await updateDoc(doc(db, 'menu_items', id), updates);
}

export async function toggleMenuItemActive(id: string, active: boolean): Promise<void> {
  await updateDoc(doc(db, 'menu_items', id), { active });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, 'menu_items', id));
}
