'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';

export const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
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

  if (!isAuthenticated || !user) {
    return (
      <div className="flex gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            ログイン
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">
            新規登録
          </Button>
        </Link>
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