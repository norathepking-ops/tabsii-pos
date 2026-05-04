import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import { Colors } from '../../theme';

interface Props {
  value: boolean;
  onToggle: () => void;
}

export default function AnimatedToggle({ value, onToggle }: Props) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 160 });
  }, [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Colors.paper3, Colors.emerald]),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 14 }],
  }));

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: { width: 36, height: 22, borderRadius: 11, padding: 3, justifyContent: 'center' },
  thumb: { width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.white },
});
