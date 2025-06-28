import { useSearchStore } from '@/stores/searchStore';
import { SearchParams } from '@/lib/types/restaurant';

export const useSearchRestaurants = () => {
  const {
    searchParams,
    searchResults,
    isSearching,
    setSearchParams,
    setSearchResults,
    setSearching,
    clearSearch
  } = useSearchStore();

  const searchRestaurants = async (params: SearchParams) => {
    try {
      setSearching(true);
      setSearchParams(params);

      const searchParams = new URLSearchParams();
      
      if (params.query) {
        searchParams.append('query', params.query);
      }
      if (params.price_range) {
        searchParams.append('price_range', params.price_range);
      }
      if (params.parking !== undefined) {
        searchParams.append('parking', params.parking.toString());
      }
      if (params.reservation_required !== undefined) {
        searchParams.append('reservation_required', params.reservation_required.toString());
      }

      const response = await fetch(`/api/restaurants/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('レストラン検索に失敗しました');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('検索エラー:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return {
    searchParams,
    searchResults,
    isSearching,
    searchRestaurants,
    clearSearch
  };
}; 