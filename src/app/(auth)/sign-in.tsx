import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeColor';
import { useAuthStore } from '../../store/authStore';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { Radii, Spacing, Typography } from '../../constants/tokens';

export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const signIn = useAuthStore((s) => s.signIn);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleManualSignIn = async () => {
    const cleanStudentId = studentId.trim();
    if (!cleanStudentId) {
      setErrorMsg('Vui lòng nhập Mã số sinh viên (MSSV)');
      return;
    }
    setErrorMsg(null);
    console.log('Manual Sign-in with MSSV:', cleanStudentId, 'Email:', email);
    await signIn({
      studentId: cleanStudentId,
      email: email.trim() || undefined,
      role: 'buyer',
    });
    // Clear inputs on successful sign in
    setEmail('');
    setStudentId('');
    router.replace('/(tabs)');
  };

  const handleQuickDemo = async (role: 'buyer' | 'seller') => {
    setErrorMsg(null);
    await signIn(role);
    setEmail('');
    setStudentId('');
    Alert.alert(
      'Đăng nhập thành công',
      `Chào mừng bạn đăng nhập với vai trò: ${role === 'seller' ? 'Người bán (Seller - 23DTH102)' : 'Sinh viên mua (Buyer - 23DTH101)'}`,
      [{ text: 'Vào ứng dụng', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header Branding */}
          <View style={styles.brandContainer}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.primaryMuted },
              ]}>
              <MaterialIcons name="local-mall" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Campus Marketplace
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Nền tảng trao đổi giáo trình & đồ dùng sinh viên DNTU
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderSubtle,
              },
            ]}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Đăng nhập bằng Email sinh viên
            </Text>

            <AppInput
              label="Email trường (@dntu.edu.vn)"
              value={email}
              onChangeText={setEmail}
              placeholder="mssv@dntu.edu.vn"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errorMsg ?? undefined}
            />

            <AppInput
              label="Mã số sinh viên (MSSV)"
              value={studentId}
              onChangeText={setStudentId}
              placeholder="VD: 23DTH101"
              autoCapitalize="characters"
            />

            <AppButton
              title="Đăng nhập"
              onPress={handleManualSignIn}
              loading={isLoading}
              variant="primary"
              style={styles.submitBtn}
            />

            {/* Quick Demo Login for Examiner Viva */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                HOẶC CHỌN TÀI KHOẢN TEST VIVA
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.demoButtonsRow}>
              <AppButton
                title="Demo: Sinh viên Mua (Buyer)"
                onPress={() => handleQuickDemo('buyer')}
                variant="outline"
                style={styles.demoBtn}
              />
              <AppButton
                title="Demo: Sinh viên Bán (Seller)"
                onPress={() => handleQuickDemo('seller')}
                variant="secondary"
                style={styles.demoBtn}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: Radii.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 320,
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: Radii.lg,
    borderWidth: 1,
    gap: Spacing.md,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...Typography.small,
  },
  demoButtonsRow: {
    gap: Spacing.sm,
  },
  demoBtn: {
    width: '100%',
  },
});
