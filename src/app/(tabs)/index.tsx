import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useListings } from '../../hooks/useListingsQuery';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { useFavouritesStore } from '../../store/favouritesStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore, selectCurrentUser } from '../../store/authStore';
import { ListingCard } from '../../components/listing/ListingCard';
import { CategoryFilter } from '../../components/listing/CategoryFilter';
import { SearchBar } from '../../components/listing/SearchBar';
import { OfflineBanner } from '../../components/common/OfflineBanner';
import { StateView } from '../../components/common/StateView';
import { useTheme } from '../../hooks/useThemeColor';
import { ListingCategory } from '../../types';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isOffline } = useNetworkStatus();
  const { data: listings, isLoading, isError, error, refetch, isRefetching } = useListings();

  const isFavourite = useFavouritesStore((s) => s.isFavourite);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const addItem = useCartStore((s) => s.addItem);
  const currentUser = useAuthStore(selectCurrentUser);
  const switchRole = useAuthStore((s) => s.switchRole);

  const handleToggleRoleFromBanner = () => {
    console.log('Banner pressed! Switching role for user:', currentUser?.studentId);
    const currentRole = currentUser?.role ?? 'buyer';
    const nextRoleName = currentRole === 'buyer' ? 'Người bán (Seller)' : 'Người mua (Buyer)';
    const mssv = currentUser?.studentId ?? '';

    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined'
        ? window.confirm(
            `[Campus Marketplace]\nMSSV: ${mssv}\nVai trò hiện tại: ${currentRole === 'buyer' ? 'Người mua (Buyer)' : 'Người bán (Seller)'}\n\nBạn muốn chuyển sang ${nextRoleName}?`
          )
        : true;
      if (confirmed) {
        switchRole();
      }
      return;
    }

    Alert.alert(
      'Chuyển đổi vai trò',
      `MSSV: ${mssv}\nVai trò hiện tại: ${currentRole === 'buyer' ? 'Người mua (Buyer)' : 'Người bán (Seller)'}\n\nBạn muốn chuyển sang ${nextRoleName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: `Chuyển sang ${nextRoleName}`,
          onPress: () => {
            console.log('Confirmed switch role from banner on mobile');
            switchRole();
          },
        },
      ]
    );
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'All'>('All');
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(
      new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  };

  /**
   * CRITICAL REQUIREMENT:
   * "Category filter plus text search, both computed during render, never stored as derived state."
   */
  const filteredListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sellerName.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [listings, selectedCategory, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Offline Alert Banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* Pull-to-refresh Last-updated Timestamp Banner & Quick Role Toggle */}
      <View style={[styles.metaHeader, { backgroundColor: colors.surfaceRaised }]}>
        <Pressable
          onPress={handleToggleRoleFromBanner}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Chạm để chuyển đổi vai trò Buyer hoặc Seller"
          style={({ pressed }) => [
            styles.roleBannerPressable,
            { opacity: pressed ? 0.6 : 1 },
          ]}>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            MSSV: <Text style={{ color: colors.primary, fontWeight: '700' }}>{currentUser?.studentId}</Text> ({currentUser?.role === 'seller' ? 'Người bán 🏪' : 'Tìm mua 🎒'}) ⇄
          </Text>
        </Pressable>
        <Text style={[styles.metaText, { color: colors.textMuted }]}>
          Cập nhật: {lastUpdated}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar query={searchQuery} onChangeQuery={setSearchQuery} />
      </View>

      {/* Category Horizontal Chips */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4-State Handled Listing Content */}
      <StateView
        loading={isLoading && !listings}
        loadingMessage="Đang tải danh sách sách & đồ dùng..."
        error={isError ? error?.message || 'Không thể kết nối đến máy chủ trường' : null}
        onRetry={handleRefresh}
        empty={!isLoading && filteredListings.length === 0}
        emptyMessage={
          searchQuery.length > 0 || selectedCategory !== 'All'
            ? 'Không tìm thấy kết quả phù hợp với bộ lọc'
            : 'Chưa có sản phẩm nào được đăng bán'
        }
        emptyIcon="search-off"
        emptyActionTitle={
          searchQuery.length > 0 || selectedCategory !== 'All'
            ? 'Xóa bộ lọc tìm kiếm'
            : undefined
        }
        onEmptyAction={() => {
          setSearchQuery('');
          setSelectedCategory('All');
        }}>
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              isFavourite={isFavourite(item.id)}
              onPress={() => router.push(`/listing/${item.id}`)}
              onToggleFavourite={() => toggleFavourite(item.id)}
              onAddToCart={currentUser?.role === 'buyer' ? () => addItem(item, 1) : undefined}
            />
          )}
        />
      </StateView>

      {/* Floating Action Button (FAB) — visible to Sellers to create new listings */}
      {currentUser?.role === 'seller' && (
        <TouchableOpacity
          onPress={() => router.push('/(modal)/create-listing')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Đăng tin bán sách hoặc đồ dùng mới"
          accessibilityHint="Mở biểu mẫu đăng bán"
          style={[
            styles.fab,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.cardShadow,
            },
          ]}>
          <MaterialIcons name="add" size={28} color={colors.primaryContrast} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  roleBannerPressable: {
    paddingVertical: 2,
    paddingRight: Spacing.sm,
  },
  metaText: {
    ...Typography.small,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: 90, // Leave room for FAB and TabBar
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: Accessibility.minTouchTarget + 12,
    height: Accessibility.minTouchTarget + 12,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
});
