import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

interface Props {
  color?: string;
}

export default function DashedLine({ color = Colors.paper3 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: 28 }).map((_, i) => (
        <View key={i} style={[styles.dash, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  dash: { width: 6, height: 1.5 },
});
