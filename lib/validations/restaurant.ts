import { z } from 'zod';

export const businessHoursSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

export const createRestaurantSchema = z.object({
  name: z.string().min(1, '店舗名は必須です'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().optional(),
  business_hours: businessHoursSchema.optional(),
  holidays: z.string().optional(),
  price_range: z.string().optional(),
  seating_capacity: z.number().positive().optional(),
  parking: z.boolean(),
  reservation_required: z.boolean(),
  payment_methods: z.array(z.string()).optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial().extend({
  id: z.string().uuid('無効なIDです'),
});

export const searchRestaurantSchema = z.object({
  query: z.string().optional(),
  price_range: z.string().optional(),
  parking: z.boolean().optional(),
  reservation_required: z.boolean().optional(),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
export type SearchRestaurantInput = z.infer<typeof searchRestaurantSchema>; 