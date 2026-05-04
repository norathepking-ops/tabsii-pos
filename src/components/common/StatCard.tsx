import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';

interface Props {
  label: string;
  value: string;
  accent?: boolean;
  warning?: boolean;
}

export default function StatCard({ label, value, accent, warning }: Props) {
  return (
    <View style={[styles.card, ...(Shadows.card ? [Shadows.card] : [])]}>
      <Text style={[styles.value, accent && styles.valueAccent, warning && styles.valueWarning]}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.card,
    padding: Spacing.md,
    alignItems: 'center',
  },
  value: { fontFamily: FontFamily.monoSemiBold, fontSize: FontSize.h2, color: Colors.ink, marginBottom: 2 },
  valueAccent: { color: Colors.emerald },
  valueWarning: { color: Colors.orange },
  label: { fontFamily: FontFamily.thai, fontSize: FontSize.micro, color: Colors.ink3, textAlign: 'center' },
});
