import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { secureStorage } from '../services/secureStorage';

export const DEMO_BUYER: User = {
  id: 'user_23dth101',
  name: '23DTH101',
  email: '23dth101@dntu.edu.vn',
  studentId: '23DTH101',
  role: 'buyer',
};

export const DEMO_SELLER: User = {
  id: 'user_seller_01',
  name: '23DTH102',
  email: '23dth102@dntu.edu.vn',
  studentId: '23DTH102',
  role: 'seller',
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  signIn: (roleOrParams?: UserRole | { studentId: string; email?: string; role?: UserRole }) => Promise<void>;
  signOut: () => Promise<void>;
  switchRole: () => void;
  initSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  signIn: async (roleOrParams: UserRole | { studentId: string; email?: string; role?: UserRole } = 'buyer') => {
    set({ isLoading: true, error: null });
    try {
      let selectedUser: User;

      if (typeof roleOrParams === 'object') {
        const studentId = roleOrParams.studentId.trim();
        const role = roleOrParams.role || 'buyer';
        const email = roleOrParams.email?.trim() || `${studentId.toLowerCase()}@dntu.edu.vn`;
        selectedUser = {
          id: `user_${studentId.toLowerCase()}`,
          name: studentId, // User display name is their Student ID
          email,
          studentId,
          role,
        };
      } else {
        selectedUser = roleOrParams === 'seller' ? DEMO_SELLER : DEMO_BUYER;
      }

      console.log('User signed in:', selectedUser);
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
    // Also clear any cached user session in AsyncStorage for extra redundancy
    try {
      await AsyncStorage.removeItem('campus_marketplace_session_token');
      await AsyncStorage.removeItem('campus_marketplace_auth_user');
    } catch {
      // Ignore
    }
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    console.log('User signed out, state reset to null');
  },

  switchRole: () => {
    const currentUser = get().user;
    if (!currentUser) return;
    const nextRole: UserRole = currentUser.role === 'buyer' ? 'seller' : 'buyer';
    const nextUser: User = {
      ...currentUser,
      role: nextRole,
    };
    console.log('Role changed to:', nextRole, nextUser);
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
        // If no saved session, leave user null so login screen is shown
        set({ user: null, isAuthenticated: false, isLoading: false });
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
