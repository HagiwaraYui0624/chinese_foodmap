export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone?: string;
  business_hours?: BusinessHours;
  holidays?: string;
  price_range?: string;
  seating_capacity?: number;
  parking: boolean;
  reservation_required: boolean;
  payment_methods?: string[];
  images?: RestaurantImages;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface RestaurantImages {
  exterior?: string[]; // 外装画像のURL配列
  interior?: string[]; // 内装画像のURL配列
  food?: string[]; // 料理画像のURL配列
  menu?: string[]; // メニュー画像のURL配列
}

export interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
  };
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
  images?: RestaurantImages;
}

export interface UpdateRestaurantRequest extends Partial<CreateRestaurantRequest> {
  id: string;
}

export interface SearchParams {
  query?: string;
  area?: string;
} 