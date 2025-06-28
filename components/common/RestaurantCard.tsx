'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Car, Calendar } from 'lucide-react';
import { Restaurant } from '@/lib/types/restaurant';
import Link from 'next/link';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  showDetails?: boolean;
}

export const RestaurantCard = ({ restaurant, onClick, showDetails = false }: RestaurantCardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:shadow-lg' : ''}`}
      onClick={handleClick}
    >
      <CardHeader>
        <CardTitle className="text-xl">{restaurant.name}</CardTitle>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          {restaurant.address}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showDetails ? (
          <>
            {restaurant.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-600" />
                <span>{restaurant.phone}</span>
              </div>
            )}
            
            {restaurant.price_range && (
              <div>
                <span className="font-semibold">価格帯: </span>
                <Badge variant="secondary">{restaurant.price_range}</Badge>
              </div>
            )}
            
            {restaurant.seating_capacity && (
              <div>
                <span className="font-semibold">座席数: </span>
                <span>{restaurant.seating_capacity}席</span>
              </div>
            )}
            
            {restaurant.holidays && (
              <div>
                <span className="font-semibold">定休日: </span>
                <span>{restaurant.holidays}</span>
              </div>
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

            {restaurant.payment_methods && restaurant.payment_methods.length > 0 && (
              <div>
                <span className="font-semibold">支払い方法: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {restaurant.payment_methods.map((method, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {restaurant.business_hours && Object.keys(restaurant.business_hours).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  営業時間
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(restaurant.business_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}:</span>
                      <span>{hours.open} - {hours.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {restaurant.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-3 w-3 mr-1" />
                {restaurant.phone}
              </div>
            )}
            
            {restaurant.price_range && (
              <Badge variant="secondary" className="text-xs">
                {restaurant.price_range}
              </Badge>
            )}
            <div className="pt-2">
              <Link href={`/restaurant/${restaurant.id}`} passHref legacyBehavior>
                <a className="inline-block px-4 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors">詳細を見る</a>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 