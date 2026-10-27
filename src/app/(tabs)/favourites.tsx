import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useListings } from '../../hooks/useListingsQuery';
import { useFavouritesStore } from '../../store/favouritesStore';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore, selectCurrentUser } from '../../store/authStore';
import { ListingCard } from '../../components/listing/ListingCard';
import { StateView } from '../../components/common/StateView';
import { useTheme } from '../../hooks/useThemeColor';
import { Spacing } from '../../constants/tokens';

export default function FavouritesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: listings, isLoading, isError, refetch } = useListings();

  const favouriteIds = useFavouritesStore((s) => s.favouriteIds);
  const toggleFavourite = useFavouritesStore((s) => s.toggleFavourite);
  const addItem = useCartStore((s) => s.addItem);
  const currentUser = useAuthStore(selectCurrentUser);

  // Filter listings based on favourited IDs
  const favouritedListings = useMemo(() => {
    if (!listings) return [];
    return listings.filter((item) => favouriteIds.includes(item.id));
  }, [listings, favouriteIds]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StateView
        loading={isLoading && !listings}
        loadingMessage="Đang tải danh sách yêu thích..."
        error={isError ? 'Không thể tải danh sách yêu thích' : null}
        onRetry={refetch}
        empty={favouritedListings.length === 0}
        emptyMessage="Bạn chưa lưu món sách hay đồ dùng nào vào mục yêu thích"
        emptyIcon="favorite-border"
        emptyActionTitle="Khám phá ngay"
        onEmptyAction={() => router.push('/(tabs)')}>
        <FlatList
          data={favouritedListings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              isFavourite={true}
              onPress={() => router.push(`/listing/${item.id}`)}
              onToggleFavourite={() => toggleFavourite(item.id)}
              onAddToCart={currentUser?.role === 'buyer' ? () => addItem(item, 1) : undefined}
            />
          )}
        />
      </StateView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
});
