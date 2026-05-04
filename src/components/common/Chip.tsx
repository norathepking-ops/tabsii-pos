import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../theme';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  dark?: boolean;
}

export default function Chip({ label, active, onPress, dark }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        dark && styles.chipDark,
        active && (dark ? styles.activeChipDark : styles.activeChip),
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          dark && styles.labelDark,
          active && (dark ? styles.activeLabelDark : styles.activeLabel),
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.chip,
    backgroundColor: Colors.paper2,
    borderWidth: 1,
    borderColor: Colors.paper3,
  },
  chipDark: { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.08)' },
  activeChip: { backgroundColor: Colors.emerald, borderColor: Colors.emerald },
  activeChipDark: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  label: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.ink3 },
  labelDark: { color: Colors.kitchenTextMuted },
  activeLabel: { color: Colors.white },
  activeLabelDark: { color: Colors.white },
});
