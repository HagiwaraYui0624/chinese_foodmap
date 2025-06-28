import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Restaurant } from '@/lib/types/restaurant';
import { toast } from 'sonner';

const fetchRestaurant = async (id: string): Promise<Restaurant> => {
  const response = await fetch(`/api/restaurants/${id}`);
  if (!response.ok) {
    throw new Error('店舗情報の取得に失敗しました');
  }
  const data = await response.json();
  return data.data;
};

const deleteRestaurant = async (id: string): Promise<void> => {
  const response = await fetch(`/api/restaurants/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('店舗の削除に失敗しました');
  }
};

export const useRestaurant = (id: string) => {
  const queryClient = useQueryClient();

  const {
    data: restaurant,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurants'] });
      toast.success('店舗を削除しました');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '店舗の削除に失敗しました');
    },
  });

  return {
    restaurant,
    isLoading,
    error: error?.message || null,
    refetch,
    deleteRestaurant: deleteMutation.mutateAsync,
  };
}; 