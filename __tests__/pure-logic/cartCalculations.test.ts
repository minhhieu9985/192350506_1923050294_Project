import { calculateOrderSummary, validateStockAddition } from '../../src/utils/cartCalculations';
import { CartItem, Listing } from '../../src/types';

const mockListingA: Listing = {
  id: '1',
  sellerId: 's1',
  sellerName: 'Nguyễn Văn A',
  title: 'Giáo trình Giải tích 1',
  description: 'Sách mới 90%',
  category: 'Textbooks',
  price: 50000,
  stock: 5,
  photoUri: 'https://example.com/photo.jpg',
  createdAt: '2026-10-20T10:00:00Z',
};

const mockListingB: Listing = {
  id: '2',
  sellerId: 's2',
  sellerName: 'Trần Thị B',
  title: 'Máy tính Casio fx-580VN X',
  description: 'Dùng tốt',
  category: 'Electronics',
  price: 180000,
  stock: 2,
  photoUri: 'https://example.com/casio.jpg',
  createdAt: '2026-10-21T10:00:00Z',
};

describe('Pure Logic: cartCalculations', () => {
  describe('calculateOrderSummary', () => {
    it('returns zeroes for an empty cart', () => {
      const result = calculateOrderSummary([]);
      expect(result.itemCount).toBe(0);
      expect(result.subtotal).toBe(0);
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(0);
      expect(result.isFreeDelivery).toBe(false);
      expect(result.freeDeliveryRemaining).toBe(200000);
    });

    it('calculates subtotal and standard delivery fee when subtotal is below 200,000 VND', () => {
      const items: CartItem[] = [
        { listingId: mockListingA.id, listing: mockListingA, quantity: 2 }, // 2 * 50,000 = 100,000
      ];

      const result = calculateOrderSummary(items);
      expect(result.itemCount).toBe(2);
      expect(result.subtotal).toBe(100000);
      expect(result.deliveryFee).toBe(15000);
      expect(result.total).toBe(115000);
      expect(result.isFreeDelivery).toBe(false);
      expect(result.freeDeliveryRemaining).toBe(100000);
    });

    it('applies free delivery when subtotal meets or exceeds 200,000 VND threshold', () => {
      const items: CartItem[] = [
        { listingId: mockListingA.id, listing: mockListingA, quantity: 1 }, // 50,000
        { listingId: mockListingB.id, listing: mockListingB, quantity: 1 }, // 180,000 => subtotal = 230,000
      ];

      const result = calculateOrderSummary(items);
      expect(result.itemCount).toBe(2);
      expect(result.subtotal).toBe(230000);
      expect(result.deliveryFee).toBe(0);
      expect(result.total).toBe(230000);
      expect(result.isFreeDelivery).toBe(true);
      expect(result.freeDeliveryRemaining).toBe(0);
    });
  });

  describe('validateStockAddition', () => {
    it('allows adding within available stock limits', () => {
      const result = validateStockAddition(1, 1, 5);
      expect(result.isValid).toBe(true);
      expect(result.newQuantity).toBe(2);
      expect(result.errorMessage).toBeUndefined();
    });

    it('blocks adding when stock would be exceeded with a clear message', () => {
      const result = validateStockAddition(2, 1, 2);
      expect(result.isValid).toBe(false);
      expect(result.newQuantity).toBe(2);
      expect(result.errorMessage).toContain('Chỉ còn 2 sản phẩm');
    });

    it('blocks adding when product is out of stock', () => {
      const result = validateStockAddition(0, 1, 0);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Sản phẩm đã hết hàng');
    });
  });
});
