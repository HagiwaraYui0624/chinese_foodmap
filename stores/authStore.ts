import { create } from 'zustand';
import { AuthState, User, AuthCredentials } from '@/lib/types/user';
import { authUtils } from '@/lib/utils/auth';

interface AuthStore extends AuthState {
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
  error: null,

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authUtils.login(credentials);
      
      // トークンとユーザー情報をローカルストレージに保存
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
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
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
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
    set({ isLoading: true });
    try {
      const user = await authUtils.getCurrentUser();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
})); 