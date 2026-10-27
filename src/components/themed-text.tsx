import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useTheme } from '../hooks/useThemeColor';
import { Typography, ColorKey } from '../constants/tokens';

export type ThemedTextProps = TextProps & {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'captionBold' | 'small';
  colorKey?: ColorKey;
};

export function ThemedText({
  style,
  variant = 'body',
  colorKey = 'textPrimary',
  ...rest
}: ThemedTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        { color: colors[colorKey] },
        styles[variant],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h1: Typography.h1,
  h2: Typography.h2,
  h3: Typography.h3,
  body: Typography.body,
  bodyBold: Typography.bodyBold,
  caption: Typography.caption,
  captionBold: Typography.captionBold,
  small: Typography.small,
});
