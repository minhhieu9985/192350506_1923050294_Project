export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId: string;
  avatarUrl?: string;
}

export type ListingCategory =
  | 'Textbooks'
  | 'Electronics'
  | 'Stationery'
  | 'Dorm Essentials'
  | 'Other';

export const CATEGORIES: ListingCategory[] = [
  'Textbooks',
  'Electronics',
  'Stationery',
  'Dorm Essentials',
  'Other',
];

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: ListingCategory;
  price: number;
  originalPrice?: number; // Dành cho Price-drop notification
  stock: number;
  photoUri: string;
  compressedSizeKb?: number;
  originalSizeKb?: number;
  createdAt: string; // ISO String
}

export interface CartItem {
  listingId: string;
  listing: Listing;
  quantity: number;
}

export interface DeliveryRule {
  type: 'campus_pickup' | 'dorm_delivery';
  freeThreshold: number; // Miễn phí giao hàng khi >= 200,000 VND
  standardFee: number;   // 15,000 VND
}

export interface OrderSummary {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFreeDelivery: number extends never ? false : boolean;
  freeDeliveryRemaining: number;
}
