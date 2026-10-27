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
import { Spacing, Typography } from '../../constants/tokens';
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
        <ActivityIndicator size="large" color={colors.primary} />
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
        <MaterialIcons name="error-outline" size={48} color={colors.danger} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Đã xảy ra lỗi
        </Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {error}
        </Text>
        {onRetry ? (
          <AppButton
            title="Thử lại"
            onPress={onRetry}
            variant="primary"
            style={styles.actionBtn}
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
        <MaterialIcons name={emptyIcon} size={54} color={colors.textMuted} />
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
    gap: Spacing.md,
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
    marginTop: Spacing.sm,
  },
});
