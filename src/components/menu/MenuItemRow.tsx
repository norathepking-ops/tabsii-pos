import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FoodTile from '../common/FoodTile';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { MenuItem } from '../../types';

interface Props {
  item: MenuItem;
  index: number;
  qty: number;
  onAdd: () => void;
  onInc: () => void;
  onDec: () => void;
}

export default function MenuItemRow({ item, index, qty, onAdd, onInc, onDec }: Props) {
  const disabled = item.stock === 'out' || !item.active;

  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <FoodTile emoji={item.emoji ?? '🍜'} index={index} size={52} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.nameTh}>{item.nameTh}</Text>
          {item.isHot && <Text style={styles.fire}>🔥</Text>}
        </View>
        <Text style={styles.nameEn}>{item.nameEn}</Text>
        {item.stock === 'out' && <Text style={styles.outText}>หมดแล้ว</Text>}
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>฿{item.price}</Text>
        {disabled ? null : qty === 0 ? (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.stepper}>
            <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepQty}>{qty}</Text>
            <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.sm, gap: Spacing.md },
  rowDisabled: { opacity: 0.45 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nameTh: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink },
  fire: { fontSize: 12 },
  nameEn: { fontFamily: FontFamily.latin, fontSize: FontSize.caption, color: Colors.ink3, marginTop: 1 },
  outText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.rose, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6 },
  price: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.body, color: Colors.ink2 },
  addBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center',
  },
  addBtnText: { fontSize: 18, color: Colors.white, lineHeight: 22 },
  stepper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.ink, borderRadius: Radius.pill,
    paddingHorizontal: 4, height: 30, gap: 2,
  },
  stepBtn: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  stepBtnText: { fontSize: 16, color: Colors.white, lineHeight: 20 },
  stepQty: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.bodySmall, color: Colors.white, minWidth: 18, textAlign: 'center' },
});
