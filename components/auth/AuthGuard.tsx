'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
}

export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectIfAuthenticated = false 
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
      } else if (redirectIfAuthenticated && isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectIfAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (redirectIfAuthenticated && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}; 