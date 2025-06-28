# ガチ中華Map 実装計画書（MVP版）

## 1. 概要
このドキュメントは、要件定義書・基本設計書・ディレクトリ構成に基づき、ガチ中華Map MVP版の環境構築から実装までの手順を、上から順番に実行できるようにまとめたものです。

---

## 2. 環境構築

### 2.1 必要ツールのインストール
- Node.js（v18以上推奨）
- pnpm
- Git

```sh
# Node.js（未インストールの場合）
brew install node

# pnpm
npm install -g pnpm

# Git（未インストールの場合）
brew install git

# npxコマンドの確認
npx --version

# npxが見つからない場合
npm install -g npx
```

### 2.2 Next.jsプロジェクト作成

**正しい手順：**

```sh
# 1. Next.jsプロジェクトを作成（現在のディレクトリに作成）
npx create-next-app@14.2.30 . --typescript --tailwind --eslint --app --import-alias "@/*" --yes

# 2. 依存関係をインストール
pnpm install

# 3. Next.jsのバージョンを要件定義書に合わせて固定
pnpm add next@14.2.30 react@18.2.0 react-dom@18.2.0

# 4. Tailwind CSSのバージョンを要件定義書に合わせて固定
pnpm add tailwindcss@3.4.17 postcss autoprefixer
```

**create-next-appのオプション説明：**
- `@14.2.30`: Next.jsのバージョンを指定（要件定義書に従う）
- `.`: 現在のディレクトリにプロジェクトを作成
- `--typescript`: TypeScriptを使用
- `--tailwind`: Tailwind CSSを設定
- `--eslint`: ESLintを設定
- `--app`: App Routerを使用
- `--import-alias "@/*"`: インポートエイリアスを設定
- `--yes`: すべての質問にyesで回答

### 2.3 追加パッケージのインストール

```sh
# 状態管理・データフェッチング
pnpm add zustand@5.0.5 @tanstack/react-query@5.80.7

# フォーム管理・バリデーション
pnpm add react-hook-form@7.58.1 zod@3.25.67

# UIコンポーネント・アイコン
pnpm add sonner@2.0.5 lucide-react@0.517.0

# Supabase
pnpm add @supabase/supabase-js

# shadcn/ui のセットアップ
npx shadcn-ui@latest init
```

**shadcn/ui初期化時の選択肢：**
- Style: `Default`
- Base color: `Slate`
- CSS variables: `Yes`
- React Server Components: `Yes`
- Components directory: `@/components`
- Utils directory: `@/lib/utils`
- Include example components: `No`

**shadcn/ui初期化後の設定：**
```sh
# components.jsonが作成されることを確認
cat components.json

# 必要に応じてtailwind.config.jsを更新
npx tailwindcss init -p
```

### 2.4 必要なshadcn/uiコンポーネントの追加

```sh
# 必要なコンポーネントを追加
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
```

### 2.5 環境変数の設定

```sh
# .env.local ファイルを作成
touch .env.local
```

`.env.local`の内容：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.6 package.jsonの依存関係確認

プロジェクト作成後、以下のバージョンが正しく設定されていることを確認：

```json
{
  "dependencies": {
    "next": "14.2.30",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "3.4.17",
    "zustand": "5.0.5",
    "@tanstack/react-query": "5.80.7",
    "react-hook-form": "7.58.1",
    "zod": "3.25.67",
    "sonner": "2.0.5",
    "lucide-react": "0.517.0",
    "@supabase/supabase-js": "latest"
  }
}
```

**注意事項：**
- Next.js 14.2.30は安定版で、App RouterとServer Componentsを完全サポート
- React 18.2.0はNext.js 14.2.30と互換性がある
- Tailwind CSS 3.4.17は最新の機能をサポートしつつ安定版
- 各ライブラリのバージョンは要件定義書に従って固定

### 2.7 Supabaseプロジェクト作成
- [Supabase](https://supabase.com/)で新規プロジェクト作成
- .env.local に上記のURL/Keyを記載

### 2.8 データベース初期化
- Supabase SQLエディタで下記を実行

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  business_hours JSONB,
  holidays TEXT,
  price_range VARCHAR(50),
  seating_capacity INTEGER,
  parking BOOLEAN DEFAULT false,
  reservation_required BOOLEAN DEFAULT false,
  payment_methods TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_address ON restaurants(address);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
```

---

## 3. ディレクトリ・ファイル構成の作成

- ディレクトリ構成.mdに従い、必要なディレクトリ・ファイルを作成
  - app/
  - components/
  - lib/
  - hooks/
  - stores/
  - public/
  - styles/
  - docs/

---

## 4. 実装手順

### 4.1 型定義・ユーティリティ
- `lib/types/restaurant.ts` に型定義
- `lib/utils/supabase.ts` でSupabaseクライアント作成
- `lib/validations/restaurant.ts` でZodスキーマ作成

### 4.2 APIルート実装
- `app/api/restaurants/route.ts`：GET/POST（一覧・追加）
- `app/api/restaurants/[id]/route.ts`：GET/PUT/DELETE（詳細・編集・削除）
- `app/api/restaurants/search/route.ts`：GET（検索）

### 4.3 Zustandストア実装
- `stores/restaurantStore.ts`：店舗データ管理（updateRestaurant, deleteRestaurant 追加）
- `stores/searchStore.ts`：検索状態管理

### 4.4 カスタムフック実装
- `hooks/useRestaurants.ts`：一覧取得
- `hooks/useRestaurant.ts`：詳細取得
- `hooks/useSearchRestaurants.ts`：検索
- `hooks/useRestaurantForm.ts`：投稿・編集フォーム管理（編集・初期値対応）

### 4.5 UIコンポーネント実装
- `components/common/Header.tsx`：ヘッダー
- `components/common/Footer.tsx`：フッター
- `components/common/SearchBar.tsx`：検索バー
- `components/common/RestaurantCard.tsx`：店舗カード
- `components/common/MapLink.tsx`：Google Mapsリンク
- `components/common/LoadingSpinner.tsx`：ローディング
- `components/common/ErrorMessage.tsx`：エラー表示
- `components/forms/RestaurantForm.tsx`：店舗投稿・編集フォーム（mode/initialData対応）

### 4.6 ページ実装
- `app/page.tsx`：トップページ（店舗一覧・検索）
- `app/restaurant/[id]/page.tsx`：店舗詳細（編集・削除ボタン追加）
- `app/restaurant/[id]/edit/page.tsx`：店舗編集（新規追加）
- `app/add-restaurant/page.tsx`：店舗投稿
- `app/search/page.tsx`：検索結果

### 4.7 スタイル
- `app/globals.css`：全体スタイル
- `styles/components.css`：コンポーネント用
- `styles/utilities.css`：ユーティリティ

---

## 5. 動作確認・デバッグ

```sh
# 開発サーバー起動
pnpm dev
```

- http://localhost:3000 でアクセス
- 店舗の投稿・検索・詳細表示ができるか確認
- Supabaseのデータベースと連携できているか確認

### 5.1 よくある問題と解決方法

#### 5.1.1 Next.jsのバージョンエラー
```sh
# エラー: "next" has unmet peer dependency
pnpm add next@14.2.30 react@18.2.0 react-dom@18.2.0
```

#### 5.1.2 Tailwind CSSが適用されない
```sh
# tailwind.config.jsを確認
cat tailwind.config.js

# 必要に応じて再生成
npx tailwindcss init -p
```

#### 5.1.3 shadcn/uiコンポーネントが読み込めない
```sh
# components.jsonの設定を確認
cat components.json

# コンポーネントを再追加
npx shadcn-ui@latest add button
```

#### 5.1.4 Supabase接続エラー
```sh
# 環境変数を確認
cat .env.local

# Supabaseクライアントの設定を確認
cat lib/utils/supabase.ts
```

#### 5.1.5 TypeScriptエラー
```sh
# 型定義を確認
cat lib/types/restaurant.ts

# TypeScript設定を確認
cat tsconfig.json
```

### 5.2 デバッグ手順

1. **ブラウザの開発者ツールでエラーを確認**
2. **Next.jsのログを確認**
3. **Supabaseのダッシュボードでデータベース接続を確認**
4. **環境変数が正しく設定されているか確認**

---

## 6. デプロイ・CI

- Vercelにプロジェクトをインポートし、環境変数を設定
- GitHub Actionsでlint/test/deployの自動化

---

## 7. ドキュメント・運用

- README.mdにセットアップ手順・開発フローを記載
- docs/配下に要件定義書・設計書・ディレクトリ構成・実装計画書を保存

---

**作成日**: 2024年12月28日  
**作成者**: システム開発チーム  
**バージョン**: 1.1