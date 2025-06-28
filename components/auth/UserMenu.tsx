'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const UserMenu = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('ログアウトしました');
    } catch {
      toast.error('ログアウトに失敗しました');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogin = () => {
    console.log('Login button clicked, navigating to /login');
    router.push('/login');
  };

  const handleSignup = () => {
    console.log('Signup button clicked, navigating to /signup');
    router.push('/signup');
  };

  console.log('UserMenu render:', { isAuthenticated, isLoading, user: user?.email });

  // 認証状態が初期化中の場合
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <LoadingSpinner size={16} />
        <span className="text-sm text-gray-500">読み込み中...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          ログイン
        </Button>
        <Button 
          size="sm" 
          onClick={handleSignup}
          disabled={isLoading}
        >
          新規登録
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">
        {user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
      </Button>
    </div>
  );
}; 