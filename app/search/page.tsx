'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SearchBar } from '@/components/common/SearchBar';
import { RestaurantCard } from '@/components/common/RestaurantCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useSearchRestaurants } from '@/hooks/useSearchRestaurants';
import { useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { searchRestaurants, searchResults, isSearching } = useSearchRestaurants();

  useEffect(() => {
    const query = searchParams.get('query');
    const area = searchParams.get('area');

    if (query || area) {
      searchRestaurants({
        query: query || undefined,
        area: area || undefined,
      });
    }
  }, [searchParams, searchRestaurants]);

  const handleSearch = (query: string) => {
    searchRestaurants({ query });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              検索結果
            </h1>
            <div className="flex justify-center mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {isSearching ? (
            <div className="py-12">
              <LoadingSpinner size={32} />
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  検索結果
                </h2>
                <p className="text-gray-600">
                  {searchResults.length}件のレストラン
                </p>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    検索条件に一致するレストランが見つかりませんでした。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </main>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 