/**
 * Run once: node -r ts-node/register src/services/seed.ts
 * Or compile: npx ts-node src/services/seed.ts
 *
 * Requires a .env file with FIREBASE_* vars (without EXPO_PUBLIC_ prefix for Node.js)
 * OR set EXPO_PUBLIC_ vars and use this file directly.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TABLES = [
  { id: 't1', number: 1, section: 'floor1', seats: 4, status: 'free' },
  { id: 't2', number: 2, section: 'floor1', seats: 2, status: 'busy' },
  { id: 't3', number: 3, section: 'floor1', seats: 6, status: 'paying' },
  { id: 't4', number: 4, section: 'floor2', seats: 4, status: 'free' },
  { id: 't5', number: 5, section: 'floor2', seats: 4, status: 'busy' },
  { id: 't6', number: 6, section: 'floor2', seats: 2, status: 'reserved', reservedFor: 'คุณสมชาย' },
  { id: 't7', number: 7, section: 'patio', seats: 6, status: 'free' },
  { id: 't8', number: 8, section: 'patio', seats: 4, status: 'free' },
  { id: 't9', number: 9, section: 'patio', seats: 2, status: 'busy' },
];

const MENU_ITEMS = [
  { id: 'm1', nameTh: 'ก๋วยเตี๋ยวเรือ', nameEn: 'Boat Noodle', category: 'เส้น', price: 65, isHot: false, active: true, stock: 'high', sortOrder: 1, emoji: '🍜' },
  { id: 'm2', nameTh: 'ข้าวผัดหมู', nameEn: 'Pork Fried Rice', category: 'ข้าว', price: 55, isHot: false, active: true, stock: 'high', sortOrder: 2, emoji: '🍳' },
  { id: 'm3', nameTh: 'ผัดกะเพราไก่ไข่ดาว', nameEn: 'Basil Chicken + Egg', category: 'ข้าว', price: 60, isHot: true, active: true, stock: 'high', sortOrder: 3, emoji: '🌿' },
  { id: 'm4', nameTh: 'ต้มยำกุ้งน้ำข้น', nameEn: 'Tom Yum Goong', category: 'ต้ม', price: 120, isHot: true, active: true, stock: 'low', sortOrder: 4, emoji: '🍲' },
  { id: 'm5', nameTh: 'ข้าวมันไก่', nameEn: 'Khao Mun Gai', category: 'ข้าว', price: 50, isHot: false, active: false, stock: 'out', sortOrder: 5, emoji: '🍗' },
  { id: 'm6', nameTh: 'ผัดซีอิ๊ว', nameEn: 'Pad See Ew', category: 'เส้น', price: 55, isHot: false, active: true, stock: 'high', sortOrder: 6, emoji: '🥢' },
  { id: 'm7', nameTh: 'ชาไทยเย็น', nameEn: 'Thai Iced Tea', category: 'เครื่องดื่ม', price: 25, isHot: false, active: true, stock: 'high', sortOrder: 7, emoji: '🧋' },
  { id: 'm8', nameTh: 'น้ำมะนาว', nameEn: 'Lime Soda', category: 'เครื่องดื่ม', price: 30, isHot: false, active: true, stock: 'high', sortOrder: 8, emoji: '🍋' },
  { id: 'm9', nameTh: 'ผัดไทยกุ้งสด', nameEn: 'Pad Thai Prawn', category: 'เส้น', price: 75, isHot: false, active: true, stock: 'high', sortOrder: 9, emoji: '🦐' },
  { id: 'm10', nameTh: 'ข้าวผัดกุ้ง', nameEn: 'Prawn Fried Rice', category: 'ข้าว', price: 65, isHot: false, active: true, stock: 'high', sortOrder: 10, emoji: '🍚' },
  { id: 'm11', nameTh: 'แกงเขียวหวาน', nameEn: 'Green Curry', category: 'ต้ม', price: 80, isHot: true, active: true, stock: 'high', sortOrder: 11, emoji: '🫙' },
  { id: 'm12', nameTh: 'ส้มตำไทย', nameEn: 'Papaya Salad', category: 'อื่นๆ', price: 45, isHot: true, active: true, stock: 'high', sortOrder: 12, emoji: '🥗' },
  { id: 'm13', nameTh: 'กาแฟเย็น', nameEn: 'Iced Coffee', category: 'เครื่องดื่ม', price: 35, isHot: false, active: true, stock: 'high', sortOrder: 13, emoji: '☕' },
  { id: 'm14', nameTh: 'น้ำเต้าหู้', nameEn: 'Soy Milk', category: 'เครื่องดื่ม', price: 20, isHot: false, active: true, stock: 'high', sortOrder: 14, emoji: '🥛' },
];

async function seed() {
  console.log('🌱 Seeding tables...');
  for (const t of TABLES) {
    await setDoc(doc(db, 'tables', t.id), t);
    console.log(`  ✓ Table ${t.number} (${t.section})`);
  }

  console.log('\n🌱 Seeding menu items...');
  for (const m of MENU_ITEMS) {
    await setDoc(doc(db, 'menu_items', m.id), m);
    console.log(`  ✓ ${m.nameTh}`);
  }

  console.log('\n✅ Seed complete!');
  console.log('\n📝 Create Firebase Auth accounts manually:');
  console.log('   server@tabsii.dev   / tabsii2024  → role: server');
  console.log('   kitchen@tabsii.dev  / tabsii2024  → role: kitchen');
  console.log('   cashier@tabsii.dev  / tabsii2024  → role: cashier');
  console.log('   owner@tabsii.dev    / tabsii2024  → role: owner');
  console.log('\nThen create /users/{uid} docs with { name, role, email }');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
