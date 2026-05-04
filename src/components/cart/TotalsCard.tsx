import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';

interface Props {
  subtotal: number;
  discount?: number;
  serviceCharge: number;
  total: number;
}

function Row({ label, value, bold, large }: { label: string; value: string; bold?: boolean; large?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold, large && styles.large]}>{label}</Text>
      <Text style={[styles.value, bold && styles.bold, large && styles.large]}>{value}</Text>
    </View>
  );
}

export default function TotalsCard({ subtotal, discount = 0, serviceCharge, total }: Props) {
  return (
    <View style={[styles.card, ...(Shadows.card ? [Shadows.card] : [])]}>
      <Row label="ราคาอาหาร" value={`฿${subtotal}`} />
      {discount > 0 && <Row label="ส่วนลด" value={`−฿${discount}`} />}
      <Row label="Service Charge 10%" value={`฿${serviceCharge}`} />
      <View style={styles.divider} />
      <Row label="รวมทั้งสิ้น" value={`฿${total}`} bold large />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: Spacing.screenPad,
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.base,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  label: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  value: { fontFamily: FontFamily.mono, fontSize: FontSize.bodySmall, color: Colors.ink3 },
  bold: { fontFamily: FontFamily.thaiBold, color: Colors.ink },
  large: { fontSize: FontSize.h2, fontFamily: FontFamily.monoSemiBold },
  divider: { height: 1, backgroundColor: Colors.paper3, marginVertical: Spacing.sm },
});
