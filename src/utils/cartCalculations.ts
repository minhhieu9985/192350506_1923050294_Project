import { CartItem, OrderSummary, DeliveryRule } from '../types';

export const DEFAULT_DELIVERY_RULE: DeliveryRule = {
  type: 'campus_pickup',
  freeThreshold: 200000, // 200k VND
  standardFee: 15000,    // 15k VND
};

/**
 * Calculates subtotal, delivery fee, and grand total for cart items.
 * Pure logic function - no side effects.
 */
export function calculateOrderSummary(
  items: CartItem[],
  rule: DeliveryRule = DEFAULT_DELIVERY_RULE
): OrderSummary {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.listing.price * item.quantity,
    0
  );

  if (itemCount === 0) {
    return {
      itemCount: 0,
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      isFreeDelivery: false,
      freeDeliveryRemaining: rule.freeThreshold,
    };
  }

  const isFreeDelivery = subtotal >= rule.freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : rule.standardFee;
  const total = subtotal + deliveryFee;
  const freeDeliveryRemaining = Math.max(0, rule.freeThreshold - subtotal);

  return {
    itemCount,
    subtotal,
    deliveryFee,
    total,
    isFreeDelivery,
    freeDeliveryRemaining,
  };
}

/**
 * Validates stock availability when adding or updating item quantity.
 */
export function validateStockAddition(
  currentQuantity: number,
  delta: number,
  availableStock: number
): {
  isValid: boolean;
  newQuantity: number;
  errorMessage?: string;
} {
  const targetQuantity = currentQuantity + delta;

  if (targetQuantity < 0) {
    return {
      isValid: false,
      newQuantity: currentQuantity,
      errorMessage: 'Số lượng không thể nhỏ hơn 0',
    };
  }

  if (availableStock <= 0) {
    return {
      isValid: false,
      newQuantity: 0,
      errorMessage: 'Sản phẩm đã hết hàng',
    };
  }

  if (targetQuantity > availableStock) {
    return {
      isValid: false,
      newQuantity: currentQuantity,
      errorMessage: `Chỉ còn ${availableStock} sản phẩm trong kho của người bán`,
    };
  }

  return {
    isValid: true,
    newQuantity: targetQuantity,
  };
}
