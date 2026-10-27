import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEY = 'campus_marketplace_session_token';

/**
 * Cross-platform secure storage wrapper:
 * Uses Expo SecureStore on native iOS/Android, and localStorage fallback on web.
 */
export const secureStorage = {
  async saveSession(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(SESSION_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(SESSION_KEY, token);
      }
    } catch {
      // Ignore secure storage write errors
    }
  },

  async getSession(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(SESSION_KEY);
        }
        return null;
      } else {
        return await SecureStore.getItemAsync(SESSION_KEY);
      }
    } catch {
      return null;
    }
  },

  async clearSession(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(SESSION_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(SESSION_KEY);
      }
    } catch {
      // Ignore delete error
    }
  },
};
