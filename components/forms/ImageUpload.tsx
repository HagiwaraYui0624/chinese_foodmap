'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  restaurantId: string;
  onUploadSuccess?: () => void;
}

const CATEGORIES = [
  { value: 'exterior', label: '外装' },
  { value: 'interior', label: '内装' },
  { value: 'food', label: '料理' },
  { value: 'menu', label: 'メニュー' },
];

export function ImageUpload({ restaurantId, onUploadSuccess }: ImageUploadProps) {
  const [category, setCategory] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // プレビュー生成
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !category) {
      toast.error('ファイルとカテゴリを選択してください');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const response = await fetch(`/api/restaurants/${restaurantId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'アップロードに失敗しました');
      }

      toast.success('画像をアップロードしました');
      
      // フォームをリセット
      setFile(null);
      setCategory('');
      setPreview(null);
      
      // 成功コールバック
      onUploadSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">カテゴリ</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="file">画像ファイル</Label>
        <div className="mt-2">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  クリックしてファイルを選択
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <div className="border rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!file || !category || isUploading}
        className="w-full"
      >
        {isUploading ? (
          'アップロード中...'
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            画像をアップロード
          </>
        )}
      </Button>
    </div>
  );
} 