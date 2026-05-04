import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import LiveDot from '../../components/common/LiveDot';
import { useRealtimeTables } from '../../hooks/useRealtimeTables';
import { useAuthStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { CashierStackParamList, Table } from '../../types';
import { useRealtimeOrders } from '../../hooks/useRealtimeOrders';

type Nav = StackNavigationProp<CashierStackParamList, 'CashierHome'>;

function BusyTableRow({ table, nav }: { table: Table; nav: Nav }) {
  const order = useRealtimeOrders(table.id);
  if (!order) return null;

  return (
    <TouchableOpacity
      style={styles.tableRow}
      onPress={() => nav.navigate('Checkout', { tableId: table.id, orderId: order.id, tableNumber: table.number })}
    >
      <View style={[styles.tableNumBox, table.status === 'paying' && styles.tableNumBoxPaying]}>
        <Text style={styles.tableNum}>{table.number}</Text>
      </View>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>โต๊ะ {table.number}</Text>
        <Text style={styles.rowSub}>{order.items.length} รายการ</Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.rowTotal}>฿{order.total}</Text>
        <Text style={styles.rowStatus}>
          {table.status === 'paying' ? '⏳ รอชำระ' : '🍽 กำลังกิน'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function CashierHomeScreen() {
  const nav = useNavigation<Nav>();
  const user = useAuthStore((s) => s.user);
  const tables = useRealtimeTables();
  const activeTables = tables.filter((t) => t.status === 'busy' || t.status === 'paying');

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>แคชเชียร์</Text>
          <Text style={styles.headerName}>{user?.name ?? 'คุณ'}</Text>
        </View>
        <View style={styles.liveBadge}>
          <LiveDot color="emerald" />
          <Text style={styles.liveText}>{activeTables.length} โต๊ะ</Text>
        </View>
      </View>

      <FlatList
        data={activeTables}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <BusyTableRow table={item} nav={nav} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>☕</Text>
            <Text style={styles.emptyText}>ยังไม่มีโต๊ะที่ต้องเช็คบิล</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
    paddingHorizontal: Spacing.screenPad, paddingTop: Spacing.md, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.paper3,
  },
  headerSub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  headerName: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.emerald3, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.pill },
  liveText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.emerald2 },
  list: { padding: Spacing.screenPad },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: Radius.card,
    padding: Spacing.md, gap: Spacing.md,
    ...Shadows.card,
  },
  tableNumBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center' },
  tableNumBoxPaying: { backgroundColor: Colors.orange },
  tableNum: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.white },
  rowInfo: { flex: 1 },
  rowTitle: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink },
  rowSub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  rowRight: { alignItems: 'flex-end' },
  rowTotal: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.body, color: Colors.ink },
  rowStatus: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  sep: { height: Spacing.sm },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink4 },
});
