import AsyncStorage from '@react-native-async-storage/async-storage';
import { Listing } from '../../types';

export const INITIAL_MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    sellerId: 'user_seller_01',
    sellerName: '23DTH102',
    title: 'Giáo trình Cấu trúc Dữ liệu & Giải thuật',
    description: 'Sách bìa mềm, còn mới 95%, không gạch xóa, tặng kèm tóm tắt ôn thi giữa kỳ.',
    category: 'Textbooks',
    price: 65000,
    originalPrice: 85000, // Đã giảm giá - Price drop demo!
    stock: 2,
    photoUri: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 142,
    originalSizeKb: 2450,
    createdAt: '2026-10-25T08:30:00Z',
  },
  {
    id: '2',
    sellerId: 'user_seller_02',
    sellerName: '23DTH201',
    title: 'Nguyên lý Kế toán (Tập 1 + 2)',
    description: 'Bộ sách dành cho sinh viên năm 1, có highlight các công thức quan trọng.',
    category: 'Textbooks',
    price: 90000,
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 185,
    originalSizeKb: 3120,
    createdAt: '2026-10-24T14:15:00Z',
  },
  {
    id: '3',
    sellerId: 'user_seller_01',
    sellerName: '23DTH102',
    title: 'Máy tính bỏ túi Casio fx-580VN X',
    description: 'Máy chính hãng Bitex, còn nguyên tem bảo hành, phím nảy êm, nắp còn mới.',
    category: 'Electronics',
    price: 320000,
    originalPrice: 380000, // Đã giảm giá
    stock: 1,
    photoUri: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 120,
    originalSizeKb: 1980,
    createdAt: '2026-10-26T09:00:00Z',
  },
  {
    id: '4',
    sellerId: 'user_seller_03',
    sellerName: '22DTH318',
    title: 'Đèn bàn học tích điện LED chống cận',
    description: 'Đèn 3 chế độ sáng, pin dùng liên tục 6 tiếng trong KTX khi mất điện.',
    category: 'Dorm Essentials',
    price: 110000,
    stock: 3,
    photoUri: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 165,
    originalSizeKb: 2890,
    createdAt: '2026-10-23T16:45:00Z',
  },
  {
    id: '5',
    sellerId: 'user_seller_04',
    sellerName: '24DTH421',
    title: 'Tập 5 cuốn sổ lò xo Klong Caro B5',
    description: 'Mua nhiều dùng không hết, giấy định lượng 100gsm chống thấm mực gel.',
    category: 'Stationery',
    price: 75000,
    stock: 4,
    photoUri: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 98,
    originalSizeKb: 1450,
    createdAt: '2026-10-22T11:20:00Z',
  },
  {
    id: '6',
    sellerId: 'user_seller_01',
    sellerName: '23DTH102',
    title: 'Bàn phím cơ DareU EK87 Tenkeyless',
    description: 'Switch Red gõ êm không ồn bạn cùng phòng trong ký túc xá, LED đỏ.',
    category: 'Electronics',
    price: 260000,
    stock: 0, // Hết hàng để test trạng thái stock!
    photoUri: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    compressedSizeKb: 210,
    originalSizeKb: 3600,
    createdAt: '2026-10-21T07:10:00Z',
  },
];

const STORAGE_KEY_LISTINGS = 'campus_marketplace_mock_listings';

// Helper to get all listings from AsyncStorage with initial fallback
async function getStoredListings(): Promise<Listing[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_LISTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize storage with INITIAL_MOCK_LISTINGS on first launch
    await AsyncStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(INITIAL_MOCK_LISTINGS));
    return [...INITIAL_MOCK_LISTINGS];
  } catch (err) {
    console.error('Error reading listings from AsyncStorage:', err);
    return [...INITIAL_MOCK_LISTINGS];
  }
}

// Helper to write listings to AsyncStorage
async function saveStoredListings(listings: Listing[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(listings));
  } catch (err) {
    console.error('Error saving listings to AsyncStorage:', err);
  }
}

// Simulates network delay and server operations with AsyncStorage persistence
export const mockApi = {
  async fetchListings(): Promise<Listing[]> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate patchy wifi latency
    return await getStoredListings();
  },

  async fetchListingById(id: string): Promise<Listing | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const listings = await getStoredListings();
    const found = listings.find((item) => item.id === id);
    return found ? { ...found } : null;
  },

  async createListing(newListing: Omit<Listing, 'id' | 'createdAt'>): Promise<Listing> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const created: Listing = {
      ...newListing,
      id: `listing_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const currentListings = await getStoredListings();
    const updated = [created, ...currentListings];
    await saveStoredListings(updated);
    return created;
  },

  async updateStock(id: string, newStock: number): Promise<Listing | null> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const currentListings = await getStoredListings();
    const index = currentListings.findIndex((item) => item.id === id);
    if (index === -1) return null;
    currentListings[index] = { ...currentListings[index], stock: newStock };
    await saveStoredListings(currentListings);
    return currentListings[index];
  },
};
