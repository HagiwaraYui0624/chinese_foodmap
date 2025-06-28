import { create } from 'zustand';
import { AuthState, User, AuthCredentials } from '@/lib/types/user';
import { authUtils } from '@/lib/utils/auth';

// クライアントサイドでのみlocalStorageを使用するためのヘルパー関数
const setLocalStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

interface AuthStore extends AuthState {
  isInitialized: boolean;
  // Actions
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authUtils.login(credentials);
      
      // トークンとユーザー情報をローカルストレージに保存
      setLocalStorage('auth_token', response.token);
      setLocalStorage('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'ログインに失敗しました',
      });
    }
  },

  signup: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authUtils.signup(credentials);
      
      // トークンとユーザー情報をローカルストレージに保存
      setLocalStorage('auth_token', response.token);
      setLocalStorage('user', JSON.stringify(response.user));
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'アカウント作成に失敗しました',
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authUtils.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'ログアウトに失敗しました',
      });
    }
  },

  checkAuth: async () => {
    // 既に初期化済みの場合は何もしない
    if (get().isInitialized) {
      return;
    }
    
    set({ isLoading: true });
    try {
      const user = await authUtils.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
})); 