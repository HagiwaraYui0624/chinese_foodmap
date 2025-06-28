'use client';

import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { RestaurantCard } from '@/components/common/RestaurantCard';
import { MapLink } from '@/components/common/MapLink';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRestaurant } from '@/hooks/useRestaurant';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { restaurant, isLoading, deleteRestaurant } = useRestaurant(id);
  const { isAuthenticated, user } = useAuth();

  const handleDelete = async () => {
    if (!confirm('この店舗を削除しますか？')) {
      return;
    }

    try {
      await deleteRestaurant();
      toast.success('店舗を削除しました');
      router.push('/');
    } catch {
      toast.error('店舗の削除に失敗しました');
    }
  };

  const canEdit = isAuthenticated && user && restaurant?.user_id === user.id;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-64">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ErrorMessage message="店舗情報の取得に失敗しました" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <RestaurantCard restaurant={restaurant} showDetails={true} />
              
              {canEdit && (
                <div className="mt-6 flex gap-4">
                  <Link href={`/restaurant/${restaurant.id}/edit`}>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Button>
                  </Link>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                </div>
              )}
            </div>

            <div>
              <MapLink address={restaurant.address} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 