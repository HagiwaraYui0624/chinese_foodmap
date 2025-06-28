'use client';

import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { SearchBar } from '@/components/common/SearchBar';
import { RestaurantCard } from '@/components/common/RestaurantCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useSearchRestaurants } from '@/hooks/useSearchRestaurants';
import { useState } from 'react';

export default function HomePage() {
  const { restaurants, isLoading, error } = useRestaurants();
  const { searchRestaurants, searchResults, isSearching } = useSearchRestaurants();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      searchRestaurants({ query: query.trim() });
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  };

  const displayRestaurants = hasSearched ? searchResults : restaurants;
  const displayLoading = isLoading || isSearching;
  const isDisplayArray = Array.isArray(displayRestaurants);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ガチ中華Map
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                本格的な中華料理店の情報を共有するコミュニティサイト
              </p>
              <div className="flex justify-center">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            {error && (
              <div className="mb-6">
                <ErrorMessage message={error} />
              </div>
            )}

            {displayLoading ? (
              <div className="py-12">
                <LoadingSpinner size={32} />
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {hasSearched ? '検索結果' : 'レストラン一覧'}
                  </h2>
                  <p className="text-gray-600">
                    {isDisplayArray ? displayRestaurants.length : 0}件のレストラン
                  </p>
                </div>

                {!isDisplayArray || displayRestaurants.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      {hasSearched ? '検索条件に一致するレストランが見つかりませんでした。' : 'まだレストランが登録されていません。'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isDisplayArray && displayRestaurants.map((restaurant) => (
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
    </AuthGuard>
  );
}
