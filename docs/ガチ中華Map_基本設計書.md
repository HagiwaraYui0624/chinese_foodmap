# ガチ中華Map 基本設計書（MVP版）

## 1. 概要

### 1.1 ドキュメント情報
- **作成日**: 2024年12月28日
- **作成者**: システム開発チーム
- **バージョン**: 1.1
- **対象**: ガチ中華Map MVP版

### 1.2 設計方針
- シンプルで保守性の高い設計
- 拡張性を考慮したアーキテクチャ
- ユーザビリティを重視したUI/UX
- パフォーマンスを考慮したデータ設計

## 2. データモデル設計

### 2.1 ER図

```
┌─────────────────┐
│   restaurants   │
├─────────────────┤
│ id (PK)         │
│ name            │
│ address         │
│ phone           │
│ business_hours  │
│ holidays        │
│ price_range     │
│ seating_capacity│
│ parking         │
│ reservation_required │
│ payment_methods │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 2.2 テーブル定義

#### 2.2.1 restaurants（店舗テーブル）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | 店舗ID |
| name | VARCHAR(255) | NOT NULL | 店舗名 |
| address | TEXT | NOT NULL | 住所 |
| phone | VARCHAR(20) | NULL | 電話番号 |
| business_hours | JSONB | NULL | 営業時間（JSON形式） |
| holidays | TEXT | NULL | 定休日 |
| price_range | VARCHAR(50) | NULL | 価格帯（例：¥1000-2000） |
| seating_capacity | INTEGER | NULL | 席数 |
| parking | BOOLEAN | DEFAULT false | 駐車場の有無 |
| reservation_required | BOOLEAN | DEFAULT false | 予約必要フラグ |
| payment_methods | TEXT[] | NULL | 決済方法の配列 |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

**business_hours JSONB形式例:**
```json
{
  "monday": {"open": "11:00", "close": "22:00"},
  "tuesday": {"open": "11:00", "close": "22:00"},
  "wednesday": {"open": "11:00", "close": "22:00"},
  "thursday": {"open": "11:00", "close": "22:00"},
  "friday": {"open": "11:00", "close": "23:00"},
  "saturday": {"open": "11:00", "close": "23:00"},
  "sunday": {"open": "11:00", "close": "21:00"}
}
```

### 2.3 インデックス設計

```sql
-- restaurants テーブル
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_address ON restaurants(address);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
```

### 2.4 データ型定義（TypeScript）

```typescript
// 店舗情報
interface Restaurant {
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
  created_at: string;
  updated_at: string;
}

// 営業時間
interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

// 検索条件
interface SearchParams {
  query?: string;
  area?: string;
}
```

## 3. 画面設計

### 3.1 画面一覧

| 画面ID | 画面名 | URL | 説明 |
|--------|--------|-----|------|
| TOP | トップページ | / | 店舗一覧と検索機能 |
| DETAIL | 店舗詳細 | /restaurant/[id] | 店舗の詳細情報 |
| ADD | 店舗投稿 | /add-restaurant | 新しい店舗の投稿 |
| SEARCH | 検索結果 | /search | 検索結果の表示 |

### 3.2 画面詳細設計

#### 3.2.1 トップページ（TOP）

**レイアウト構成:**
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Search Bar                          │
├─────────────────────────────────────┤
│ Restaurant List                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │Card 1   │ │Card 2   │ │Card 3   │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │Card 4   │ │Card 5   │ │Card 6   │ │
│ └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

**コンポーネント構成:**
- Header
  - ロゴ
  - ナビゲーション
- SearchBar
  - 検索入力フィールド
  - 検索ボタン
- RestaurantList
  - RestaurantCard（複数）
- Footer
  - リンク
  - コピーライト

**RestaurantCard コンポーネント:**
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}
```

#### 3.2.2 店舗詳細ページ（DETAIL）

**レイアウト構成:**
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Restaurant Info                     │
│ ┌─────────────────────────────────┐ │
│ │ Name                            │ │
│ │ Address                         │ │
│ │ Phone                           │ │
│ │ Business Hours                  │ │
│ │ Price Range                     │ │
│ │ Seating Capacity                │ │
│ │ Parking                         │ │
│ │ Reservation Required            │ │
│ │ Payment Methods                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Map Link                           │
│ ┌─────────────────────────────────┐ │
│ │ [View on Google Maps]           │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Action Buttons                      │
│ [Back] [Add Restaurant]             │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

**コンポーネント構成:**
- RestaurantInfo
  - 基本情報表示
  - 営業時間表示
  - 施設情報表示
- MapLink
  - Google Mapsへのリンク
- ActionButtons
  - 戻るボタン
  - 店舗投稿ボタン

#### 3.2.3 店舗投稿ページ（ADD）

**レイアウト構成:**
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Restaurant Form                     │
│ ┌─────────────────────────────────┐ │
│ │ Basic Information               │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Name: [_________________]   │ │ │
│ │ │ Address: [________________] │ │ │
│ │ │ Phone: [_________________]  │ │ │
│ │ └─────────────────────────────┘ │ │
│ │                                 │ │
│ │ Business Information            │ │
│ │ ┌─────────────────────────────┐ │ │
│ │ │ Business Hours              │ │ │
│ │ │ Holidays: [_______________] │ │ │
│ │ │ Price Range: [____________] │ │ │
│ │ │ Seating Capacity: [_______] │ │ │
│ │ │ Parking: [Yes/No]          │ │ │
│ │ │ Reservation Required: [Y/N] │ │ │
│ │ │ Payment Methods: [________] │ │ │
│ │ └─────────────────────────────┘ │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Action Buttons                      │
│ [Cancel] [Submit]                   │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

**フォーム項目:**
- 基本情報
  - 店舗名（必須）
  - 住所（必須）
  - 電話番号
- 営業情報
  - 営業時間
  - 定休日
  - 価格帯
  - 席数
  - 駐車場の有無
  - 予約必要フラグ
  - 決済方法

#### 3.2.4 検索結果ページ（SEARCH）

**レイアウト構成:**
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Search Bar                          │
├─────────────────────────────────────┤
│ Search Results                      │
│ ┌─────────────────────────────────┐ │
│ │ Results: 15 restaurants found   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │Card 1   │ │Card 2   │ │Card 3   │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │Card 4   │ │Card 5   │ │Card 6   │ │
│ └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

## 4. 画面遷移設計

### 4.1 画面遷移図

```
                    ┌─────────────┐
                    │    TOP      │
                    │   (/)       │
                    └─────────────┘
                           │
                           │ 検索実行
                           ▼
                    ┌─────────────┐
                    │   SEARCH    │
                    │  (/search)  │
                    └─────────────┘
                           │
                           │ 店舗選択
                           ▼
                    ┌─────────────┐
                    │   DETAIL    │
                    │(/restaurant/│
                    │    [id])    │
                    └─────────────┘
                           │
                           │ 戻る
                           │
                    ┌─────────────┐
                    │    TOP      │
                    │   (/)       │
                    └─────────────┘
```

### 4.2 遷移条件詳細

#### 4.2.1 TOP → SEARCH
- **トリガー**: 検索ボタンクリック
- **条件**: 検索クエリが入力されている
- **パラメータ**: query, area

#### 4.2.2 TOP → DETAIL
- **トリガー**: 店舗カードクリック
- **パラメータ**: restaurant_id

#### 4.2.3 TOP → ADD
- **トリガー**: 「店舗を投稿」ボタンクリック

#### 4.2.4 SEARCH → DETAIL
- **トリガー**: 検索結果の店舗カードクリック
- **パラメータ**: restaurant_id

#### 4.2.5 DETAIL → TOP
- **トリガー**: 「戻る」ボタンクリック
- **条件**: ブラウザの戻るボタンまたはナビゲーション

#### 4.2.6 ADD → TOP
- **トリガー**: 投稿完了
- **条件**: フォーム送信成功
- **処理**: 成功メッセージ表示後、TOPページにリダイレクト

### 4.3 エラーハンドリング

#### 4.3.1 404エラー
- 存在しない店舗IDでアクセス
- 存在しないページへのアクセス
- **対応**: 404ページ表示

#### 4.3.2 バリデーションエラー
- 必須項目未入力
- 不正なデータ形式
- **対応**: エラーメッセージ表示、フォーム再表示

#### 4.3.3 サーバーエラー
- API通信エラー
- データベースエラー
- **対応**: エラーページ表示

## 5. コンポーネント設計

### 5.1 共通コンポーネント

#### 5.1.1 Header
```typescript
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}
```

#### 5.1.2 SearchBar
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
}
```

#### 5.1.3 RestaurantCard
```typescript
interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  showDetails?: boolean;
}
```

### 5.2 ページコンポーネント

#### 5.2.1 TopPage
```typescript
interface TopPageProps {
  restaurants: Restaurant[];
  onSearch: (params: SearchParams) => void;
  onRestaurantClick: (id: string) => void;
  onAddRestaurant: () => void;
}
```

#### 5.2.2 DetailPage
```typescript
interface DetailPageProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddRestaurant: () => void;
}
```

#### 5.2.3 AddPage
```typescript
interface AddPageProps {
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
}
```

## 6. API設計

### 6.1 エンドポイント一覧

| メソッド | エンドポイント | 説明 | パラメータ |
|---------|---------------|------|-----------|
| GET | /api/restaurants | 店舗一覧取得 | page, limit |
| GET | /api/restaurants/[id] | 店舗詳細取得 | id |
| POST | /api/restaurants | 店舗追加 | restaurant data |
| GET | /api/restaurants/search | 店舗検索 | query, area |

### 6.2 レスポンス形式

#### 6.2.1 成功レスポンス
```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

#### 6.2.2 エラーレスポンス
```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}
```

### 6.3 データフロー

```
Frontend → API Route → Supabase Client → Database
    ↑                                           ↓
    ←────────── Response ←──────────────────────┘
```

## 7. 状態管理設計

### 7.1 Zustand Store

```typescript
interface AppState {
  // 店舗データ
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  
  // 検索状態
  searchQuery: string;
  searchResults: Restaurant[];
  
  // UI状態
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRestaurants: () => Promise<void>;
  searchRestaurants: (query: string) => Promise<void>;
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  clearError: () => void;
}
```

### 7.2 TanStack Query

```typescript
// 店舗一覧取得
const useRestaurants = () => {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: () => fetchRestaurants(),
  });
};

// 店舗詳細取得
const useRestaurant = (id: string) => {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });
};

// 検索
const useSearchRestaurants = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchRestaurants(query),
    enabled: !!query,
  });
};
```

## 8. セキュリティ設計

### 8.1 入力値検証

#### 8.1.1 フロントエンド（Zod）
```typescript
const restaurantSchema = z.object({
  name: z.string().min(1, '店舗名は必須です').max(255),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().optional(),
  price_range: z.string().optional(),
  seating_capacity: z.number().positive().optional(),
  parking: z.boolean(),
  reservation_required: z.boolean(),
  payment_methods: z.array(z.string()).optional(),
});
```

#### 8.1.2 バックエンド
- Supabase RLS（Row Level Security）の活用
- 入力値のサニタイゼーション
- SQLインジェクション対策

### 8.2 エラーハンドリング
- 機密情報の漏洩防止
- 適切なエラーメッセージ
- ログ出力の制御

## 9. パフォーマンス設計

### 9.1 フロントエンド最適化
- 画像の最適化
- コード分割（Code Splitting）
- 遅延読み込み（Lazy Loading）

### 9.2 バックエンド最適化
- データベースクエリの最適化
- キャッシュの活用
- ページネーション

### 9.3 監視・計測
- Core Web Vitals の計測
- エラー監視
- パフォーマンス監視

---

**作成日**: 2024年12月28日  
**作成者**: システム開発チーム  
**バージョン**: 1.1 