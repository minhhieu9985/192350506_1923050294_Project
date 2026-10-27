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
  const isOutOfStock = listing.stock <= 0;
  const hasPriceDrop =
    listing.originalPrice && listing.originalPrice > listing.price;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Sách: ${listing.title}, giá: ${formatCurrency(listing.price)}, danh mục: ${listing.category}, ${isOutOfStock ? 'hết hàng' : `còn ${listing.stock} sản phẩm`}`}
      accessibilityHint="Nhấn đúp để mở màn hình chi tiết sản phẩm"
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
        <Image
          source={{ uri: listing.photoUri }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Ảnh bìa của ${listing.title}`}
        />

        {/* Category Badge */}
        <View
          style={[styles.categoryBadge, { backgroundColor: colors.overlay }]}>
          <Text style={[styles.categoryText, { color: colors.primaryContrast }]}>
            {listing.category}
          </Text>
        </View>

        {/* Favourite Button */}
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
          <View style={[styles.stockOverlay, { backgroundColor: colors.overlay }]}>
            <Text style={[styles.outOfStockText, { color: colors.dangerContrast }]}>
              Hết hàng
            </Text>
          </View>
        ) : null}
      </View>

      {/* Content Container */}
      <View style={styles.infoContainer}>
        <Text
          numberOfLines={2}
          style={[styles.title, { color: colors.textPrimary }]}>
          {listing.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.seller, { color: colors.textMuted }]}>
          Người bán: {listing.sellerName}
        </Text>

        {/* Price & Actions Row */}
        <View style={styles.footerRow}>
          <View>
            <Text style={[styles.price, { color: colors.accent }]}>
              {formatCurrency(listing.price)}
            </Text>
            {hasPriceDrop && listing.originalPrice ? (
              <Text style={[styles.oldPrice, { color: colors.textMuted }]}>
                {formatCurrency(listing.originalPrice)}
              </Text>
            ) : null}
          </View>

          {/* Quick Add To Cart */}
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
    </TouchableOpacity>
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
  },
  stockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: {
    ...Typography.bodyBold,
    textTransform: 'uppercase',
  },
  infoContainer: {
    padding: Spacing.md,
    gap: Spacing.xs,
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
