import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useThemeColor';
import { Spacing, Typography } from '../constants/tokens';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <MaterialIcons name="sentiment-dissatisfied" size={64} color={colors.textMuted} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          404 - Trang không tồn tại
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Trang bạn tìm kiếm không có trong khuôn viên Campus Marketplace.
        </Text>

        <Link
          href="/(tabs)"
          style={[styles.link, { color: colors.primary }]}
          accessibilityRole="link"
          accessibilityLabel="Quay lại trang chủ chợ sinh viên">
          ← Quay về Trang chủ
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 300,
  },
  link: {
    ...Typography.bodyBold,
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
});
