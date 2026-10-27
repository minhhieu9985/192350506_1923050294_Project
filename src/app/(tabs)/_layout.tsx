import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useThemeColor';
import { useCartStore, selectCartItemCount } from '../../store/cartStore';
import { useAuthStore, selectCurrentUser } from '../../store/authStore';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export default function TabsLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const cartCount = useCartStore(selectCartItemCount);
  const currentUser = useAuthStore(selectCurrentUser);
  const switchRole = useAuthStore((s) => s.switchRole);
  const signOut = useAuthStore((s) => s.signOut);

  const handleRoleToggle = () => {
    switchRole();
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderSubtle,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          ...Typography.small,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            {/* Quick Role Switcher Pill (Should-Have Feature) */}
            <TouchableOpacity
              onPress={handleRoleToggle}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Đổi vai trò hiện tại: ${currentUser?.role === 'seller' ? 'Người bán' : 'Người mua'}`}
              style={[
                styles.roleBadge,
                {
                  backgroundColor:
                    currentUser?.role === 'seller'
                      ? colors.warningMuted
                      : colors.primaryMuted,
                  borderColor:
                    currentUser?.role === 'seller'
                      ? colors.warning
                      : colors.primary,
                },
              ]}>
              <MaterialIcons
                name={currentUser?.role === 'seller' ? 'store' : 'school'}
                size={16}
                color={
                  currentUser?.role === 'seller'
                    ? colors.warning
                    : colors.primary
                }
              />
              <Text
                style={[
                  styles.roleText,
                  {
                    color:
                      currentUser?.role === 'seller'
                        ? colors.warning
                        : colors.primary,
                  },
                ]}>
                {currentUser?.role === 'seller' ? 'Seller' : 'Buyer'}
              </Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleSignOut}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Đăng xuất khỏi ứng dụng"
              style={styles.iconBtn}>
              <MaterialIcons
                name="logout"
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Khám phá',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="storefront"
              color={typeof color === 'string' ? color : colors.textSecondary}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Yêu thích',
          tabBarLabel: 'Yêu thích',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="favorite"
              color={typeof color === 'string' ? color : colors.textSecondary}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarLabel: 'Giỏ hàng',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.cartIconWrapper}>
              <MaterialIcons
                name="shopping-cart"
                color={typeof color === 'string' ? color : colors.textSecondary}
                size={size}
              />
              {cartCount > 0 ? (
                <View
                  style={[
                    styles.cartBadge,
                    { backgroundColor: colors.danger },
                  ]}>
                  <Text
                    style={[
                      styles.cartBadgeText,
                      { color: colors.dangerContrast },
                    ]}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Spacing.md,
    gap: Spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.full,
    borderWidth: 1,
    minHeight: Accessibility.minTouchTarget - 12,
  },
  roleText: {
    ...Typography.small,
    fontWeight: '700',
  },
  iconBtn: {
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
