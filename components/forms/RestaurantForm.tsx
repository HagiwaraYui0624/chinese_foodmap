import { useRestaurantForm } from '@/hooks/useRestaurantForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Restaurant } from '@/lib/types/restaurant';

interface RestaurantFormProps {
  mode?: 'create' | 'edit';
  initialData?: Restaurant;
  onSuccess?: (restaurant: Restaurant) => void;
}

export const RestaurantForm = ({ mode = 'create', initialData, onSuccess }: RestaurantFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSuccess = (restaurant: Restaurant) => {
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

  const { form, isSubmitting, onSubmit } = useRestaurantForm({
    onSuccess: handleSuccess,
    initialData,
    mode,
  });

  return (
    <Card className="max-w-2xl mx-auto">
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
  );
}; 