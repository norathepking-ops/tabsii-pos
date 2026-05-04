import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
  Modal, TextInput, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import DashedLine from '../../components/cashier/DashedLine';
import { subscribeTableOrder } from '../../services/orders.service';
import { updateOrderStatus } from '../../services/orders.service';
import { closeTable } from '../../services/tables.service';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { CashierStackParamList, Order } from '../../types';
import { useMenuStore } from '../../store';
import { useMenuItems } from '../../hooks/useMenuItems';

type Nav = StackNavigationProp<CashierStackParamList, 'Checkout'>;
type Route = RouteProp<CashierStackParamList, 'Checkout'>;

type PayMethod = 'promptpay' | 'cash' | 'card' | 'transfer';

const PAY_METHODS: { key: PayMethod; emoji: string; label: string }[] = [
  { key: 'promptpay', emoji: '📱', label: 'PromptPay' },
  { key: 'cash', emoji: '💵', label: 'เงินสด' },
  { key: 'card', emoji: '💳', label: 'บัตร' },
  { key: 'transfer', emoji: '🏦', label: 'โอนธนาคาร' },
];

export default function CheckoutScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { tableId, orderId, tableNumber } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>('promptpay');
  const [cashModal, setCashModal] = useState(false);
  const [cashReceived, setCashReceived] = useState('');
  const [loading, setLoading] = useState(false);

  useMenuItems();
  const menuItems = useMenuStore((s) => s.items);

  function getItemName(menuItemId: string) {
    return menuItems.find((m) => m.id === menuItemId)?.nameTh ?? menuItemId;
  }

  useEffect(() => {
    const unsub = subscribeTableOrder(tableId, setOrder);
    return unsub;
  }, [tableId]);

  async function handleConfirm() {
    if (!order) return;
    setLoading(true);
    try {
      await updateOrderStatus(order.id, 'paid');
      await closeTable(tableId);
      Alert.alert('ชำระเงินสำเร็จ ✅', `โต๊ะ ${tableNumber} ปิดแล้ว`, [
        { text: 'ตกลง', onPress: () => nav.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message);
    } finally {
      setLoading(false);
      setCashModal(false);
    }
  }

  function handlePayPress() {
    if (payMethod === 'cash') {
      setCashModal(true);
    } else {
      Alert.alert(
        'ยืนยันการชำระเงิน',
        `วิธี: ${PAY_METHODS.find((p) => p.key === payMethod)?.label}\nยอด: ฿${order?.total ?? 0}`,
        [
          { text: 'ยกเลิก', style: 'cancel' },
          { text: 'ยืนยัน', onPress: handleConfirm },
        ]
      );
    }
  }

  const change = cashReceived ? Math.max(0, parseInt(cashReceived, 10) - (order?.total ?? 0)) : 0;

  if (!order) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={Colors.emerald} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>เช็คบิล · โต๊ะ {tableNumber}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.screenPad, paddingBottom: 120 }}>
        <View style={styles.receipt}>
          <Text style={styles.receiptLogo}>🌿 Tabsii POS</Text>
          <Text style={styles.receiptSub}>ใบกำกับชั่วคราว · โต๊ะ {tableNumber}</Text>
          <DashedLine />
          {order.items.map((item, i) => (
            <View key={i} style={styles.receiptRow}>
              <Text style={styles.receiptItem}>{getItemName(item.menuItemId)} × {item.qty}</Text>
              <Text style={styles.receiptItemPrice}>฿{item.price * item.qty}</Text>
            </View>
          ))}
          <DashedLine />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>ราคาอาหาร</Text>
            <Text style={styles.receiptValue}>฿{order.subtotal}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Service Charge 10%</Text>
            <Text style={styles.receiptValue}>฿{order.serviceCharge}</Text>
          </View>
          <View style={[styles.receiptRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>รวมทั้งสิ้น</Text>
            <Text style={styles.totalValue}>฿{order.total}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>เลือกวิธีชำระเงิน</Text>
        <View style={styles.payGrid}>
          {PAY_METHODS.map((m) => {
            const isActive = payMethod === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.payCard, isActive && styles.payCardActive]}
                onPress={() => setPayMethod(m.key)}
              >
                <Text style={styles.payEmoji}>{m.emoji}</Text>
                <Text style={[styles.payLabel, isActive && styles.payLabelActive]}>
                  {m.label}
                </Text>
                <Text style={[styles.paySubLabel, isActive && styles.paySubLabelActive]}>
                  {m.key === 'promptpay' ? 'PromptPay' : m.key === 'cash' ? 'Cash' : m.key === 'card' ? 'Card' : 'Transfer'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={handlePayPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.confirmText}>รับชำระ ฿{order.total}</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal visible={cashModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>รับเงินสด</Text>
            <Text style={styles.modalSub}>ยอดที่ต้องชำระ ฿{order.total}</Text>
            <TextInput
              style={styles.cashInput}
              value={cashReceived}
              onChangeText={setCashReceived}
              placeholder="จำนวนเงินที่รับมา"
              placeholderTextColor={Colors.ink4}
              keyboardType="number-pad"
              autoFocus
            />
            {cashReceived !== '' && (
              <View style={styles.changeRow}>
                <Text style={styles.changeLabel}>เงินทอน</Text>
                <Text style={[styles.changeValue, change < 0 && { color: Colors.rose }]}>฿{change}</Text>
              </View>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setCashModal(false)}>
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleConfirm} disabled={loading}>
                <Text style={styles.saveText}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.paper3,
  },
  backBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: Colors.paper2, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 24, color: Colors.ink2, lineHeight: 30 },
  title: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink },
  receipt: { backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.base, marginBottom: Spacing.lg },
  receiptLogo: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.emerald, textAlign: 'center' },
  receiptSub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3, textAlign: 'center', marginBottom: Spacing.xs },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  receiptItem: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: Colors.ink, flex: 1 },
  receiptItemPrice: { fontFamily: FontFamily.mono, fontSize: FontSize.bodySmall, color: Colors.ink },
  receiptLabel: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  receiptValue: { fontFamily: FontFamily.mono, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  totalRow: { marginTop: Spacing.xs },
  totalLabel: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink },
  totalValue: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.h2, color: Colors.ink },
  sectionTitle: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink, marginBottom: Spacing.md },
  payGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  payCard: {
    width: '47%', padding: Spacing.md, borderRadius: Radius.card,
    backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.paper3,
    alignItems: 'flex-start',
  },
  payCardActive: {
    borderColor: Colors.emerald, backgroundColor: Colors.emerald,
    shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  payEmoji: { fontSize: 22, marginBottom: 6 },
  payLabel: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.ink2 },
  payLabelActive: { color: Colors.white },
  paySubLabel: { fontFamily: FontFamily.latin, fontSize: 10, color: Colors.ink4, marginTop: 1 },
  paySubLabelActive: { color: 'rgba(255,255,255,0.75)' },
  bottom: { paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.paper3 },
  confirmBtn: {
    height: 54, borderRadius: Radius.button,
    backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center',
    ...Shadows.ctaEmerald,
  },
  confirmText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.xl },
  modalTitle: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink, marginBottom: 4 },
  modalSub: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink3, marginBottom: Spacing.lg },
  cashInput: {
    borderWidth: 1.5, borderColor: Colors.paper3, borderRadius: Radius.input,
    padding: Spacing.md, fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.h1, color: Colors.ink, textAlign: 'center',
  },
  changeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  changeLabel: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink3 },
  changeValue: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.body, color: Colors.emerald },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
  cancelBtn: { flex: 1, height: 48, borderRadius: Radius.button, borderWidth: 1.5, borderColor: Colors.paper3, justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink3 },
  saveBtn: { flex: 2, height: 48, borderRadius: Radius.button, backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center' },
  saveText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
});
