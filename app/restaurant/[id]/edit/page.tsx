'use client';

import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { RestaurantForm } from '@/components/forms/RestaurantForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRestaurant } from '@/hooks/useRestaurant';

export default function EditRestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { restaurant, isLoading, error } = useRestaurant(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ErrorMessage message={error || 'レストランが見つかりません'} />
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href={`/restaurant/${id}`}>
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                詳細に戻る
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold">店舗情報を編集</h1>
            <p className="text-gray-600 mt-2">{restaurant.name} の情報を編集できます</p>
          </div>

          <RestaurantForm 
            mode="edit" 
            initialData={restaurant}
            onSuccess={(updatedRestaurant) => {
              router.push(`/restaurant/${updatedRestaurant.id}`);
            }}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 