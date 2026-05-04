import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  dark?: boolean;
}

export default function ScreenWrapper({ children, style, dark }: Props) {
  return (
    <SafeAreaView
      style={[styles.root, dark ? styles.dark : styles.light, style]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  light: { backgroundColor: Colors.paper },
  dark: { backgroundColor: Colors.kitchenBg },
});
