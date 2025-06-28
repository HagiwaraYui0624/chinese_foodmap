import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  // 初回ロード時に認証状態をチェック
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
  };
}; 