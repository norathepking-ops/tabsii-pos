import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, withSpring, withTiming, useAnimatedStyle,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../services/orders.service';

interface Props {
  order: Order;
  isNew: boolean;
}

function getElapsed(order: Order): string {
  const ms = Date.now() - (order.createdAt?.toMillis?.() ?? Date.now());
  const min = Math.floor(ms / 60000);
  if (min < 1) return 'เพิ่งเข้า';
  return `${min} นาที`;
}

const STATUS_CONFIG = {
  submitted: { chipLabel: 'ใหม่',     chipBg: Colors.orange,  chipText: Colors.white, borderColor: Colors.orange,              cardBg: '#2a2520', headerBg: 'rgba(229,90,43,0.12)' },
  cooking:   { chipLabel: 'ทำอยู่',   chipBg: Colors.gold,    chipText: Colors.ink,   borderColor: 'rgba(201,169,75,0.25)',    cardBg: Colors.kitchenSurface, headerBg: 'transparent' },
  ready:     { chipLabel: 'พร้อมเสิร์ฟ', chipBg: Colors.emerald, chipText: Colors.white, borderColor: 'rgba(15,122,95,0.25)', cardBg: Colors.kitchenSurface, headerBg: 'transparent' },
} as const;

const ACTION_LABEL: Record<string, string> = {
  submitted: 'เริ่มทำ',
  cooking: 'ทำเสร็จแล้ว',
  ready: '🔔 เรียกเสิร์ฟ',
};
const ACTION_BG: Record<string, string> = {
  submitted: Colors.orange,
  cooking: Colors.gold,
  ready: Colors.white,
};
const ACTION_TEXT: Record<string, string> = {
  submitted: Colors.white,
  cooking: Colors.ink,
  ready: Colors.ink,
};

export default function OrderCard({ order, isNew }: Props) {
  const translateY = useSharedValue(isNew ? -20 : 0);
  const opacity = useSharedValue(isNew ? 0 : 1);
  const [elapsed, setElapsed] = useState(getElapsed(order));
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isNew) {
      translateY.value = withSpring(0, { damping: 12, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isNew]);

  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed(order)), 60000);
    return () => clearInterval(id);
  }, [order.createdAt]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];

  async function handleAction() {
    if (updating) return;
    setUpdating(true);
    const next: Record<string, OrderStatus> = { submitted: 'cooking', cooking: 'ready', ready: 'served' };
    try {
      await updateOrderStatus(order.id, (next[order.status] ?? 'served') as OrderStatus);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Animated.View
      style={[
        styles.card,
        { borderColor: cfg?.borderColor ?? Colors.kitchenBorder, backgroundColor: cfg?.cardBg ?? Colors.kitchenSurface },
        order.status === 'submitted' && styles.cardNewGlow,
        animStyle,
      ]}
    >
      {/* Header */}
      <View style={[styles.cardHeader, { backgroundColor: cfg?.headerBg ?? 'transparent' }]}>
        <View style={[styles.tableNumBadge, { backgroundColor: cfg?.chipBg ?? Colors.orange }]}>
          <Text style={[styles.tableNum, { color: cfg?.chipText ?? Colors.white }]}>
            {order.tableNumber}
          </Text>
        </View>
        <View style={styles.headerMid}>
          <Text style={styles.orderId}>โต๊ะ {order.tableNumber} · #{order.id.slice(-6).toUpperCase()}</Text>
          <Text style={styles.elapsed}>⏱ {elapsed}</Text>
        </View>
        <View style={[styles.chip, { backgroundColor: (cfg?.chipBg ?? Colors.orange) + '33', borderColor: (cfg?.chipBg ?? Colors.orange) + '88' }]}>
          {order.status === 'submitted' && (
            <View style={styles.chipDot} />
          )}
          <Text style={[styles.chipText, { color: cfg?.chipBg ?? Colors.orange }]}>
            {cfg?.chipLabel ?? order.status}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.itemsList}>
        {order.items.map((item, i) => (
          <View key={i} style={[styles.itemRow, i < order.items.length - 1 && styles.itemRowBorder]}>
            <View style={styles.qtyBox}>
              <Text style={styles.qtyText}>×{item.qty}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.nameTh ?? item.menuItemId}</Text>
              {item.note ? <Text style={styles.itemNote}>※ {item.note}</Text> : null}
            </View>
          </View>
        ))}
      </View>

      {order.notes ? (
        <View style={styles.kitchenNotes}>
          <Text style={styles.kitchenNotesText}>※ {order.notes}</Text>
        </View>
      ) : null}

      {order.status !== 'served' && (
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: ACTION_BG[order.status] ?? Colors.orange }, updating && { opacity: 0.6 }]}
          onPress={handleAction}
          disabled={updating}
        >
          <Text style={[styles.actionText, { color: ACTION_TEXT[order.status] ?? Colors.white }]}>
            {ACTION_LABEL[order.status] ?? 'ดำเนินการ'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.screenPad, marginBottom: Spacing.md,
    borderRadius: Radius.card, borderWidth: 1.5, overflow: 'hidden',
  },
  cardNewGlow: {
    shadowColor: Colors.orange, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, gap: Spacing.sm,
  },
  tableNumBadge: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  tableNum: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2 },
  headerMid: { flex: 1 },
  orderId: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.kitchenText },
  elapsed: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.kitchenTextMuted, marginTop: 1 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
    borderRadius: Radius.pill, borderWidth: 1,
  },
  chipDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: Colors.orange,
  },
  chipText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.micro },
  itemsList: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: 7 },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  qtyBox: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  qtyText: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.caption, color: Colors.kitchenText },
  itemName: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.kitchenText },
  itemNote: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.orange, marginTop: 1 },
  kitchenNotes: {
    backgroundColor: 'rgba(229,90,43,0.08)', borderRadius: Radius.sm,
    padding: Spacing.sm, marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
  },
  kitchenNotesText: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.orange },
  actionBtn: {
    margin: Spacing.md, marginTop: 4,
    borderRadius: Radius.button, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  actionText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body },
});
