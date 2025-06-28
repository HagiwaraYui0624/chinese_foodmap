'use client';

import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { MapLink } from '@/components/common/MapLink';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/hooks/useRestaurant';
import { MapPin, Phone, Clock, Car, Calendar, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const { restaurant, isLoading, error } = useRestaurant(id);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('この店舗を削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      toast({
        title: "店舗を削除しました",
        description: `${restaurant?.name} を削除しました。`,
        duration: 5000,
      });

      router.push('/');
    } catch (error) {
      toast({
        title: "エラー",
        description: "店舗の削除に失敗しました。",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ErrorMessage message={error || 'レストランが見つかりません'} />
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-between items-center">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ホームに戻る
              </Button>
            </Link>
            
            <div className="flex gap-2">
              <Link href={`/restaurant/${id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? '削除中...' : '削除'}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{restaurant.name}</CardTitle>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {restaurant.address}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
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
                </div>
                
                <div className="space-y-4">
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
                </div>
              </div>
              
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
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-center pt-4">
                <MapLink address={restaurant.address} name={restaurant.name} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 