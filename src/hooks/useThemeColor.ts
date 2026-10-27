import { useColorScheme } from './use-color-scheme';
import { Colors, ColorTheme, ColorKey } from '../constants/tokens';

export function useTheme(): {
  colorScheme: 'light' | 'dark';
  isDark: boolean;
  colors: ColorTheme;
} {
  const scheme = useColorScheme();
  const colorScheme = scheme === 'dark' ? 'dark' : 'light';
  const colors = Colors[colorScheme];

  return {
    colorScheme,
    isDark: colorScheme === 'dark',
    colors,
  };
}

export function useThemeColor(colorKey: ColorKey): string {
  const { colors } = useTheme();
  return colors[colorKey];
}
