import React from 'react';
import { View, type ViewProps } from 'react-native';
import { useTheme } from '../hooks/useThemeColor';
import { ColorKey } from '../constants/tokens';

export type ThemedViewProps = ViewProps & {
  colorKey?: ColorKey;
};

export function ThemedView({ style, colorKey = 'background', ...rest }: ThemedViewProps) {
  const { colors } = useTheme();

  return <View style={[{ backgroundColor: colors[colorKey] }, style]} {...rest} />;
}
