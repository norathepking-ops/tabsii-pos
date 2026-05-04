import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { UserRole } from '../../types';

const ROLES: { role: UserRole; emoji: string; label: string; desc: string }[] = [
  { role: 'server', emoji: '🙋', label: 'พนักงานเสิร์ฟ', desc: 'รับออเดอร์ที่โต๊ะ' },
  { role: 'kitchen', emoji: '🧑‍🍳', label: 'ครัว', desc: 'KDS ดูคิวอาหาร' },
  { role: 'cashier', emoji: '💳', label: 'แคชเชียร์', desc: 'เช็คบิล รับชำระ' },
  { role: 'owner', emoji: '👑', label: 'เจ้าของร้าน', desc: 'Dashboard & เมนู' },
];

export default function RoleSelectorScreen() {
  const { user, overrideRole } = useAuthStore();
  const [selected, setSelected] = useState<UserRole>(user?.role ?? 'server');

  function handleConfirm() {
    overrideRole(selected);
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>คุณเป็น...</Text>
      <Text style={styles.sub}>เลือกบทบาทเพื่อดูหน้าจอที่ต้องการ</Text>
      <View style={styles.grid}>
        {ROLES.map((r) => (
          <TouchableOpacity
            key={r.role}
            style={[styles.card, selected === r.role && styles.cardActive]}
            onPress={() => setSelected(r.role)}
          >
            <Text style={styles.emoji}>{r.emoji}</Text>
            <Text style={[styles.roleName, selected === r.role && styles.roleNameActive]}>{r.label}</Text>
            <Text style={styles.roleDesc}>{r.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
        <Text style={styles.btnText}>ยืนยัน</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper, padding: Spacing.screenPad, justifyContent: 'center' },
  title: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h1, color: Colors.ink, marginBottom: 4 },
  sub: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: Colors.ink3, marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  card: {
    width: '47%', padding: Spacing.base,
    backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.paper3,
    borderRadius: Radius.card, alignItems: 'center',
  },
  cardActive: { borderColor: Colors.emerald, backgroundColor: Colors.emerald3 },
  emoji: { fontSize: 32, marginBottom: Spacing.xs },
  roleName: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink },
  roleNameActive: { color: Colors.emerald2 },
  roleDesc: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3, marginTop: 2, textAlign: 'center' },
  btn: {
    backgroundColor: Colors.emerald, borderRadius: Radius.button, height: 52,
    justifyContent: 'center', alignItems: 'center', ...Shadows.ctaEmerald,
  },
  btnText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
});
