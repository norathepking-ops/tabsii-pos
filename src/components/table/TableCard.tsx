import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, Spacing, Radius } from '../../theme';
import { Table } from '../../types';

interface Props {
  table: Table;
  onPress: () => void;
}

function getMinutesOpen(table: Table): number {
  if (!table.openedAt) return 0;
  const ms = Date.now() - table.openedAt.toMillis();
  return Math.floor(ms / 60000);
}

export default function TableCard({ table, onPress }: Props) {
  const minutes = getMinutesOpen(table);
  const isAlert = table.status === 'busy' && minutes > 30;

  const ring = useSharedValue(1);
  useEffect(() => {
    if (isAlert) {
      ring.value = withRepeat(
        withSequence(withTiming(1.08, { duration: 900 }), withTiming(1, { duration: 900 })),
        -1
      );
    }
  }, [isAlert]);
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ring.value }] }));

  const cardStyle = [
    styles.card,
    table.status === 'busy' && styles.cardBusy,
    table.status === 'paying' && styles.cardPaying,
    table.status === 'reserved' && styles.cardReserved,
  ];

  return (
    <Animated.View style={[isAlert && ringStyle]}>
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        <Text style={[styles.num, table.status !== 'free' && styles.numLight]}>
          {table.number}
        </Text>
        {table.status === 'free' && (
          <Text style={styles.seats}>{table.seats} ที่นั่ง</Text>
        )}
        {table.status === 'busy' && (
          <Text style={styles.sub}>{minutes > 0 ? `${minutes} นาที` : 'เพิ่งเปิด'}</Text>
        )}
        {table.status === 'paying' && (
          <Text style={styles.sub}>รอชำระ</Text>
        )}
        {table.status === 'reserved' && (
          <Text style={styles.sub} numberOfLines={1}>{table.reservedFor ?? 'จอง'}</Text>
        )}
        {isAlert && (
          <View style={styles.alertDot} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: Spacing.xs, padding: Spacing.sm, borderRadius: Radius.card,
    backgroundColor: Colors.paper2, borderWidth: 1.5, borderColor: Colors.paper3,
    aspectRatio: 1, justifyContent: 'center', alignItems: 'center',
  },
  cardBusy: { backgroundColor: Colors.emerald, borderColor: Colors.emerald2 },
  cardPaying: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  cardReserved: {
    backgroundColor: 'transparent', borderColor: Colors.gold,
    borderStyle: 'dashed', borderWidth: 2,
  },
  num: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h2, color: Colors.ink3 },
  numLight: { color: Colors.white },
  seats: { fontFamily: FontFamily.thai, fontSize: FontSize.micro, color: Colors.ink4, marginTop: 2 },
  sub: { fontFamily: FontFamily.thai, fontSize: FontSize.micro, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  alertDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.orange,
  },
});
