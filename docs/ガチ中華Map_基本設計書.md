# ガチ中華Map 基本設計書（MVP版）

## 1. 概要

### 1.1 ドキュメント情報
- **作成日**: 2024年12月28日
- **作成者**: システム開発チーム
- **バージョン**: 1.3
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
│     users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ nickname        │
│ created_at      │
│ updated_at      │
└─────────────────┘

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
│ user_id (FK)    │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│     images      │
├─────────────────┤
│ id (PK)         │
│ restaurant_id (FK) │
│ category        │
│ image_url       │
│ file_name       │
│ file_size       │
│ mime_type       │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### 2.2 ストレージ設計

#### 2.2.1 Supabase Storage Bucket

| Bucket名 | 用途 | アクセス権限 | 説明 |
|---------|------|-------------|------|
| restaurant-images | 店舗画像保存 | public | 店舗の外装・内装・料理・メニュー画像を保存 |

**ファイル構造:**
```
restaurant-images/
├── {restaurant_id}/
│   ├── exterior/
│   │   ├── image_1234567890.jpg
│   │   └── image_1234567891.jpg
│   ├── interior/
│   │   ├── image_1234567892.jpg
│   │   └── image_1234567893.jpg
│   ├── food/
│   │   ├── image_1234567894.jpg
│   │   └── image_1234567895.jpg
│   └── menu/
│       ├── image_1234567896.jpg
│       └── image_1234567897.jpg
```

**アクセス制御:**
- 画像のアップロード: 認証済みユーザーのみ
- 画像の閲覧: パブリックアクセス可能
- 画像の削除: 店舗所有者のみ

### 2.3 テーブル定義

#### 2.3.1 users（ユーザーテーブル）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | ユーザーID |
| email | VARCHAR(255) | NOT NULL UNIQUE | メールアドレス |
| password_hash | VARCHAR(255) | NOT NULL | ハッシュ化されたパスワード |
| nickname | TEXT | NULL | ニックネーム |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

**制約:**
- `email` は一意制約（UNIQUE）

#### 2.3.2 restaurants（店舗テーブル）

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
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |
| user_id | UUID | NOT NULL | ユーザID（外部キー） |

**制約:**
- `user_id` は `users.id` を参照

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

#### 2.3.3 images（画像テーブル）

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | 画像ID |
| restaurant_id | UUID | NOT NULL | 店舗ID（外部キー） |
| category | VARCHAR(20) | NOT NULL | 画像カテゴリ（exterior/interior/food/menu） |
| image_url | TEXT | NOT NULL | 画像のURL |
| file_name | VARCHAR(255) | NULL | ファイル名 |
| file_size | INTEGER | NULL | ファイルサイズ（バイト） |
| mime_type | VARCHAR(100) | NULL | MIMEタイプ |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | 更新日時 |

**制約:**
- `restaurant_id` は `restaurants.id` を参照（CASCADE削除）
- `category` は `exterior`, `interior`, `food`, `menu` のいずれか

### 2.4 インデックス設計

```sql
-- users テーブル
CREATE INDEX idx_users_email ON users(email);

-- restaurants テーブル
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_address ON restaurants(address);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);

-- images テーブル
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_restaurant_id ON images(restaurant_id);
```

### 2.5 データ型定義（TypeScript）

```typescript
// ユーザー情報
interface User {
  id: string;
  email: string;
  password_hash: string;
  nickname?: string;
  created_at: string;
  updated_at: string;
}

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
  user_id: string;
}

// 画像情報
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

// 認証関連
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}
```

## 3. 画面設計

### 3.1 画面一覧

| 画面ID | 画面名 | URL | 説明 |
|--------|--------|-----|------|
| TOP | トップページ | / | 店舗一覧と検索機能 |
| DETAIL | 店舗詳細 | /restaurant/[id] | 店舗の詳細情報（編集・削除ボタン追加） |
| EDIT | 店舗編集 | /restaurant/[id]/edit | 店舗情報の編集（新規追加） |
| ADD | 店舗投稿 | /add-restaurant | 新しい店舗の投稿 |
| SEARCH | 検索結果 | /search | 検索結果の表示 |
| LOGIN | ログイン | /login | ユーザーログイン |
| SIGNUP | アカウント作成 | /signup | 新規ユーザー登録 |

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