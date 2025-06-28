import { useState } from 'react';

interface UseImageUploadOptions {
  restaurantId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useImageUpload = (options?: UseImageUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (
    file: File,
    category: 'exterior' | 'interior' | 'food' | 'menu'
  ): Promise<string> => {
    if (!options?.restaurantId) {
      throw new Error('レストランIDが必要です');
    }

    setIsUploading(true);
    try {
      // FormDataを使用してmultipart/form-dataで送信
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      // 画像データをデータベースに保存
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await fetch(`/api/restaurants/${options.restaurantId}/images`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Content-Typeは自動設定されるため、手動で設定しない
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '画像のアップロードに失敗しました');
      }

      const responseData = await response.json();
      
      if (options.onSuccess) {
        options.onSuccess();
      }

      return responseData.image_url;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '画像のアップロードに失敗しました';
      if (options.onError) {
        options.onError(errorMessage);
      }
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imageId: string): Promise<void> => {
    if (!options?.restaurantId) {
      throw new Error('レストランIDが必要です');
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const response = await fetch(`/api/restaurants/${options.restaurantId}/images?imageId=${imageId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '画像の削除に失敗しました');
      }

      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '画像の削除に失敗しました';
      if (options.onError) {
        options.onError(errorMessage);
      }
      throw error;
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
  };
}; 