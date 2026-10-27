import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Listing } from '../../types';
import { useAuthStore, selectCurrentUser } from '../../store/authStore';
import { useTheme } from '../../hooks/useThemeColor';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';
import { formatCurrency } from '../../utils/formatters';

export interface ListingCardProps {
  listing: Listing;
  isFavourite?: boolean;
  onPress: () => void;
  onToggleFavourite?: () => void;
  onAddToCart?: () => void;
  style?: ViewStyle;
}

export function ListingCard({
  listing,
  isFavourite = false,
  onPress,
  onToggleFavourite,
  onAddToCart,
  style,
}: ListingCardProps) {
  const { colors } = useTheme();
  const currentUser = useAuthStore(selectCurrentUser);
  const isOutOfStock = listing.stock <= 0;
  const hasPriceDrop =
    listing.originalPrice && listing.originalPrice > listing.price;

  // Check if current logged in student is the seller of this listing
  const isOwnListing =
    (currentUser?.id && currentUser.id === listing.sellerId) ||
    (currentUser?.studentId &&
      (currentUser.studentId === listing.sellerName ||
        currentUser.studentId === listing.sellerId));

  const sellerDisplay = listing.sellerName || listing.sellerId;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderSubtle,
          shadowColor: colors.cardShadow,
        },
        style,
      ]}>
      {/* Photo Container */}
      <View style={styles.imageContainer}>
        {/* Clickable Image to view details (No nested buttons) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Ảnh bìa: ${listing.title}`}
          style={styles.imageTouchable}>
          <Image
            source={{ uri: listing.photoUri }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`Ảnh bìa của ${listing.title}`}
          />
        </TouchableOpacity>

        {/* Category Badge */}
        <View
          style={[styles.categoryBadge, { backgroundColor: colors.overlay }]}
          pointerEvents="none">
          <Text style={[styles.categoryText, { color: colors.primaryContrast }]}>
            {listing.category}
          </Text>
        </View>

        {/* Favourite Button (Sibling to imageTouchable, NOT nested) */}
        {onToggleFavourite ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggleFavourite}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              isFavourite
                ? `Bỏ thích ${listing.title}`
                : `Thêm ${listing.title} vào mục yêu thích`
            }
            style={[
              styles.favButton,
              { backgroundColor: colors.surface },
            ]}>
            <MaterialIcons
              name={isFavourite ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavourite ? colors.danger : colors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}

        {/* Stock Badge if out of stock */}
        {isOutOfStock ? (
          <View
            style={[styles.stockOverlay, { backgroundColor: colors.overlay }]}
            pointerEvents="none">
            <Text style={[styles.outOfStockText, { color: colors.dangerContrast }]}>
              Hết hàng
            </Text>
          </View>
        ) : null}
      </View>

      {/* Content Container */}
      <View style={styles.infoContainer}>
        {/* Main Title & Seller Touchable (Navigates to detail) */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Sách: ${listing.title}, giá: ${formatCurrency(listing.price)}, danh mục: ${listing.category}, ${isOutOfStock ? 'hết hàng' : `còn ${listing.stock} sản phẩm`}`}
          accessibilityHint="Nhấn đúp để mở màn hình chi tiết sản phẩm"
          style={styles.textTouchable}>
          <Text
            numberOfLines={2}
            style={[styles.title, { color: colors.textPrimary }]}>
            {listing.title}
          </Text>

          <Text
            numberOfLines={1}
            style={[styles.seller, { color: colors.textMuted }]}>
            Người bán: {sellerDisplay}
            {isOwnListing ? (
              <Text style={{ color: colors.primary, fontWeight: '700' }}> (Bạn)</Text>
            ) : null}
          </Text>
        </TouchableOpacity>

        {/* Price & Actions Row (Siblings, NOT nested) */}
        <View style={styles.footerRow}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Giá: ${formatCurrency(listing.price)}`}
            style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.accent }]}>
              {formatCurrency(listing.price)}
            </Text>
            {hasPriceDrop && listing.originalPrice ? (
              <Text style={[styles.oldPrice, { color: colors.textMuted }]}>
                {formatCurrency(listing.originalPrice)}
              </Text>
            ) : null}
          </TouchableOpacity>

          {/* Quick Add To Cart Button (Sibling, NOT nested) */}
          {onAddToCart && !isOutOfStock ? (
            <TouchableOpacity
              onPress={onAddToCart}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Thêm ${listing.title} vào giỏ hàng`}
              style={[
                styles.cartButton,
                { backgroundColor: colors.primaryMuted },
              ]}>
              <MaterialIcons
                name="add-shopping-cart"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  imageTouchable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radii.sm,
    zIndex: 1,
  },
  categoryText: {
    ...Typography.small,
    fontWeight: '600',
  },
  favButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 2,
  },
  stockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  outOfStockText: {
    ...Typography.bodyBold,
    textTransform: 'uppercase',
  },
  infoContainer: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  textTouchable: {
    gap: 2,
  },
  title: {
    ...Typography.bodyBold,
  },
  seller: {
    ...Typography.small,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  price: {
    ...Typography.h3,
    fontWeight: '700',
  },
  oldPrice: {
    ...Typography.small,
    textDecorationLine: 'line-through',
  },
  cartButton: {
    width: Accessibility.minTouchTarget,
    height: Accessibility.minTouchTarget,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
