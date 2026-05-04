import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ScreenWrapper from '../../components/common/ScreenWrapper';
import FoodTile from '../../components/common/FoodTile';
import Chip from '../../components/common/Chip';
import AnimatedToggle from '../../components/owner/AnimatedToggle';
import StockAlertBanner from '../../components/owner/StockAlertBanner';
import { useMenuItems } from '../../hooks/useMenuItems';
import { useMenuStore } from '../../store';
import { toggleMenuItemActive, addMenuItem, deleteMenuItem, updateMenuItem } from '../../services/menu.service';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { MenuItem, StockLevel } from '../../types';

const FILTERS = ['ทั้งหมด', 'เปิดขาย', 'ปิด', 'สต็อกต่ำ'];
const CATEGORIES = ['ข้าว', 'เส้น', 'ต้ม', 'เครื่องดื่ม', 'อื่นๆ'];
const STOCKS: StockLevel[] = ['high', 'low', 'out'];
const STOCK_LABELS: Record<StockLevel, string> = { high: 'ปกติ', low: 'ต่ำ', out: 'หมด' };

interface FormState { nameTh: string; nameEn: string; category: string; price: string; isHot: boolean; stock: StockLevel; active: boolean; }
const emptyForm: FormState = { nameTh: '', nameEn: '', category: 'ข้าว', price: '', isHot: false, stock: 'high', active: true };

export default function MenuManagementScreen() {
  useMenuItems();
  const items = useMenuStore((s) => s.items);
  const [filter, setFilter] = useState('ทั้งหมด');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((i) => {
    if (filter === 'เปิดขาย') return i.active;
    if (filter === 'ปิด') return !i.active;
    if (filter === 'สต็อกต่ำ') return i.stock === 'low' || i.stock === 'out';
    return true;
  });

  function openAdd() {
    setEditingItem(null);
    setForm(emptyForm);
    setModalVisible(true);
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item);
    setForm({ nameTh: item.nameTh, nameEn: item.nameEn, category: item.category, price: String(item.price), isHot: !!item.isHot, stock: item.stock, active: item.active });
    setModalVisible(true);
  }

  async function handleSave() {
    if (!form.nameTh || !form.price) { Alert.alert('กรุณากรอก ชื่อและราคา'); return; }
    setSaving(true);
    try {
      const data = { nameTh: form.nameTh, nameEn: form.nameEn, category: form.category, price: parseInt(form.price, 10), isHot: form.isHot, stock: form.stock, active: form.active, thumbnail: '', sortOrder: items.length + 1 };
      if (editingItem) {
        await updateMenuItem(editingItem.id, data);
      } else {
        await addMenuItem(data);
      }
      setModalVisible(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    Alert.alert('ลบเมนู', `ต้องการลบ "${item.nameTh}" ใช่ไหม?`, [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ลบ', style: 'destructive', onPress: () => deleteMenuItem(item.id) },
    ]);
  }

  const stockDot: Record<StockLevel, string> = { high: Colors.emerald, low: Colors.gold, out: Colors.rose };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>เมนู & สต็อก</Text>
          <Text style={styles.sub}>{items.length} รายการ</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addText}>+ เพิ่ม</Text>
        </TouchableOpacity>
      </View>

      <StockAlertBanner items={items} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {FILTERS.map((f) => <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />)}
      </ScrollView>

      <FlashList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.itemRow} onLongPress={() => handleDelete(item)} onPress={() => openEdit(item)}>
            <FoodTile emoji={(item as any).emoji ?? '🍜'} index={index} size={48} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, !item.active && styles.itemNameOff]}>{item.nameTh}</Text>
              <View style={styles.itemMeta}>
                <View style={[styles.stockDot, { backgroundColor: stockDot[item.stock] }]} />
                <Text style={styles.itemPrice}>฿{item.price}</Text>
                <Text style={styles.stockLabel}>{STOCK_LABELS[item.stock]}</Text>
              </View>
            </View>
            <AnimatedToggle value={item.active} onToggle={() => toggleMenuItemActive(item.id, !item.active)} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</Text>
            <ScrollView>
              {[
                { label: 'ชื่อไทย *', key: 'nameTh', ph: 'เช่น ผัดกะเพรา' },
                { label: 'ชื่ออังกฤษ', key: 'nameEn', ph: 'Basil Stir Fry' },
                { label: 'ราคา (บาท) *', key: 'price', ph: '55', numeric: true },
              ].map((f) => (
                <View key={f.key} style={{ marginBottom: Spacing.md }}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.fieldInput}
                    value={(form as any)[f.key]}
                    onChangeText={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                    placeholder={f.ph}
                    placeholderTextColor={Colors.ink4}
                    keyboardType={f.numeric ? 'number-pad' : 'default'}
                  />
                </View>
              ))}
              <Text style={styles.fieldLabel}>หมวดหมู่</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {CATEGORIES.map((c) => <Chip key={c} label={c} active={form.category === c} onPress={() => setForm((s) => ({ ...s, category: c }))} />)}
                </View>
              </ScrollView>
              <Text style={styles.fieldLabel}>สต็อก</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {STOCKS.map((s) => <Chip key={s} label={STOCK_LABELS[s]} active={form.stock === s} onPress={() => setForm((st) => ({ ...st, stock: s }))} />)}
                </View>
              </ScrollView>
              <View style={styles.toggleRow}>
                <Text style={styles.fieldLabel}>เมนูพิเศษ (🔥 Hot)</Text>
                <AnimatedToggle value={form.isHot} onToggle={() => setForm((s) => ({ ...s, isHot: !s.isHot }))} />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.fieldLabel}>เปิดขาย</Text>
                <AnimatedToggle value={form.active} onToggle={() => setForm((s) => ({ ...s, active: !s.active }))} />
              </View>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.saveText}>บันทึก</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: Spacing.screenPad, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h1, color: Colors.ink },
  sub: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink3 },
  addBtn: { backgroundColor: Colors.emerald, borderRadius: Radius.pill, paddingHorizontal: Spacing.md, paddingVertical: 7 },
  addText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.caption, color: Colors.white },
  filterRow: { paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.sm, gap: Spacing.xs },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md, gap: Spacing.md },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink },
  itemNameOff: { color: Colors.ink4 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 2 },
  stockDot: { width: 7, height: 7, borderRadius: 4 },
  itemPrice: { fontFamily: FontFamily.mono, fontSize: FontSize.caption, color: Colors.ink3 },
  stockLabel: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.ink4 },
  sep: { height: 1, backgroundColor: Colors.paper3, marginHorizontal: Spacing.screenPad },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: Colors.paper, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: Spacing.lg, maxHeight: '90%' },
  modalTitle: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink, marginBottom: Spacing.lg },
  fieldLabel: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.ink2, marginBottom: 6 },
  fieldInput: { borderWidth: 1.5, borderColor: Colors.paper3, borderRadius: Radius.input, padding: Spacing.md, fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink, backgroundColor: Colors.white },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  cancelBtn: { flex: 1, height: 48, borderRadius: Radius.button, borderWidth: 1.5, borderColor: Colors.paper3, justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink3 },
  saveBtn: { flex: 2, height: 48, borderRadius: Radius.button, backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center' },
  saveText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
});
