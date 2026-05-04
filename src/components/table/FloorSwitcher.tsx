import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { TableSection } from '../../types';

const FLOORS: { key: TableSection; label: string }[] = [
  { key: 'floor1', label: 'ชั้น 1' },
  { key: 'floor2', label: 'ชั้น 2' },
  { key: 'patio', label: 'ระเบียง' },
];

interface Props {
  selected: TableSection;
  onSelect: (s: TableSection) => void;
}

export default function FloorSwitcher({ selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {FLOORS.map((f) => (
        <TouchableOpacity
          key={f.key}
          style={[styles.pill, selected === f.key && styles.pillActive]}
          onPress={() => onSelect(f.key)}
        >
          <Text style={[styles.label, selected === f.key && styles.labelActive]}>{f.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: Spacing.screenPad, gap: Spacing.sm },
  pill: {
    paddingHorizontal: Spacing.lg, paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.paper2,
    borderWidth: 1.5, borderColor: Colors.paper3,
  },
  pillActive: { backgroundColor: Colors.emerald, borderColor: Colors.emerald },
  label: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  labelActive: { color: Colors.white },
});
