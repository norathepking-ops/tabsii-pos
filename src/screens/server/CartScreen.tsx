import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import CartItemRow from '../../components/cart/CartItemRow';
import TotalsCard from '../../components/cart/TotalsCard';
import { useAuthStore, useOrderStore } from '../../store';
import { submitOrder } from '../../services/orders.service';
import { openTable } from '../../services/tables.service';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { ServerStackParamList } from '../../types';

type Nav = StackNavigationProp<ServerStackParamList, 'Cart'>;
type Route = RouteProp<ServerStackParamList, 'Cart'>;

export default function CartScreen() {
  const nav = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const { tableId, tableNumber } = params;
  const user = useAuthStore((s) => s.user);
  const { cart, updateCartQty, updateCartNote, clearCart, getCartSubtotal, getCartServiceCharge, getCartTotal } = useOrderStore();
  const [loading, setLoading] = useState(false);

  const subtotal = getCartSubtotal();
  const serviceCharge = getCartServiceCharge();
  const total = getCartTotal();

  async function handleSubmit() {
    if (cart.length === 0) { Alert.alert('ตะกร้าว่าง', 'กรุณาเพิ่มรายการก่อน'); return; }
    setLoading(true);
    try {
      const orderId = await submitOrder(tableId, tableNumber, user?.id ?? '', cart);
      if (tableId) await openTable(tableId, orderId);
      clearCart();
      Alert.alert('ส่งออเดอร์สำเร็จ! ✅', 'ครัวได้รับออเดอร์แล้ว', [
        {
          text: 'ตกลง',
          onPress: () =>
            nav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'TableMap' }] })),
        },
      ]);
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => nav.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ยืนยันออเดอร์ · โต๊ะ {tableNumber || '–'}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        {cart.map((item, index) => (
          <React.Fragment key={item.menuItem.id}>
            <CartItemRow
              item={item}
              index={index}
              onInc={() => updateCartQty(item.menuItem.id, item.qty + 1)}
              onDec={() => updateCartQty(item.menuItem.id, item.qty - 1)}
              onNoteChange={(note) => updateCartNote(item.menuItem.id, note)}
            />
            {index < cart.length - 1 && <View style={styles.sep} />}
          </React.Fragment>
        ))}

        {cart.length === 0 && (
          <Text style={styles.empty}>ตะกร้าว่าง กลับไปเลือกเมนู</Text>
        )}

        <TotalsCard subtotal={subtotal} serviceCharge={serviceCharge} total={total} />
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>ส่งออเดอร์เข้าครัว · ฿{total}</Text>
          )}
        </TouchableOpacity>
      </View>
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
  title: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.ink, flex: 1, textAlign: 'center' },
  sep: { height: 1, backgroundColor: Colors.paper3, marginHorizontal: Spacing.screenPad },
  empty: { fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink4, textAlign: 'center', marginTop: Spacing.xxl },
  bottom: {
    paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md,
    backgroundColor: Colors.paper, borderTopWidth: 1, borderTopColor: Colors.paper3,
  },
  submitBtn: {
    height: 54, borderRadius: Radius.button,
    backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center',
    ...Shadows.ctaEmerald,
  },
  submitText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
});
