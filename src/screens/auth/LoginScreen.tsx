import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { signInWithEmail } from '../../services/auth.service';
import { useAuthStore } from '../../store';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../theme';
import { AuthStackParamList } from '../../types';

type Nav = StackNavigationProp<AuthStackParamList, 'Login'>;

const DEV_ACCOUNTS = [
  { label: '🧑‍🍳 ครัว', email: 'kitchen@tabsii.dev', password: 'tabsii2024', role: 'kitchen' },
  { label: '🙋 เสิร์ฟ', email: 'server@tabsii.dev', password: 'tabsii2024', role: 'server' },
  { label: '💳 แคชเชียร์', email: 'cashier@tabsii.dev', password: 'tabsii2024', role: 'cashier' },
  { label: '👑 เจ้าของ', email: 'owner@tabsii.dev', password: 'tabsii2024', role: 'owner' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((s) => s.setUser);

  async function handleLogin(e?: string, p?: string) {
    const em = e ?? email;
    const pw = p ?? password;
    if (!em || !pw) { setError('กรุณากรอก Email และ Password'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await signInWithEmail(em, pw);
      setUser(user);
    } catch (err: any) {
      setError(err.message ?? 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLeaf}>🌿</Text>
          </View>
          <Text style={styles.logoText}>Tabsii POS</Text>
          <Text style={styles.subtitle}>ระบบ POS สำหรับร้านอาหาร</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>อีเมล</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor={Colors.ink4}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={[styles.label, { marginTop: Spacing.md }]}>รหัสผ่าน</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.ink4}
            secureTextEntry
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={() => handleLogin()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnText}>เข้าสู่ระบบ</Text>
            )}
          </TouchableOpacity>
        </View>

        {__DEV__ && (
          <View style={styles.devBox}>
            <Text style={styles.devTitle}>DEV — เข้าด่วน</Text>
            <View style={styles.devGrid}>
              {DEV_ACCOUNTS.map((a) => (
                <TouchableOpacity
                  key={a.role}
                  style={styles.devBtn}
                  onPress={() => handleLogin(a.email, a.password)}
                >
                  <Text style={styles.devBtnText}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.paper },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.screenPad },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoMark: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.emerald3,
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.sm,
  },
  logoLeaf: { fontSize: 32 },
  logoText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.h1, color: Colors.ink, letterSpacing: -0.5 },
  subtitle: { fontFamily: FontFamily.thai, fontSize: FontSize.bodySmall, color: Colors.ink3, marginTop: 4 },
  form: { marginBottom: Spacing.xl },
  label: { fontFamily: FontFamily.thaiMedium, fontSize: FontSize.bodySmall, color: Colors.ink2, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.paper3,
    borderRadius: Radius.input,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    fontFamily: FontFamily.latin, fontSize: FontSize.body, color: Colors.ink,
  },
  error: { fontFamily: FontFamily.thai, fontSize: FontSize.caption, color: Colors.rose, marginTop: Spacing.sm, textAlign: 'center' },
  btn: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.emerald,
    borderRadius: Radius.button,
    height: 52, justifyContent: 'center', alignItems: 'center',
    ...Shadows.ctaEmerald,
  },
  btnText: { fontFamily: FontFamily.thaiBold, fontSize: FontSize.body, color: Colors.white, letterSpacing: 0.2 },
  devBox: { marginTop: Spacing.xl, padding: Spacing.md, backgroundColor: Colors.paper2, borderRadius: Radius.card },
  devTitle: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.ink3, marginBottom: Spacing.sm },
  devGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  devBtn: {
    flex: 1, minWidth: '40%',
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.paper3,
    borderRadius: Radius.sm, paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  devBtnText: { fontFamily: FontFamily.thaiSemiBold, fontSize: FontSize.caption, color: Colors.ink2 },
});
