import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
  useCartStore,
  selectCartItems,
  selectCartSummary,
  selectCartFeedback,
} from '../../store/cartStore';
import { StateView } from '../../components/common/StateView';
import { AppButton } from '../../components/common/AppButton';
import { useTheme } from '../../hooks/useThemeColor';
import { formatCurrency } from '../../utils/formatters';
import { Accessibility, Radii, Spacing, Typography } from '../../constants/tokens';

export default function CartScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const cartItems = useCartStore(selectCartItems);
  const summary = useCartStore(selectCartSummary);
  const feedbackMessage = useCartStore(selectCartFeedback);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      Alert.alert(
        'Đặt hàng thành công!',
        `Tổng tiền: ${formatCurrency(summary.total)}. Người bán sẽ liên hệ bạn để hẹn nhận hàng tại khuôn viên trường (Khu A / Thư viện DNTU).`,
        [
          {
            text: 'Hoàn tất',
            onPress: () => {
              clearCart();
              router.push('/(tabs)');
            },
          },
        ]
      );
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Stock warning / validation feedback banner if any */}
      {feedbackMessage ? (
        <View style={[styles.feedbackBanner, { backgroundColor: colors.warningMuted }]}>
          <MaterialIcons name="info-outline" size={18} color={colors.warning} />
          <Text style={[styles.feedbackText, { color: colors.warning }]}>
            {feedbackMessage}
          </Text>
        </View>
      ) : null}

      <StateView
        empty={cartItems.length === 0}
        emptyMessage="Giỏ hàng của bạn đang trống"
        emptyIcon="shopping-cart"
        emptyActionTitle="Tìm sách và đồ dùng ngay"
        onEmptyAction={() => router.push('/(tabs)')}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.listingId}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.itemCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderSubtle,
                },
              ]}>
              <Image
                source={{ uri: item.listing.photoUri }}
                style={styles.itemImage}
                resizeMode="cover"
              />

              <View style={styles.itemDetails}>
                <Text
                  numberOfLines={2}
                  style={[styles.itemTitle, { color: colors.textPrimary }]}>
                  {item.listing.title}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.accent }]}>
                  {formatCurrency(item.listing.price)}
                </Text>
                <Text style={[styles.itemStock, { color: colors.textMuted }]}>
                  Kho người bán còn: {item.listing.stock}
                </Text>

                {/* Quantity Controls with accessibility */}
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.listingId, -1)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Giảm số lượng ${item.listing.title}`}
                    style={[
                      styles.qtyBtn,
                      { backgroundColor: colors.surfaceRaised },
                    ]}>
                    <MaterialIcons
                      name={item.quantity === 1 ? 'delete-outline' : 'remove'}
                      size={18}
                      color={item.quantity === 1 ? colors.danger : colors.textPrimary}
                    />
                  </TouchableOpacity>

                  <Text
                    style={[styles.qtyNumber, { color: colors.textPrimary }]}
                    accessibilityLabel={`Số lượng: ${item.quantity}`}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => updateQuantity(item.listingId, 1)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Tăng số lượng ${item.listing.title}`}
                    style={[
                      styles.qtyBtn,
                      { backgroundColor: colors.surfaceRaised },
                    ]}>
                    <MaterialIcons name="add" size={18} color={colors.textPrimary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeItem(item.listingId)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`Xóa ${item.listing.title} khỏi giỏ hàng`}
                    style={styles.deleteBtn}>
                    <MaterialIcons name="close" size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderSubtle,
                },
              ]}>
              <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>
                Tóm tắt đơn hàng ({summary.itemCount} sản phẩm)
              </Text>

              {/* Subtotal */}
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Tạm tính sách & đồ dùng:
                </Text>
                <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                  {formatCurrency(summary.subtotal)}
                </Text>
              </View>

              {/* Delivery Fee with Rules */}
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Phí giao nhận tại KTX/Trường:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color: summary.isFreeDelivery
                        ? colors.success
                        : colors.textPrimary,
                    },
                  ]}>
                  {summary.isFreeDelivery
                    ? 'Miễn phí (Freeship)'
                    : formatCurrency(summary.deliveryFee)}
                </Text>
              </View>

              {/* Free delivery rule banner */}
              {!summary.isFreeDelivery ? (
                <Text style={[styles.ruleHint, { color: colors.textMuted }]}>
                  * Mua thêm {formatCurrency(summary.freeDeliveryRemaining)} để được miễn phí giao tại KTX DNTU.
                </Text>
              ) : null}

              <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

              {/* Grand Total */}
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: colors.textPrimary }]}>
                  Tổng thanh toán:
                </Text>
                <Text style={[styles.totalValue, { color: colors.accent }]}>
                  {formatCurrency(summary.total)}
                </Text>
              </View>

              <AppButton
                title="Xác nhận thanh toán"
                onPress={handleCheckout}
                loading={isCheckingOut}
                variant="primary"
                style={styles.checkoutBtn}
                accessibilityLabel="Xác nhận đặt hàng và thanh toán"
              />
            </View>
          }
        />
      </StateView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  feedbackText: {
    ...Typography.small,
    fontWeight: '600',
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  itemTitle: {
    ...Typography.bodyBold,
  },
  itemPrice: {
    ...Typography.captionBold,
  },
  itemStock: {
    ...Typography.small,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  qtyBtn: {
    width: Accessibility.minTouchTarget - 8,
    height: Accessibility.minTouchTarget - 8,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    ...Typography.bodyBold,
    minWidth: 24,
    textAlign: 'center',
  },
  deleteBtn: {
    marginLeft: 'auto',
    width: Accessibility.minTouchTarget - 8,
    height: Accessibility.minTouchTarget - 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginTop: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  summaryTitle: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...Typography.body,
  },
  summaryValue: {
    ...Typography.bodyBold,
  },
  ruleHint: {
    ...Typography.small,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  totalLabel: {
    ...Typography.h3,
  },
  totalValue: {
    ...Typography.h2,
    fontWeight: '800',
  },
  checkoutBtn: {
    marginTop: Spacing.sm,
  },
});
