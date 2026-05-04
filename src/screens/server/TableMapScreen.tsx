import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import StatCard from '../../components/common/StatCard';
import LiveDot from '../../components/common/LiveDot';
import FloorSwitcher from '../../components/table/FloorSwitcher';
import TableCard from '../../components/table/TableCard';
import { useRealtimeTables } from '../../hooks/useRealtimeTables';
import { useAuthStore, useOrderStore } from '../../store';
import { signOut } from '../../services/auth.service';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { ServerStackParamList, Table, TableSection } from '../../types';

type Nav = StackNavigationProp<ServerStackParamList, 'TableMap'>;

function getWaitingCount(tables: Table[]): number {
  return tables.filter((t) => {
    if (t.status !== 'busy' || !t.openedAt) return false;
    return Date.now() - t.openedAt.toMillis() > 30 * 60000;
  }).length;
}

export default function TableMapScreen() {
  const nav = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const { initCart } = useOrderStore();
  const [section, setSection] = useState<TableSection>('floor1');
  const allTables = useRealtimeTables();

  const filtered = allTables.filter((t) => t.section === section);
  const activeCount = allTables.filter((t) => t.status === 'busy' || t.status === 'paying').length;
  const waitingCount = getWaitingCount(allTables);

  const logout = useAuthStore((s) => s.logout);
  async function handleLogout() {
    await signOut();
    logout();
  }

  function handleTablePress(table: Table) {
    if (table.status === 'paying') {
      Alert.alert('โต๊ะกำลังเช็คบิล', 'โต๊ะนี้รอชำระเงินอยู่ กรุณาติดต่อแคชเชียร์');
      return;
    }
    initCart(table.id, table.number);
    nav.navigate('Menu', { tableId: table.id, tableNumber: table.number });
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>พนักงานเสิร์ฟ</Text>
          <Text style={styles.headerName}>{user?.name ?? 'คุณ'}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.liveBadge}>
            <LiveDot color="emerald" />
            <Text style={styles.liveText}>Live</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 ออก</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="โต๊ะใช้งาน" value={String(activeCount)} accent />
        <StatCard label="รอนาน > 30 น." value={String(waitingCount)} warning={waitingCount > 0} />
        <StatCard label="โต๊ะทั้งหมด" value={String(allTables.length)} />
      </View>

      <FloorSwitcher selected={section} onSelect={setSection} />

      <View style={styles.gridWrap}>
        <FlatList
          data={filtered}
          keyExtractor={(t) => t.id}
          numColumns={3}
          contentContainerStyle={styles.gridContent}
          renderItem={({ item }) => (
            <View style={{ flex: 1 / 3 }}>
              <TableCard table={item} onPress={() => handleTablePress(item)} />
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>ไม่มีโต๊ะในส่วนนี้</Text>
          }
        />
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>📷 สแกนโต๊ะ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => nav.navigate('Menu', { tableId: '', tableNumber: 0 })}
        >
          <Text style={styles.primaryBtnText}>+ รับออเดอร์ใหม่</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: Spacing.screenPad, paddingTop: Spacing.md, paddingBottom: Spacing.md,
  },
  headerSub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  headerName: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink },
  headerRight: { alignItems: 'flex-end', gap: 6 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.emerald3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill },
  liveText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.emerald2 },
  logoutBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.paper3 },
  logoutText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.ink3 },
  statsRow: { flexDirection: 'row', paddingHorizontal: Spacing.screenPad, gap: Spacing.sm, marginBottom: Spacing.md },
  gridWrap: { flex: 1, paddingTop: Spacing.sm },
  gridContent: { paddingHorizontal: Spacing.sm, paddingBottom: 80 },
  empty: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink4, textAlign: 'center', marginTop: Spacing.xl },
  bottomRow: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md,
    backgroundColor: Colors.paper, borderTopWidth: 1, borderTopColor: Colors.paper3,
  },
  outlineBtn: {
    flex: 1, height: 48, borderRadius: Radius.button,
    borderWidth: 1.5, borderColor: Colors.paper3, justifyContent: 'center', alignItems: 'center',
  },
  outlineBtnText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  primaryBtn: {
    flex: 2, height: 48, borderRadius: Radius.button,
    backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center',
    ...Shadows.ctaEmerald,
  },
  primaryBtnText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.bodySmall, color: Colors.white },
});
