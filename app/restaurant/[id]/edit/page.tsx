'use client';

import { RestaurantForm } from '@/components/forms/RestaurantForm';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useRestaurant } from '@/hooks/useRestaurant';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

interface EditRestaurantPageProps {
  params: {
    id: string;
  };
}

export default function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { restaurant, isLoading, error } = useRestaurant(params.id);

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (error || !restaurant) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <ErrorMessage message={error || '店舗情報の取得に失敗しました'} />
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">店舗を編集</h1>
            <RestaurantForm mode="edit" initialData={restaurant} />
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
} 