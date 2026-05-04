import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import FoodTile from '../common/FoodTile';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { CartItem } from '../../types';

interface Props {
  item: CartItem;
  index: number;
  onInc: () => void;
  onDec: () => void;
  onNoteChange: (note: string) => void;
}

export default function CartItemRow({ item, index, onInc, onDec, onNoteChange }: Props) {
  const [noteModal, setNoteModal] = useState(false);
  const [noteInput, setNoteInput] = useState(item.note ?? '');
  const lineTotal = item.menuItem.price * item.qty;

  function saveNote() {
    onNoteChange(noteInput);
    setNoteModal(false);
  }

  return (
    <View style={styles.row}>
      <FoodTile emoji={item.menuItem.emoji ?? '🍜'} index={index} size={44} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.menuItem.nameTh}</Text>
        <Text style={styles.unitPrice}>฿{item.menuItem.price} × {item.qty} = ฿{lineTotal}</Text>
        {item.note ? (
          <Text style={styles.note}>"{item.note}"</Text>
        ) : (
          <TouchableOpacity onPress={() => setNoteModal(true)}>
            <Text style={styles.addNote}>+ หมายเหตุ</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>฿{lineTotal}</Text>
        <View style={styles.stepper}>
          <TouchableOpacity style={styles.stepBtn} onPress={onDec}>
            <Text style={styles.stepText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.stepQty}>{item.qty}</Text>
          <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
            <Text style={styles.stepText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={noteModal} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>หมายเหตุ — {item.menuItem.nameTh}</Text>
            <TextInput
              style={styles.noteInput}
              value={noteInput}
              onChangeText={setNoteInput}
              placeholder="เช่น ไม่ใส่พริก, ไม่หวาน..."
              placeholderTextColor={Colors.ink4}
              multiline
              autoFocus
            />
            <View style={styles.noteActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setNoteModal(false)}>
                <Text style={styles.cancelText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
                <Text style={styles.saveText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: Spacing.screenPad, paddingVertical: Spacing.md, gap: Spacing.md },
  info: { flex: 1 },
  name: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink },
  unitPrice: { fontFamily: FontFamily.mono, fontSize: FontSize.caption, color: Colors.ink3, marginTop: 2 },
  note: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.orange, marginTop: 3, fontStyle: 'italic' },
  addNote: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.emerald, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 6 },
  total: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.body, color: Colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.paper2, borderRadius: Radius.pill, paddingHorizontal: 2, height: 26 },
  stepBtn: { width: 22, height: 22, justifyContent: 'center', alignItems: 'center' },
  stepText: { fontSize: 14, color: Colors.ink2, lineHeight: 18 },
  stepQty: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.caption, color: Colors.ink, minWidth: 16, textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.xl },
  noteCard: { backgroundColor: Colors.white, borderRadius: Radius.cardLg, padding: Spacing.lg },
  noteTitle: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink, marginBottom: Spacing.md },
  noteInput: {
    borderWidth: 1.5, borderColor: Colors.paper3, borderRadius: Radius.input,
    padding: Spacing.md, fontFamily: FontFamily.thai, fontSize: FontSize.body, color: Colors.ink,
    minHeight: 80, textAlignVertical: 'top',
  },
  noteActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  cancelBtn: { flex: 1, height: 44, borderRadius: Radius.button, borderWidth: 1.5, borderColor: Colors.paper3, justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.body, color: Colors.ink3 },
  saveBtn: { flex: 1, height: 44, borderRadius: Radius.button, backgroundColor: Colors.emerald, justifyContent: 'center', alignItems: 'center' },
  saveText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
});
