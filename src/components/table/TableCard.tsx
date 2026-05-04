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
  const isBusy = table.status === 'busy' || table.status === 'paying';

  const scale = useSharedValue(1);
  useEffect(() => {
    if (isAlert) {
      scale.value = withRepeat(
        withSequence(withTiming(1.06, { duration: 900 }), withTiming(1, { duration: 900 })),
        -1
      );
    }
  }, [isAlert]);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const cardStyle = [
    styles.card,
    table.status === 'busy' && styles.cardBusy,
    table.status === 'paying' && styles.cardPaying,
    table.status === 'reserved' && styles.cardReserved,
  ];

  const numColor = isBusy || table.status === 'reserved' ? Colors.white : Colors.ink2;
  const subColor = isBusy ? 'rgba(255,255,255,0.85)' : Colors.ink4;

  return (
    <Animated.View style={[isAlert && scaleStyle]}>
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.8}>
        {/* Top row: number + optional alert badge */}
        <View style={styles.topRow}>
          <Text style={[styles.num, { color: numColor }]}>{table.number}</Text>
          {isAlert && <View style={styles.alertBadge}><Text style={styles.alertText}>!</Text></View>}
        </View>

        {/* Bottom info */}
        <View style={styles.bottomRow}>
          {table.status === 'free' && (
            <Text style={[styles.sub, { color: Colors.ink4, opacity: 0.8 }]}>{table.seats} ที่นั่ง</Text>
          )}
          {table.status === 'reserved' && (
            <Text style={[styles.sub, { color: Colors.gold }]} numberOfLines={1}>
              {table.reservedFor ?? 'จอง'}
            </Text>
          )}
          {table.status === 'busy' && (
            <>
              <Text style={[styles.sub, { color: subColor }]}>
                {minutes > 0 ? `${minutes} น.` : 'เพิ่งเปิด'}
              </Text>
            </>
          )}
          {table.status === 'paying' && (
            <Text style={[styles.sub, { color: 'rgba(255,255,255,0.9)' }]}>รอชำระ</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: Spacing.xs, padding: 8, borderRadius: 12,
    backgroundColor: Colors.paper2,
    aspectRatio: 1,
    flexDirection: 'column', justifyContent: 'space-between',
  },
  cardBusy: { backgroundColor: Colors.emerald },
  cardPaying: { backgroundColor: Colors.orange },
  cardReserved: {
    backgroundColor: Colors.gold + '15',
    borderWidth: 1.5, borderColor: Colors.gold, borderStyle: 'dashed',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  num: { fontFamily: FontFamily.thaiBold, fontSize: 22, lineHeight: 26 },
  alertBadge: {
    backgroundColor: Colors.orange, borderRadius: 6,
    paddingHorizontal: 5, paddingVertical: 1,
  },
  alertText: { fontFamily: FontFamily.thaiBold, fontSize: 9, color: Colors.white },
  bottomRow: {},
  sub: { fontFamily: FontFamily.thai, fontSize: 9, lineHeight: 13 },
});
