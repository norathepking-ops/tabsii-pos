import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { MenuItem } from '../../types';

interface Props {
  items: MenuItem[];
}

export default function StockAlertBanner({ items }: Props) {
  const low = items.filter((i) => i.stock === 'low').map((i) => i.nameTh);
  const out = items.filter((i) => i.stock === 'out').map((i) => i.nameTh);

  if (low.length === 0 && out.length === 0) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={{ flex: 1 }}>
        {out.length > 0 && <Text style={styles.outText}>หมดแล้ว: {out.join(', ')}</Text>}
        {low.length > 0 && <Text style={styles.lowText}>สต็อกต่ำ: {low.join(', ')}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.orange2, borderRadius: Radius.card,
    padding: Spacing.md, marginHorizontal: Spacing.screenPad, marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  icon: { fontSize: 18 },
  outText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.rose },
  lowText: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.orange, marginTop: 2 },
});
