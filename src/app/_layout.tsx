import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../hooks/useThemeColor';
import { useAuthStore, selectCurrentUser, selectIsAuthLoading } from '../store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 mins
      gcTime: 1000 * 60 * 60 * 24, // 24 hours offline cache
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'CAMPUS_MARKETPLACE_QUERY_CACHE',
});

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const initSession = useAuthStore((s) => s.initSession);
  const user = useAuthStore(selectCurrentUser);
  const isAuthLoading = useAuthStore(selectIsAuthLoading);

  useEffect(() => {
    initSession();
  }, [initSession]);

  // Auth Guard: ensure unauthenticated users are forced to /sign-in,
  // while authenticated users entering /sign-in are redirected to /(tabs).
  useEffect(() => {
    if (isAuthLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      console.log('Auth Guard: No active user, redirecting to /sign-in');
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      console.log('Auth Guard: User authenticated, redirecting to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [user, isAuthLoading, segments, router]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            title: 'Đăng nhập',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="listing/[id]"
          options={{
            title: 'Chi tiết sản phẩm',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name="(modal)/create-listing"
          options={{
            presentation: 'modal',
            title: 'Đăng bán sách / Đồ dùng',
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Không tìm thấy trang',
          }}
        />
      </Stack>
    </PersistQueryClientProvider>
  );
}
