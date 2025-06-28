export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  business_hours?: BusinessHours;
  holidays?: string;
  price_range?: string;
  seating_capacity?: number;
  parking?: boolean;
  reservation_required?: boolean;
  payment_methods?: string[];
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface CreateRestaurantRequest {
  name: string;
  address: string;
  phone?: string;
  business_hours?: BusinessHours;
  holidays?: string;
  price_range?: string;
  seating_capacity?: number;
  parking?: boolean;
  reservation_required?: boolean;
  payment_methods?: string[];
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
  id: string;
}

export interface SearchParams {
  query?: string;
  price_range?: string;
  parking?: boolean;
  reservation_required?: boolean;
} 