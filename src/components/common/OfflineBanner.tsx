import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeColor';
import { Spacing, Typography } from '../../constants/tokens';

export interface OfflineBannerProps {
  isOffline: boolean;
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  const { colors } = useTheme();

  if (!isOffline) return null;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.offlineBannerBg }]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel="Thông báo ngoại tuyến: Bạn đang ở chế độ offline, hiển thị dữ liệu đã lưu từ bộ nhớ tạm">
      <MaterialIcons
        name="cloud-off"
        size={18}
        color={colors.offlineBannerText}
      />
      <Text style={[styles.text, { color: colors.offlineBannerText }]}>
        Offline – showing cached data
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  text: {
    ...Typography.small,
    fontWeight: '600',
  },
});
