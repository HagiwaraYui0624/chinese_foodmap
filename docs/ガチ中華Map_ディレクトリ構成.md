# ガチ中華Map ディレクトリ構成

## 概要
このドキュメントは、ガチ中華Map MVP版のディレクトリ構成を定義します。Next.js 14 App Routerを使用し、TypeScript、Tailwind CSS、Supabaseを採用した構成です。

## ルートディレクトリ構成

```
ガチ中華Map/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
├── lib/                    # ユーティリティ・型定義
├── hooks/                  # カスタムフック
├── stores/                 # Zustandストア
├── public/                 # 静的ファイル
├── styles/                 # グローバルスタイル
├── docs/                   # ドキュメント
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 詳細構成

### 1. app/ (Next.js App Router)

```
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # トップページ (/)
├── globals.css             # グローバルスタイル
├── favicon.ico             # ファビコン
├── api/                    # API Routes
│   ├── auth/               # 認証関連API
│   │   ├── login/
│   │   │   └── route.ts    # POST /api/auth/login
│   │   ├── signup/
│   │   │   └── route.ts    # POST /api/auth/signup
│   │   ├── logout/
│   │   │   └── route.ts    # POST /api/auth/logout
│   │   └── me/
│   │       └── route.ts    # GET /api/auth/me
│   └── restaurants/
│       ├── route.ts        # GET, POST /api/restaurants
│       ├── search/
│       │   └── route.ts    # GET /api/restaurants/search
│       └── [id]/
│           └── route.ts    # GET, PUT, DELETE /api/restaurants/[id]（編集・削除対応）
├── restaurant/             # 店舗詳細ページ
│   └── [id]/
│       ├── page.tsx        # /restaurant/[id]
│       └── edit/
│           └── page.tsx    # /restaurant/[id]/edit（編集ページ追加）
├── add-restaurant/         # 店舗投稿ページ
│   └── page.tsx            # /add-restaurant
├── search/                 # 検索結果ページ
│   └── page.tsx            # /search
├── login/                  # ログインページ
│   └── page.tsx            # /login
└── signup/                 # アカウント作成ページ
    └── page.tsx            # /signup
```

#### 1.1 ページコンポーネント

| ファイル | URL | 説明 |
|---------|-----|------|
| `app/page.tsx` | `/` | トップページ（店舗一覧・検索） |
| `app/restaurant/[id]/page.tsx` | `/restaurant/[id]` | 店舗詳細ページ（編集・削除ボタン追加） |
| `app/restaurant/[id]/edit/page.tsx` | `/restaurant/[id]/edit` | 店舗編集ページ（新規追加） |
| `app/add-restaurant/page.tsx` | `/add-restaurant` | 店舗投稿ページ |
| `app/search/page.tsx` | `/search` | 検索結果ページ |
| `app/login/page.tsx` | `/login` | ログインページ |
| `app/signup/page.tsx` | `/signup` | アカウント作成ページ |

#### 1.2 API Routes

| ファイル | エンドポイント | メソッド | 説明 |
|---------|---------------|---------|------|
| `app/api/restaurants/route.ts` | `/api/restaurants` | GET, POST | 店舗一覧取得・追加 |
| `app/api/restaurants/[id]/route.ts` | `/api/restaurants/[id]` | GET, PUT, DELETE | 店舗詳細取得・編集・削除（編集・削除対応） |
| `app/api/restaurants/search/route.ts` | `/api/restaurants/search` | GET | 店舗検索 |
| `app/api/auth/login/route.ts` | `/api/auth/login` | POST | ログイン |
| `app/api/auth/signup/route.ts` | `/api/auth/signup` | POST | アカウント作成 |
| `app/api/auth/logout/route.ts` | `/api/auth/logout` | POST | ログアウト |
| `app/api/auth/me/route.ts` | `/api/auth/me` | GET | ユーザー情報取得 |

### 2. components/ (Reactコンポーネント)

```
components/
├── ui/                     # shadcn/ui コンポーネント
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── form.tsx
│   └── ...
├── common/                 # 共通コンポーネント
│   ├── Header.tsx          # ヘッダー（ログイン状態表示追加）
│   ├── Footer.tsx          # フッター
│   ├── SearchBar.tsx       # 検索バー
│   ├── RestaurantCard.tsx  # 店舗カード
│   ├── MapLink.tsx         # Google Mapsリンク
│   ├── LoadingSpinner.tsx  # ローディング
│   └── ErrorMessage.tsx    # エラーメッセージ
├── forms/                  # フォームコンポーネント
│   ├── RestaurantForm.tsx  # 店舗投稿・編集フォーム
│   ├── LoginForm.tsx       # ログインフォーム
│   └── SignupForm.tsx      # アカウント作成フォーム
└── auth/                   # 認証関連コンポーネント
    ├── AuthGuard.tsx       # 認証ガード
    └── UserMenu.tsx        # ユーザーメニュー
```

#### 2.1 共通コンポーネント詳細

| コンポーネント | ファイル | 説明 |
|---------------|---------|------|
| Header | `components/common/Header.tsx` | ナビゲーションヘッダー |
| Footer | `components/common/Footer.tsx` | フッター |
| SearchBar | `components/common/SearchBar.tsx` | 検索機能 |
| RestaurantCard | `components/common/RestaurantCard.tsx` | 店舗情報カード |
| MapLink | `components/common/MapLink.tsx` | Google Mapsリンク |
| LoadingSpinner | `components/common/LoadingSpinner.tsx` | ローディング表示 |
| ErrorMessage | `components/common/ErrorMessage.tsx` | エラー表示 |

### 3. lib/ (ユーティリティ・型定義)

```
lib/
├── types/                  # TypeScript型定義
│   ├── restaurant.ts       # 店舗関連の型
│   ├── user.ts             # ユーザー関連の型
│   ├── auth.ts             # 認証関連の型
│   ├── api.ts              # API関連の型
│   └── index.ts            # 型定義のエクスポート
├── utils/                  # ユーティリティ関数
│   ├── supabase.ts         # Supabaseクライアント
│   ├── auth.ts             # 認証関連ユーティリティ
│   ├── api.ts              # API関数
│   ├── format.ts           # フォーマット関数
│   └── validation.ts       # バリデーション関数
└── validations/            # Zodスキーマ
    ├── restaurant.ts       # 店舗バリデーション
    └── auth.ts             # 認証バリデーション
```

#### 3.1 型定義

```typescript
// lib/types/restaurant.ts
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
  user_id: string;
  created_at: string;
  updated_at: string;
}

// lib/types/user.ts
interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// lib/types/auth.ts
interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface BusinessHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

interface SearchParams {
  query?: string;
  area?: string;
}
```

#### 3.2 ユーティリティ関数

| ファイル | 説明 |
|---------|------|
| `lib/utils/supabase.ts` | Supabaseクライアント設定 |
| `lib/utils/api.ts` | API呼び出し関数 |
| `lib/utils/format.ts` | 日時・価格フォーマット |
| `lib/utils/validation.ts` | 入力値検証 |

### 4. hooks/ (カスタムフック)

```
hooks/
├── useRestaurants.ts       # 店舗一覧取得
├── useRestaurant.ts        # 店舗詳細取得
├── useSearchRestaurants.ts # 店舗検索
├── useRestaurantForm.ts    # 店舗投稿・編集フォーム
├── useAuth.ts              # 認証状態管理
├── useLogin.ts             # ログイン機能
├── useSignup.ts            # アカウント作成機能
└── index.ts                # フックのエクスポート
```

#### 4.1 カスタムフック詳細

| フック | ファイル | 説明 |
|-------|---------|------|
| useRestaurants | `hooks/useRestaurants.ts` | 店舗一覧の取得・管理 |
| useRestaurant | `hooks/useRestaurant.ts` | 個別店舗の取得・管理 |
| useSearchRestaurants | `hooks/useSearchRestaurants.ts` | 検索機能 |
| useRestaurantForm | `hooks/useRestaurantForm.ts` | 投稿・編集フォーム管理（編集モード対応） |
| useAuth | `hooks/useAuth.ts` | 認証状態管理 |
| useLogin | `hooks/useLogin.ts` | ログイン機能 |
| useSignup | `hooks/useSignup.ts` | アカウント作成機能 |

### 5. stores/ (Zustandストア)

```
stores/
├── restaurantStore.ts      # 店舗状態管理
├── searchStore.ts          # 検索状態管理
├── authStore.ts            # 認証状態管理
└── index.ts                # ストアのエクスポート
```

#### 5.1 ストア詳細

| ストア | ファイル | 説明 |
|-------|---------|------|
| restaurantStore | `stores/restaurantStore.ts` | 店舗データの状態管理 |
| searchStore | `stores/searchStore.ts` | 検索状態の管理 |
| authStore | `stores/authStore.ts` | 認証状態の管理 |

### 6. public/ (静的ファイル)

```
public/
├── images/                 # 画像ファイル
│   ├── logo.png            # ロゴ
│   ├── placeholder.jpg     # プレースホルダー画像
│   └── icons/              # アイコン
├── favicon.ico             # ファビコン
└── robots.txt              # 検索エンジン設定
```

### 7. styles/ (グローバルスタイル)

```
styles/
├── globals.css             # グローバルCSS
├── components.css          # コンポーネント固有スタイル
└── utilities.css           # ユーティリティクラス
```

## ファイル命名規則

### 1. コンポーネント
- **PascalCase**: `RestaurantCard.tsx`, `SearchBar.tsx`
- **機能別プレフィックス**: `RestaurantForm.tsx`, `RestaurantList.tsx`

### 2. フック
- **camelCase + use**: `useRestaurants.ts`, `useSearchRestaurants.ts`

### 3. ユーティリティ
- **camelCase**: `supabase.ts`, `api.ts`, `format.ts`

### 4. 型定義
- **camelCase**: `restaurant.ts`, `api.ts`

### 5. ストア
- **camelCase + Store**: `restaurantStore.ts`, `searchStore.ts`, `authStore.ts`

## インポート規則

### 1. 相対インポート
```typescript
// 同じディレクトリ内
import { RestaurantCard } from './RestaurantCard';

// 親ディレクトリ
import { Restaurant } from '../lib/types/restaurant';

// ルートからの絶対パス（tsconfig.jsonで設定）
import { useRestaurants } from '@/hooks/useRestaurants';
```

### 2. エイリアス設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/stores/*": ["./stores/*"]
    }
  }
}
```

## セキュリティ考慮事項

### 1. 環境変数
```
.env.local              # ローカル環境変数
.env.example            # 環境変数テンプレート
```

### 2. 機密情報
- Supabase URL/Key
- API Keys
- データベース接続情報

## パフォーマンス最適化

### 1. コード分割
- ページレベルでの自動分割
- 動的インポートの活用

### 2. 画像最適化
- Next.js Image コンポーネントの使用
- WebP形式の活用

### 3. キャッシュ戦略
- TanStack Query によるキャッシュ
- ブラウザキャッシュの活用

---

**作成日**: 2024年12月28日  
**作成者**: システム開発チーム  
**バージョン**: 1.3 