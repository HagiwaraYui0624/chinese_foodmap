import { useRestaurantForm } from '@/hooks/useRestaurantForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ImageUpload } from '@/components/forms/ImageUpload';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/lib/types/restaurant';
import { useState } from 'react';

interface RestaurantFormProps {
  mode?: 'create' | 'edit';
  initialData?: Restaurant;
  onSuccess?: (restaurant: Restaurant) => void;
}

export const RestaurantForm = ({ mode = 'create', initialData, onSuccess }: RestaurantFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  // 画像状態管理
  const [images, setImages] = useState({
    exterior: initialData?.images?.exterior || [],
    interior: initialData?.images?.interior || [],
    food: initialData?.images?.food || [],
    menu: initialData?.images?.menu || [],
  });

  const handleSuccess = async (restaurant: Restaurant) => {
    // レストラン作成後に画像をアップロード
    if (mode === 'create' && restaurant.id) {
      await uploadImagesToDatabase(restaurant.id);
    }

    if (mode === 'edit') {
      toast({
        title: "店舗情報を更新しました！",
        description: `${restaurant.name} の情報を更新しました。`,
        duration: 5000,
      });
    } else {
      toast({
        title: "店舗が追加されました！",
        description: `${restaurant.name} を登録しました。`,
        duration: 5000,
      });
      router.push('/');
    }

    if (onSuccess) {
      onSuccess(restaurant);
    }
  };

  // 画像をデータベースにアップロードする関数
  const uploadImagesToDatabase = async (restaurantId: string) => {
    console.log('画像アップロード開始:', restaurantId);
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    // 各カテゴリの画像をアップロード
    const categories: Array<'exterior' | 'interior' | 'food' | 'menu'> = ['exterior', 'interior', 'food', 'menu'];
    
    for (const category of categories) {
      const categoryImages = images[category];
      console.log(`${category}画像数:`, categoryImages.length);
      
      for (const imageUrl of categoryImages) {
        try {
          console.log(`${category}画像アップロード中:`, imageUrl.substring(0, 50) + '...');
          
          // Base64データからファイル情報を抽出
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          console.log('Blob情報:', {
            size: blob.size,
            type: blob.type,
            lastModified: new Date().getTime()
          });
          
          // FormDataを使用してmultipart/form-dataで送信
          const formData = new FormData();
          const fileName = `image_${Date.now()}.jpg`;
          formData.append('file', blob, fileName);
          formData.append('category', category);
          
          console.log('FormData内容:');
          // FormDataの内容をログ出力（TypeScriptエラー回避）
          console.log('file:', formData.get('file'));
          console.log('category:', formData.get('category'));
          
          const uploadResponse = await fetch(`/api/restaurants/${restaurantId}/images`, {
            method: 'POST',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              // Content-Typeは自動設定されるため、手動で設定しない
            },
            body: formData,
          });

          console.log('アップロードレスポンス:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            headers: Object.fromEntries(uploadResponse.headers.entries())
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            console.error(`画像アップロード失敗 (${category}):`, errorData);
          } else {
            console.log(`${category}画像アップロード成功`);
          }
        } catch (error) {
          console.error(`画像アップロードエラー (${category}):`, error);
        }
      }
    }
    
    console.log('画像アップロード完了');
  };

  const { form, isSubmitting, onSubmit } = useRestaurantForm({
    onSuccess: handleSuccess,
    initialData,
    mode,
  });

  // 画像変更ハンドラー
  const handleImagesChange = (category: keyof typeof images, newImages: string[]) => {
    const updatedImages = {
      ...images,
      [category]: newImages
    };
    
    setImages(updatedImages);
    
    // フォームの値も更新（バリデーションは発火させない）
    form.setValue('images', updatedImages, { 
      shouldValidate: false, 
      shouldDirty: false, 
      shouldTouch: false 
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'edit' ? '店舗情報を編集' : '新しいレストランを追加'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>店舗名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 中華料理 龍" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所 *</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 東京都渋谷区..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号</FormLabel>
                    <FormControl>
                      <Input placeholder="例: 03-1234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>価格帯</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="価格帯を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="¥">¥ (1,000円未満)</SelectItem>
                        <SelectItem value="¥¥">¥¥ (1,000円〜3,000円)</SelectItem>
                        <SelectItem value="¥¥¥">¥¥¥ (3,000円〜5,000円)</SelectItem>
                        <SelectItem value="¥¥¥¥">¥¥¥¥ (5,000円以上)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seating_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>座席数</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="例: 20" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="parking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>駐車場あり</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reservation_required"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>予約必須</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="holidays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>定休日</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: "月曜日", label: "月曜日" },
                        { value: "火曜日", label: "火曜日" },
                        { value: "水曜日", label: "水曜日" },
                        { value: "木曜日", label: "木曜日" },
                        { value: "金曜日", label: "金曜日" },
                        { value: "土曜日", label: "土曜日" },
                        { value: "日曜日", label: "日曜日" },
                        { value: "不定休", label: "不定休" },
                        { value: "年中無休", label: "年中無休" },
                      ].map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="holidays"
                          render={() => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value) || false}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value ? field.value.split(',').filter(Boolean) : [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.value].join(','));
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== option.value).join(','));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  {option.label}
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 画像アップロードセクション（Card内に移動） */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  category="exterior"
                  label="外装写真"
                  images={images.exterior}
                  onImagesChange={(newImages) => handleImagesChange('exterior', newImages)}
                  restaurantId={mode === 'edit' ? initialData?.id : undefined}
                />
                <ImageUpload
                  category="interior"
                  label="内装写真"
                  images={images.interior}
                  onImagesChange={(newImages) => handleImagesChange('interior', newImages)}
                  restaurantId={mode === 'edit' ? initialData?.id : undefined}
                />
                <ImageUpload
                  category="food"
                  label="料理写真"
                  images={images.food}
                  onImagesChange={(newImages) => handleImagesChange('food', newImages)}
                  restaurantId={mode === 'edit' ? initialData?.id : undefined}
                />
                <ImageUpload
                  category="menu"
                  label="メニュー写真"
                  images={images.menu}
                  onImagesChange={(newImages) => handleImagesChange('menu', newImages)}
                  restaurantId={mode === 'edit' ? initialData?.id : undefined}
                />
              </div>

              {/* 追加ボタンを一番最後に */}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    {mode === 'edit' ? '更新中...' : '追加中...'}
                  </>
                ) : (
                  mode === 'edit' ? '店舗情報を更新' : 'レストランを追加'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}; 