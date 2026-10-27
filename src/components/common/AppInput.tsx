import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useThemeColor';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function AppInput({
  label,
  error,
  containerStyle,
  style,
  ...props
}: AppInputProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[styles.label, { color: colors.textSecondary }]}
        accessibilityRole="text">
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            borderColor: error ? colors.danger : colors.border,
          },
          style,
        ]}
        accessibilityLabel={label}
        {...props}
      />
      {error ? (
        <Text
          style={[styles.errorText, { color: colors.danger }]}
          accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    ...Typography.captionBold,
  },
  input: {
    minHeight: Accessibility.minTouchTarget,
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
  },
  errorText: {
    ...Typography.small,
  },
});
