import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '../../theme';

interface Props {
  color?: 'emerald' | 'orange';
  size?: number;
}

export default function LiveDot({ color = 'emerald', size = 8 }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const dotColor = color === 'emerald' ? Colors.emerald : Colors.orange;

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: dotColor },
        animStyle,
      ]}
    />
  );
}
