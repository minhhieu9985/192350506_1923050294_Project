import { useCartStore } from '../../src/store/cartStore';
import { Listing } from '../../src/types';

const mockBook: Listing = {
  id: 'book_101',
  sellerId: 'seller_01',
  sellerName: 'Nguyễn Văn A',
  title: 'Giáo trình Lập trình Di động Expo',
  description: 'Sách mới dùng 1 học kỳ',
  category: 'Textbooks',
  price: 120000,
  stock: 2, // Maximum 2 in stock
  photoUri: 'https://example.com/expo.jpg',
  createdAt: '2026-10-25T00:00:00Z',
};

describe('Critical Path Test: Cart & Checkout Workflow', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('executes full checkout lifecycle: empty -> add -> check subtotal/fee -> increase to freeship -> enforce stock limit', () => {
    const store = useCartStore.getState();

    // 1. Initial State: Empty cart
    expect(store.items).toHaveLength(0);

    // 2. Add 1 item (120,000 VND)
    const addSuccess = store.addItem(mockBook, 1);
    expect(addSuccess).toBe(true);

    let state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);

    // Check calculations: subtotal 120,000 < 200,000 threshold => deliveryFee = 15,000 => total = 135,000
    let items = state.items;
    let subtotal = items.reduce((acc, i) => acc + i.listing.price * i.quantity, 0);
    let isFreeDelivery = subtotal >= 200000;
    let deliveryFee = isFreeDelivery ? 0 : 15000;
    let total = subtotal + deliveryFee;

    expect(subtotal).toBe(120000);
    expect(deliveryFee).toBe(15000);
    expect(total).toBe(135000);
    expect(isFreeDelivery).toBe(false);

    // 3. Increase quantity by +1 (total 2 books = 240,000 VND)
    const updateSuccess = store.updateQuantity(mockBook.id, 1);
    expect(updateSuccess).toBe(true);

    state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(2);

    // Re-check calculations: subtotal 240,000 >= 200,000 threshold => deliveryFee = 0 => total = 240,000
    items = state.items;
    subtotal = items.reduce((acc, i) => acc + i.listing.price * i.quantity, 0);
    isFreeDelivery = subtotal >= 200000;
    deliveryFee = isFreeDelivery ? 0 : 15000;
    total = subtotal + deliveryFee;

    expect(subtotal).toBe(240000);
    expect(deliveryFee).toBe(0);
    expect(total).toBe(240000);
    expect(isFreeDelivery).toBe(true);

    // 4. Critical Stock Rule Enforcement: Attempting to add past stock limit of 2
    const overStockAttempt = store.updateQuantity(mockBook.id, 1);
    expect(overStockAttempt).toBe(false);

    state = useCartStore.getState();
    // Quantity should still be capped at 2
    expect(state.items[0].quantity).toBe(2);
    expect(state.feedbackMessage).toContain('Chỉ còn 2 sản phẩm');

    // 5. Clear Cart / Complete Checkout
    store.clearCart();
    state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });
});
