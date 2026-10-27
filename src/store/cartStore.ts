import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Listing, OrderSummary } from '../types';
import {
  calculateOrderSummary,
  validateStockAddition,
} from '../utils/cartCalculations';

interface CartState {
  items: CartItem[];
  feedbackMessage: string | null;
  // Actions
  addItem: (listing: Listing, quantity?: number) => boolean;
  updateQuantity: (listingId: string, delta: number) => boolean;
  removeItem: (listingId: string) => void;
  clearCart: () => void;
  clearFeedback: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      feedbackMessage: null,

      addItem: (listing: Listing, quantity = 1) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.listingId === listing.id);
        const currentQty = existing ? existing.quantity : 0;

        const validation = validateStockAddition(currentQty, quantity, listing.stock);

        if (!validation.isValid) {
          set({ feedbackMessage: validation.errorMessage ?? 'Không thể thêm vào giỏ' });
          return false;
        }

        if (existing) {
          set({
            items: currentItems.map((item) =>
              item.listingId === listing.id
                ? { ...item, quantity: validation.newQuantity }
                : item
            ),
            feedbackMessage: `Đã cập nhật: ${listing.title} (${validation.newQuantity})`,
          });
        } else {
          set({
            items: [
              ...currentItems,
              { listingId: listing.id, listing, quantity: validation.newQuantity },
            ],
            feedbackMessage: `Đã thêm ${listing.title} vào giỏ hàng`,
          });
        }
        return true;
      },

      updateQuantity: (listingId: string, delta: number) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.listingId === listingId);
        if (!item) return false;

        const validation = validateStockAddition(
          item.quantity,
          delta,
          item.listing.stock
        );

        if (!validation.isValid) {
          set({ feedbackMessage: validation.errorMessage ?? 'Giới hạn số lượng' });
          return false;
        }

        if (validation.newQuantity === 0) {
          set({
            items: currentItems.filter((i) => i.listingId !== listingId),
            feedbackMessage: `Đã xóa ${item.listing.title} khỏi giỏ`,
          });
        } else {
          set({
            items: currentItems.map((i) =>
              i.listingId === listingId
                ? { ...i, quantity: validation.newQuantity }
                : i
            ),
            feedbackMessage: null,
          });
        }
        return true;
      },

      removeItem: (listingId: string) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.listingId === listingId);
        set({
          items: currentItems.filter((i) => i.listingId !== listingId),
          feedbackMessage: item ? `Đã xóa ${item.listing.title}` : null,
        });
      },

      clearCart: () => {
        set({ items: [], feedbackMessage: null });
      },

      clearFeedback: () => {
        set({ feedbackMessage: null });
      },
    }),
    {
      name: 'campus_marketplace_cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemCount = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartSummary = (state: CartState): OrderSummary =>
  calculateOrderSummary(state.items);
export const selectCartFeedback = (state: CartState) => state.feedbackMessage;
