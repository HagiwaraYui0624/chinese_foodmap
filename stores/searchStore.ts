import { create } from 'zustand';
import { SearchParams } from '@/lib/types/restaurant';

interface SearchState {
  searchParams: SearchParams;
  searchResults: any[];
  isSearching: boolean;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setSearchResults: (results: any[]) => void;
  setSearching: (searching: boolean) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchParams: {},
  searchResults: [],
  isSearching: false,

  setSearchParams: (params) => set((state) => ({
    searchParams: { ...state.searchParams, ...params }
  })),

  setSearchResults: (results) => set({ searchResults: results }),

  setSearching: (isSearching) => set({ isSearching }),

  clearSearch: () => set({
    searchParams: {},
    searchResults: [],
    isSearching: false
  }),
})); 