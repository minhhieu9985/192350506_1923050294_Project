import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeColor';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export interface SearchBarProps {
  query: string;
  onChangeQuery: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  query,
  onChangeQuery,
  placeholder = 'Tìm tên sách, tác giả, đồ dùng...',
}: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}>
      <MaterialIcons
        name="search"
        size={22}
        color={colors.textMuted}
        style={styles.icon}
      />
      <TextInput
        value={query}
        onChangeText={onChangeQuery}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.textPrimary }]}
        accessibilityLabel="Ô tìm kiếm sách và đồ dùng"
        accessibilityRole="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.length > 0 ? (
        <TouchableOpacity
          onPress={() => onChangeQuery('')}
          accessibilityRole="button"
          accessibilityLabel="Xóa từ khóa tìm kiếm"
          style={styles.clearBtn}>
          <MaterialIcons name="close" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: Accessibility.minTouchTarget,
    borderWidth: 1,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: Accessibility.minTouchTarget,
    ...Typography.body,
  },
  clearBtn: {
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
