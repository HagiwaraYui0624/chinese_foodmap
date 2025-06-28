import { useEffect } from 'react';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { Restaurant } from '@/lib/types/restaurant';

export const useRestaurant = (id: string) => {
  const {
    selectedRestaurant,
    isLoading,
    error,
    setSelectedRestaurant,
    setLoading,
    setError,
    clearError
  } = useRestaurantStore();

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch(`/api/restaurants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('レストランが見つかりません');
        }
        throw new Error('レストラン詳細の取得に失敗しました');
      }

      const data: Restaurant = await response.json();
      setSelectedRestaurant(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  return {
    restaurant: selectedRestaurant,
    isLoading,
    error,
    refetch: fetchRestaurant
  };
}; 