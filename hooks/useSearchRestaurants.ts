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
      if (params.area) {
        searchParams.append('area', params.area);
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