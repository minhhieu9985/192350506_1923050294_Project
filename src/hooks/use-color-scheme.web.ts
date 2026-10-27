import { useSyncExternalStore } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

function subscribe(callback: () => void) {
  const subscription = Appearance.addChangeListener(callback);
  return () => subscription.remove();
}

function getSnapshot(): ColorSchemeName {
  return Appearance.getColorScheme() ?? 'light';
}

function getServerSnapshot(): ColorSchemeName {
  return 'light';
}

export function useColorScheme(): ColorSchemeName {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
