import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    signup,
    logout,
    checkAuth,
    clearError,
  } = useAuthStore();

  // 初回ロード時に認証状態をチェック（クライアントサイドでのみ）
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      console.log('Initializing auth...');
      checkAuth();
    }
  }, []); // 空の依存配列で1回だけ実行

  // デバッグ用のログ
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isLoading, isInitialized, user: user?.email });
  }, [isAuthenticated, isLoading, isInitialized, user]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || !isInitialized,
    error,
    login,
    signup,
    logout,
    clearError,
  };
}; 