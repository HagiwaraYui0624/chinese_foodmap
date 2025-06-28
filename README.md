# ガチ中華Map

本格的な中華料理店の情報を共有するコミュニティサイトです。

## 機能

- レストラン一覧表示
- レストラン検索
- レストラン詳細表示
- 新しいレストランの投稿
- Google Maps連携

## 技術スタック

- **フレームワーク**: Next.js 14.2.30 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 3.4.17
- **状態管理**: Zustand 5.0.5
- **フォーム管理**: React Hook Form 7.58.1 + Zod 3.25.67
- **UIコンポーネント**: shadcn/ui
- **データベース**: Supabase
- **アイコン**: Lucide React 0.517.0

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabaseプロジェクトの設定

1. [Supabase](https://supabase.com/)で新規プロジェクトを作成
2. SQLエディタで以下のテーブルを作成：

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

### 4. 開発サーバーの起動

```bash
pnpm dev
```

http://localhost:3000 でアクセスできます。

## プロジェクト構造

```
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   ├── restaurant/        # レストラン詳細ページ
│   ├── add-restaurant/    # レストラン投稿ページ
│   ├── search/           # 検索結果ページ
│   └── layout.tsx        # ルートレイアウト
├── components/           # Reactコンポーネント
│   ├── common/          # 共通コンポーネント
│   ├── forms/           # フォームコンポーネント
│   └── ui/              # shadcn/uiコンポーネント
├── hooks/               # カスタムフック
├── lib/                 # ユーティリティ
│   ├── types/          # TypeScript型定義
│   ├── utils/          # ユーティリティ関数
│   └── validations/    # Zodスキーマ
├── stores/             # Zustandストア
└── docs/               # ドキュメント
```

## 開発

### コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント
pnpm lint
```

### コード規約

- TypeScriptを使用
- ESLint + Prettierでコードフォーマット
- コンポーネントは関数コンポーネント + Hooks
- 状態管理はZustandを使用
- フォームバリデーションはZodを使用

## ライセンス

MIT License
