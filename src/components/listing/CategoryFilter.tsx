import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { CATEGORIES, ListingCategory } from '../../types';
import { useTheme } from '../../hooks/useThemeColor';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export interface CategoryFilterProps {
  selectedCategory: ListingCategory | 'All';
  onSelectCategory: (category: ListingCategory | 'All') => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { colors } = useTheme();
  const allCategories: (ListingCategory | 'All')[] = ['All', ...CATEGORIES];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        accessibilityRole="tablist">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = cat === 'All' ? 'Tất cả' : cat;

          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="tab"
              accessibilityLabel={`Danh mục: ${label}`}
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : colors.surface,
                  borderColor: isSelected
                    ? colors.primary
                    : colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected
                      ? colors.primaryContrast
                      : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: Spacing.sm,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  chip: {
    minHeight: Accessibility.minTouchTarget,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    ...Typography.caption,
  },
});
