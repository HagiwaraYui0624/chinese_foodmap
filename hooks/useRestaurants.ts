import { useEffect } from 'react';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { Restaurant } from '@/lib/types/restaurant';

export const useRestaurants = () => {
  const {
    restaurants,
    isLoading,
    error,
    setRestaurants,
    setLoading,
    setError,
    clearError
  } = useRestaurantStore();

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      clearError();

      const response = await fetch('/api/restaurants');
      
      if (!response.ok) {
        throw new Error('レストラン一覧の取得に失敗しました');
      }

      const json = await response.json();
      setRestaurants(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return {
    restaurants,
    isLoading,
    error,
    refetch: fetchRestaurants
  };
}; 