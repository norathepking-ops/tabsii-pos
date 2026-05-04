import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '../../theme';

const BG_COLORS = [
  Colors.emerald3, Colors.orange2, Colors.gold2, Colors.blue2, Colors.rose2, Colors.paper2,
];

interface Props {
  emoji?: string;
  index?: number;
  size?: number;
  radius?: number;
}

export default function FoodTile({ emoji = '🍜', index = 0, size = 52, radius = 12 }: Props) {
  const bg = BG_COLORS[index % BG_COLORS.length];
  return (
    <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: bg, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}
