import { create } from 'zustand';
import { User, UserRole } from '../types';
import { secureStorage } from '../services/secureStorage';

export const DEMO_BUYER: User = {
  id: 'user_buyer_01',
  name: 'Lê Minh Quân',
  email: 'quan.lm@dntu.edu.vn',
  studentId: '23DTH101',
  role: 'buyer',
};

export const DEMO_SELLER: User = {
  id: 'user_seller_01',
  name: 'Nguyễn Hoàng Nam',
  email: 'nam.nh@dntu.edu.vn',
  studentId: '23DTH102',
  role: 'seller',
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  signIn: (role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: () => void;
  initSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  signIn: async (role: UserRole = 'buyer') => {
    set({ isLoading: true, error: null });
    try {
      const selectedUser = role === 'seller' ? DEMO_SELLER : DEMO_BUYER;
      const sessionPayload = JSON.stringify(selectedUser);
      await secureStorage.saveSession(sessionPayload);
      set({ user: selectedUser, isAuthenticated: true, isLoading: false });
    } catch {
      set({ error: 'Đăng nhập không thành công', isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await secureStorage.clearSession();
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  switchRole: () => {
    const currentUser = get().user;
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'buyer' ? 'seller' : 'buyer';
    const nextUser = nextRole === 'seller' ? DEMO_SELLER : DEMO_BUYER;
    set({ user: nextUser });
    secureStorage.saveSession(JSON.stringify(nextUser));
  },

  initSession: async () => {
    try {
      const saved = await secureStorage.getSession();
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        set({ user: parsed, isAuthenticated: true, isLoading: false });
      } else {
        // Default to demo buyer so examiner can test immediately if desired
        set({ user: DEMO_BUYER, isAuthenticated: true, isLoading: false });
        await secureStorage.saveSession(JSON.stringify(DEMO_BUYER));
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// Selectors
export const selectCurrentUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectUserRole = (state: AuthState) => state.user?.role ?? 'buyer';
export const selectIsAuthLoading = (state: AuthState) => state.isLoading;
