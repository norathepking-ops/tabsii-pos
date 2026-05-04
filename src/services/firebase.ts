import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, initializeAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'demo-tabsii-pos',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);

// Web uses localStorage-based persistence; native uses AsyncStorage
let _auth: ReturnType<typeof getAuth>;
if (Platform.OS === 'web') {
  _auth = getAuth(app);
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getReactNativePersistence } = require('@firebase/auth/react-native');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  _auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
}
export const auth = _auth;

export const storage = getStorage(app);

// Connect to emulators in development
if (process.env.EXPO_PUBLIC_USE_EMULATOR === 'true') {
  const EMULATOR_HOST = process.env.EXPO_PUBLIC_EMULATOR_HOST ?? 'localhost';
  try {
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
    connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  } catch {
    // Already connected (hot reload)
  }
}
