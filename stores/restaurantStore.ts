import { create } from 'zustand';
import { Restaurant } from '@/lib/types/restaurant';

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  setRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
  restaurants: [],
  selectedRestaurant: null,
  isLoading: false,
  error: null,

  setRestaurants: (restaurants) => set({ restaurants }),
  
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
  
  addRestaurant: (restaurant) => set((state) => ({
    restaurants: [restaurant, ...state.restaurants]
  })),
  
  updateRestaurant: (id, updates) => set((state) => ({
    restaurants: state.restaurants.map((restaurant) =>
      restaurant.id === id ? { ...restaurant, ...updates } : restaurant
    ),
    selectedRestaurant: state.selectedRestaurant?.id === id
      ? { ...state.selectedRestaurant, ...updates }
      : state.selectedRestaurant
  })),
  
  deleteRestaurant: (id) => set((state) => ({
    restaurants: state.restaurants.filter((restaurant) => restaurant.id !== id),
    selectedRestaurant: state.selectedRestaurant?.id === id ? null : state.selectedRestaurant
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
})); 