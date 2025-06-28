'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  category: 'exterior' | 'interior' | 'food' | 'menu';
  label: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUpload = ({ 
  category, 
  label, 
  images, 
  onImagesChange, 
  maxImages = 5 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`画像は最大${maxImages}枚までアップロードできます`);
      return;
    }

    setIsUploading(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // ファイルサイズチェック（5MB以下）
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}のサイズが大きすぎます。5MB以下のファイルを選択してください。`);
          continue;
        }

        // ファイル形式チェック
        if (!file.type.startsWith('image/')) {
          alert(`${file.name}は画像ファイルではありません。`);
          continue;
        }

        // 簡易的な画像アップロード（実際のプロジェクトではSupabase Storage等を使用）
        const imageUrl = await uploadImage(file);
        newImages.push(imageUrl);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    // 実際のプロジェクトでは、Supabase StorageやCloudinary等を使用
    // ここでは簡易的にBase64エンコードを使用
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* アップロードボタン */}
          {images.length < maxImages && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                variant="outline"
                className="w-full"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    アップロード中...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    画像を選択
                  </div>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                最大{maxImages}枚までアップロード可能（5MB以下）
              </p>
            </div>
          )}

          {/* 画像プレビュー */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${label} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 画像数表示 */}
          <p className="text-sm text-gray-500">
            {images.length} / {maxImages} 枚
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 