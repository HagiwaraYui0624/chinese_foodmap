import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRestaurantSchema, CreateRestaurantInput } from '@/lib/validations/restaurant';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { Restaurant } from '@/lib/types/restaurant';

interface UseRestaurantFormOptions {
  onSuccess?: (restaurant: Restaurant) => void;
}

export const useRestaurantForm = (options?: UseRestaurantFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRestaurant, setError, clearError } = useRestaurantStore();

  const form = useForm<CreateRestaurantInput>({
    resolver: zodResolver(createRestaurantSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      business_hours: {},
      holidays: '',
      price_range: '',
      seating_capacity: undefined,
      parking: false,
      reservation_required: false,
      payment_methods: [],
    },
  });

  const onSubmit = async (data: CreateRestaurantInput) => {
    try {
      setIsSubmitting(true);
      clearError();

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レストランの追加に失敗しました');
      }

      const newRestaurant: Restaurant = await response.json();
      addRestaurant(newRestaurant);
      
      // フォームをリセット
      form.reset();
      
      // 成功時のコールバックを実行
      if (options?.onSuccess) {
        options.onSuccess(newRestaurant);
      }
      
      return newRestaurant;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'エラーが発生しました');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}; 