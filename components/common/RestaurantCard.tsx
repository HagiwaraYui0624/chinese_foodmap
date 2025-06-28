import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Car, Calendar } from 'lucide-react';
import { Restaurant } from '@/lib/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          <Link href={`/restaurant/${restaurant.id}`} className="hover:text-red-600">
            {restaurant.name}
          </Link>
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {restaurant.address}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {restaurant.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              {restaurant.phone}
            </div>
          )}
          
          {restaurant.price_range && (
            <Badge variant="secondary">{restaurant.price_range}</Badge>
          )}
          
          <div className="flex flex-wrap gap-2">
            {restaurant.parking && (
              <Badge variant="outline" className="flex items-center">
                <Car className="h-3 w-3 mr-1" />
                駐車場あり
              </Badge>
            )}
            
            {restaurant.reservation_required && (
              <Badge variant="outline" className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                予約必須
              </Badge>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <Link href={`/restaurant/${restaurant.id}`}>
            <Button variant="outline" className="w-full">
              詳細を見る
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}; 