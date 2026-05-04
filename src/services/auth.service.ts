import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AppUser } from '../types';

async function getUserDoc(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as AppUser;
}

export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = await getUserDoc(cred.user.uid);
  if (!user) throw new Error('ไม่พบข้อมูลผู้ใช้ในระบบ');
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChanged(callback: (user: AppUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    const user = await getUserDoc(firebaseUser.uid);
    callback(user);
  });
}
