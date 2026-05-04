import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';

interface Props {
  count: number;
  total: number;
  onPress: () => void;
}

export default function CartBar({ count, total, onPress }: Props) {
  if (count === 0) return null;
  return (
    <TouchableOpacity style={styles.bar} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
      <Text style={styles.label}>ดูตะกร้า</Text>
      <Text style={styles.total}>฿{total}</Text>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 16, left: Spacing.screenPad, right: Spacing.screenPad,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.ink, borderRadius: Radius.pill,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.ctaOrange,
  },
  countBadge: {
    backgroundColor: Colors.orange, width: 26, height: 26,
    borderRadius: 13, justifyContent: 'center', alignItems: 'center',
  },
  countText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.caption, color: Colors.white },
  label: { flex: 1, fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white },
  total: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.body, color: Colors.white },
  arrow: { fontSize: 20, color: Colors.ink4 },
});
