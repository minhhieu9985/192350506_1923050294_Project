import React, { useState } from 'react';
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
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.danger;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text
        style={[
          styles.label,
          { color: isFocused ? colors.primary : colors.textSecondary },
        ]}
        accessibilityRole="text">
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 1.5 : 1,
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
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
  },
  errorText: {
    ...Typography.small,
  },
});
