import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Svg, { Rect, Polyline } from 'react-native-svg';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import StatCard from '../../components/common/StatCard';
import { db } from '../../services/firebase';
import { useAuthStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { Order } from '../../types';

interface HourBucket { hour: number; revenue: number; count: number; }

function todayRange(): { start: Timestamp; end: Timestamp } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { start: Timestamp.fromDate(start), end: Timestamp.fromDate(end) };
}

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { start, end } = todayRange();
    const q = query(
      collection(db, 'orders'),
      where('status', '==', 'paid'),
      where('createdAt', '>=', start),
      where('createdAt', '<=', end)
    );
    getDocs(q).then((snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const orderCount = orders.length;
  const avgPerTable = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  const hourBuckets: HourBucket[] = Array.from({ length: 12 }, (_, i) => ({
    hour: 9 + i,
    revenue: 0,
    count: 0,
  }));
  orders.forEach((o) => {
    const h = o.createdAt?.toDate?.()?.getHours?.() ?? 0;
    const bucket = hourBuckets.find((b) => b.hour === h);
    if (bucket) { bucket.revenue += o.total; bucket.count += 1; }
  });
  const maxRevHour = Math.max(...hourBuckets.map((b) => b.revenue), 1);

  const sparklinePoints = hourBuckets
    .map((b, i) => `${i * (240 / 11)},${40 - (b.revenue / maxRevHour) * 36}`)
    .join(' ');

  const topItems: { id: string; name: string; qty: number; revenue: number }[] = [];
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = topItems.find((t) => t.id === item.menuItemId);
      if (existing) {
        existing.qty += item.qty;
        existing.revenue += item.price * item.qty;
      } else {
        topItems.push({ id: item.menuItemId, name: item.menuItemId, qty: item.qty, revenue: item.price * item.qty });
      }
    });
  });
  topItems.sort((a, b) => b.revenue - a.revenue);
  const top5 = topItems.slice(0, 5);
  const maxTopRevenue = top5[0]?.revenue ?? 1;

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'O'}</Text>
          </View>
          <View>
            <Text style={styles.storeName}>ครัวนิดหน่อย</Text>
            <Text style={styles.ownerName}>{user?.name ?? 'เจ้าของร้าน'}</Text>
          </View>
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.revLabel}>ยอดขายวันนี้</Text>
          <Text style={styles.revValue}>฿{totalRevenue.toLocaleString()}</Text>
          <Svg width={240} height={44} style={{ marginTop: 8 }}>
            <Polyline points={sparklinePoints} fill="none" stroke={Colors.emerald} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        <View style={styles.kpiRow}>
          <StatCard label="ออเดอร์" value={String(orderCount)} />
          <StatCard label="ยอดเฉลี่ย/โต๊ะ" value={`฿${avgPerTable}`} accent />
        </View>

        <Text style={styles.sectionTitle}>ยอดขายรายชั่วโมง (วันนี้)</Text>
        <View style={[styles.card, ...(Shadows.card ? [Shadows.card] : [])]}>
          <Svg width="100%" height={80} viewBox="0 0 264 80">
            {hourBuckets.map((b, i) => {
              const barH = maxRevHour > 0 ? (b.revenue / maxRevHour) * 60 : 2;
              const x = i * 22;
              const isNow = b.hour === new Date().getHours();
              return (
                <Rect
                  key={b.hour}
                  x={x + 2} y={70 - barH}
                  width={18} height={Math.max(barH, 2)}
                  rx={4}
                  fill={isNow ? Colors.ink : b.revenue > maxRevHour * 0.7 ? Colors.orange : Colors.emerald3}
                />
              );
            })}
          </Svg>
          <View style={styles.heatHours}>
            {hourBuckets.filter((_, i) => i % 2 === 0).map((b) => (
              <Text key={b.hour} style={styles.heatHourLabel}>{b.hour}:00</Text>
            ))}
          </View>
        </View>

        {top5.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>เมนูขายดี</Text>
            <View style={[styles.card, ...(Shadows.card ? [Shadows.card] : [])]}>
              {top5.map((item, i) => (
                <View key={item.id} style={styles.topItemRow}>
                  <Text style={styles.topRank}>{i + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.topName}>{item.name}</Text>
                    <View style={styles.topBar}>
                      <View style={[styles.topBarFill, { width: `${(item.revenue / maxTopRevenue) * 100}%` as any }]} />
                    </View>
                  </View>
                  <Text style={styles.topRevenue}>฿{item.revenue}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {loading && <Text style={styles.loading}>กำลังโหลด...</Text>}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: Spacing.screenPad, paddingBottom: Spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
  storeName: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink },
  ownerName: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  revenueCard: {
    backgroundColor: Colors.ink, borderRadius: Radius.cardLg,
    padding: Spacing.base, marginBottom: Spacing.md, overflow: 'hidden',
  },
  revLabel: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: 'rgba(255,255,255,0.55)', marginBottom: 4 },
  revValue: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.display, color: Colors.white },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink, marginBottom: Spacing.sm },
  card: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.base, marginBottom: Spacing.lg },
  heatHours: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  heatHourLabel: { fontFamily: FontFamily.mono, fontSize: FontSize.micro, color: Colors.ink4 },
  topItemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  topRank: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.caption, color: Colors.ink3, width: 16, textAlign: 'center' },
  topName: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.ink },
  topBar: { height: 4, backgroundColor: Colors.paper2, borderRadius: 2, marginTop: 3 },
  topBarFill: { height: 4, backgroundColor: Colors.emerald, borderRadius: 2 },
  topRevenue: { fontFamily: FontFamily.mono, fontSize: FontSize.caption, color: Colors.ink3 },
  loading: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink4, textAlign: 'center', marginTop: Spacing.xl },
});
