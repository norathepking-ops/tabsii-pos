import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderCard from '../../components/kitchen/OrderCard';
import Chip from '../../components/common/Chip';
import LiveDot from '../../components/common/LiveDot';
import { useKitchenQueue } from '../../hooks/useKitchenQueue';
import { useAuthStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing } from '../../theme';
import { Order, OrderStatus } from '../../types';

const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'submitted', label: 'ใหม่' },
  { key: 'cooking', label: 'ทำอยู่' },
  { key: 'ready', label: 'พร้อม' },
];

export default function KDSScreen() {
  const user = useAuthStore((s) => s.user);
  const orders = useKitchenQueue();
  const [filter, setFilter] = useState('all');
  const prevIdsRef = useRef<Set<string>>(new Set());

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  function isNewOrder(order: Order): boolean {
    const isNew = !prevIdsRef.current.has(order.id) && order.status === 'submitted';
    prevIdsRef.current.add(order.id);
    return isNew;
  }

  const countByStatus = (s: string) =>
    s === 'all' ? orders.length : orders.filter((o) => o.status === s).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.roleIcon}>👨‍🍳</Text>
          <View>
            <Text style={styles.name}>{user?.name ?? 'ครัว'}</Text>
            <View style={styles.liveRow}>
              <LiveDot color="orange" />
              <Text style={styles.liveText}>ออเดอร์ทั้งหมด {orders.length} รายการ</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Chip
            key={f.key}
            label={`${f.label}${countByStatus(f.key) > 0 ? ` (${countByStatus(f.key)})` : ''}`}
            active={filter === f.key}
            onPress={() => setFilter(f.key)}
            dark
          />
        ))}
      </View>

      <FlashList
        data={filtered}
        keyExtractor={(o) => o.id}

        contentContainerStyle={{ paddingTop: Spacing.sm, paddingBottom: Spacing.xl }}
        renderItem={({ item }) => <OrderCard order={item} isNew={isNewOrder(item)} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>✅</Text>
            <Text style={styles.emptyText}>ไม่มีออเดอร์ที่รอทำ</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.kitchenBg },
  header: {
    paddingHorizontal: Spacing.screenPad, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.kitchenBorder,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  roleIcon: { fontSize: 28 },
  name: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.kitchenText },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  liveText: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.kitchenTextMuted },
  filterRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs,
    paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md,
  },
  emptyWrap: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.kitchenTextMuted },
});
