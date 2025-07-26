'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface RestaurantImage {
  id: string;
  restaurant_id: string;
  category: 'exterior' | 'interior' | 'food' | 'menu';
  image_url: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  created_at: string;
  updated_at: string;
}

interface ImageGalleryProps {
  restaurantId: string;
  canEdit?: boolean;
  onImageDeleted?: () => void;
}

const CATEGORY_LABELS = {
  exterior: '外装',
  interior: '内装',
  food: '料理',
  menu: 'メニュー',
};

export function ImageGallery({ restaurantId, canEdit = false, onImageDeleted }: ImageGalleryProps) {
  const [images, setImages] = useState<RestaurantImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/images`);
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('画像の取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('この画像を削除しますか？')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(imageId));

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/images?imageId=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('画像を削除しました');
        setImages(prev => prev.filter(img => img.id !== imageId));
        onImageDeleted?.();
      } else {
        const error = await response.json();
        throw new Error(error.error || '削除に失敗しました');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '削除に失敗しました');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const groupImagesByCategory = () => {
    const grouped: Record<string, RestaurantImage[]> = {};
    images.forEach(image => {
      if (!grouped[image.category]) {
        grouped[image.category] = [];
      }
      grouped[image.category].push(image);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">画像を読み込み中...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-500">画像がありません</p>
      </div>
    );
  }

  const groupedImages = groupImagesByCategory();

  return (
    <div className="space-y-6">
      {Object.entries(groupedImages).map(([category, categoryImages]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img
                    src={image.image_url}
                    alt={image.file_name || `${category} image`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // プレースホルダー画像
                    }}
                  />
                </div>
                {canEdit && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(image.id)}
                    disabled={deletingIds.has(image.id)}
                  >
                    {deletingIds.has(image.id) ? (
                      '削除中...'
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 