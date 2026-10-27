import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeColor';
import { Radii, Spacing, Typography } from '../../constants/tokens';
import { AppButton } from './AppButton';

export interface StateViewProps {
  loading?: boolean;
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  empty?: boolean;
  emptyMessage?: string;
  emptyIcon?: keyof typeof MaterialIcons.glyphMap;
  emptyActionTitle?: string;
  onEmptyAction?: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

/**
 * Universal 4-state container: Loading, Empty, Error (with retry), and Content.
 */
export function StateView({
  loading = false,
  loadingMessage = 'Đang tải dữ liệu...',
  error = null,
  onRetry,
  empty = false,
  emptyMessage = 'Không có dữ liệu',
  emptyIcon = 'inbox',
  emptyActionTitle,
  onEmptyAction,
  children,
  containerStyle,
}: StateViewProps) {
  const { colors } = useTheme();

  // 1. Loading State
  if (loading) {
    return (
      <View
        style={[styles.center, containerStyle]}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel={loadingMessage}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
          Đang tải dữ liệu
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {loadingMessage}
        </Text>
      </View>
    );
  }

  // 2. Error State with working retry
  if (error) {
    return (
      <View
        style={[styles.center, containerStyle]}
        accessible={true}
        accessibilityRole="alert"
        accessibilityLabel={`Lỗi: ${error}`}>
        <View style={[styles.iconCircle, { backgroundColor: colors.dangerMuted }]}>
          <MaterialIcons name="cloud-off" size={44} color={colors.danger} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
          Không thể tải dữ liệu
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {error}
        </Text>
        {onRetry ? (
          <AppButton
            title="Thử lại kết nối"
            onPress={onRetry}
            variant="primary"
            style={styles.actionBtn}
            icon={<MaterialIcons name="refresh" size={18} color={colors.primaryContrast} />}
            accessibilityLabel="Nhấn để thử lại tải dữ liệu"
          />
        ) : null}
      </View>
    );
  }

  // 3. Empty State
  if (empty) {
    return (
      <View
        style={[styles.center, containerStyle]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={emptyMessage}>
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceRaised }]}>
          <MaterialIcons name={emptyIcon} size={48} color={colors.textMuted} />
        </View>
        <Text style={[styles.title, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
          Chưa có nội dung
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {emptyMessage}
        </Text>
        {emptyActionTitle && onEmptyAction ? (
          <AppButton
            title={emptyActionTitle}
            onPress={onEmptyAction}
            variant="secondary"
            style={styles.actionBtn}
            accessibilityLabel={emptyActionTitle}
          />
        ) : null}
      </View>
    );
  }

  // 4. Content State
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.h3,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyText: {
    ...Typography.body,
    textAlign: 'center',
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: Spacing.md,
  },
});
