import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRestaurantSchema, CreateRestaurantInput } from '@/lib/validations/restaurant';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { Restaurant } from '@/lib/types/restaurant';

interface UseRestaurantFormOptions {
  onSuccess?: (restaurant: Restaurant) => void;
  initialData?: Restaurant;
  mode?: 'create' | 'edit';
}

export const useRestaurantForm = (options?: UseRestaurantFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addRestaurant, updateRestaurant, setError, clearError } = useRestaurantStore();

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

  // 初期データがある場合はフォームに設定
  useEffect(() => {
    if (options?.initialData && options.mode === 'edit') {
      form.reset({
        name: options.initialData.name,
        address: options.initialData.address,
        phone: options.initialData.phone || '',
        business_hours: options.initialData.business_hours || {},
        holidays: options.initialData.holidays || '',
        price_range: options.initialData.price_range || '',
        seating_capacity: options.initialData.seating_capacity,
        parking: options.initialData.parking,
        reservation_required: options.initialData.reservation_required,
        payment_methods: options.initialData.payment_methods || [],
      });
    }
  }, [options?.initialData, options?.mode, form]);

  const onSubmit = async (data: CreateRestaurantInput) => {
    try {
      setIsSubmitting(true);
      clearError();

      const url = options?.mode === 'edit' && options?.initialData 
        ? `/api/restaurants/${options.initialData.id}`
        : '/api/restaurants';

      const method = options?.mode === 'edit' ? 'PUT' : 'POST';

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'レストランの操作に失敗しました');
      }

      const responseData = await response.json();
      const restaurant: Restaurant = responseData.data;
      
      if (options?.mode === 'edit') {
        updateRestaurant(restaurant.id, restaurant);
      } else {
        addRestaurant(restaurant);
      }
      
      // フォームをリセット（作成モードの場合のみ）
      if (options?.mode !== 'edit') {
        form.reset();
      }
      
      // 成功時のコールバックを実行
      if (options?.onSuccess) {
        options.onSuccess(restaurant);
      }
      
      return restaurant;
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