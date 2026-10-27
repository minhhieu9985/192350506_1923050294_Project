import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTheme } from '../hooks/useThemeColor';
import { useAuthStore } from '../store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

export default function RootLayout() {
  const { isDark, colors } = useTheme();
  const initSession = useAuthStore((s) => s.initSession);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
