/**
 * Seeds Firebase Emulator with test data.
 * Run: node scripts/seed-emulator.js
 * (Emulators must be running first)
 */
const { initializeApp } = require('firebase/app');
const { getFirestore, setDoc, doc, connectFirestoreEmulator } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, connectAuthEmulator } = require('firebase/auth');

const app = initializeApp({
  apiKey: 'demo-key',
  projectId: 'demo-tabsii-pos',
  authDomain: 'demo-tabsii-pos.firebaseapp.com',
});

const db = getFirestore(app);
const auth = getAuth(app);

connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });

const TABLES = [
  { id: 't1', number: 1, section: 'floor1', seats: 4, status: 'free' },
  { id: 't2', number: 2, section: 'floor1', seats: 2, status: 'busy', openedAt: new Date(Date.now() - 15 * 60000) },
  { id: 't3', number: 3, section: 'floor1', seats: 6, status: 'paying' },
  { id: 't4', number: 4, section: 'floor2', seats: 4, status: 'free' },
  { id: 't5', number: 5, section: 'floor2', seats: 4, status: 'busy', openedAt: new Date(Date.now() - 45 * 60000) },
  { id: 't6', number: 6, section: 'floor2', seats: 2, status: 'reserved', reservedFor: 'คุณสมชาย' },
  { id: 't7', number: 7, section: 'patio', seats: 6, status: 'free' },
  { id: 't8', number: 8, section: 'patio', seats: 4, status: 'free' },
  { id: 't9', number: 9, section: 'patio', seats: 2, status: 'busy', openedAt: new Date(Date.now() - 10 * 60000) },
];

const MENU = [
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

const USERS = [
  { email: 'server@tabsii.dev', password: 'tabsii2024', name: 'คุณสมชาย', role: 'server' },
  { email: 'kitchen@tabsii.dev', password: 'tabsii2024', name: 'เชฟต้อย', role: 'kitchen' },
  { email: 'cashier@tabsii.dev', password: 'tabsii2024', name: 'น้องแคช', role: 'cashier' },
  { email: 'owner@tabsii.dev', password: 'tabsii2024', name: 'เจ้าของร้าน', role: 'owner' },
];

async function seed() {
  console.log('🌱 Creating user accounts...');
  for (const u of USERS) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, u.email, u.password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid, name: u.name, role: u.role, email: u.email,
      });
      console.log(`  ✓ ${u.role}: ${u.email}`);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        console.log(`  ↺ ${u.email} already exists`);
      } else {
        console.error(`  ✗ ${u.email}:`, e.message);
      }
    }
  }

  console.log('\n🌱 Seeding tables...');
  for (const t of TABLES) {
    await setDoc(doc(db, 'tables', t.id), t);
    console.log(`  ✓ Table ${t.number} (${t.section}) — ${t.status}`);
  }

  console.log('\n🌱 Seeding menu items...');
  for (const m of MENU) {
    await setDoc(doc(db, 'menu_items', m.id), m);
    console.log(`  ✓ ${m.nameTh}`);
  }

  console.log('\n✅ Seed complete! Emulator is ready.');
  console.log('\n📱 Login credentials:');
  USERS.forEach(u => console.log(`   ${u.role.padEnd(8)} → ${u.email} / ${u.password}`));
  process.exit(0);
}

seed().catch(e => { console.error('Seed failed:', e); process.exit(1); });
