# ガチ中華Map システム化要件定義書（MVP版）

## 1. プロジェクト概要

### 1.1 プロジェクト名
ガチ中華Map

### 1.2 プロジェクトの目的
東京のガチ中華店を発見し、中国語が話せない人や1人で行く勇気がない人でも安心して利用できる中華料理店の情報を提供するWebシステム

### 1.3 対象ユーザー
- ガチ中華に興味はあるが中国語が話せない人
- 1人で中華料理店に行く勇気がない人
- 東京で中華料理を楽しみたい人

### 1.4 対象地域
東京

### 1.5 ガチ中華の定義
- 中華料理を提供するお店全般
- 中国から進出しているブランドのお店

## 2. 機能要件

### 2.1 基本機能

#### 2.1.1 店舗情報の検索・閲覧
- 店舗一覧表示
- 店舗詳細表示
- 店舗名・地域での検索
- キーワード検索

#### 2.1.2 店舗情報の投稿・編集・削除
- ユーザーは新しい中華レストランの情報を投稿できる
- 投稿した店舗情報を編集・削除できる
- 投稿・編集・削除にはログインが必要
- 編集・削除は各店舗詳細画面から実行可能

#### 2.1.3 ユーザー認証機能
- ユーザーはメールアドレスとパスワードでアカウント作成・ログインができる
- ログイン状態の管理（セッション管理）
- ログアウト機能
- パスワードリセット機能（将来的な拡張）

### 2.2 非機能要件

#### 2.2.1 パフォーマンス
- ページ読み込み時間：3秒以内
- 検索結果表示：1秒以内

#### 2.2.2 可用性
- サービス稼働率：99%以上
- メンテナンス時間：月1回、深夜2時間以内

#### 2.2.3 セキュリティ
- HTTPS通信の必須化
- XSS対策
- CSRF対策
- 入力値検証

## 3. 技術要件

### 3.1 アーキテクチャ構成

| カテゴリ       | 技術                  | Version          | 用途                 |
| -------------- | --------------------- | ---------------- | -------------------- |
| フレームワーク | Next.js               | 14.2.30          | App Router / Edge    |
| 言語           | TypeScript            | 5.x              | コーディング         |
| パッケージ管理 | pnpm                  | 9.x              | mono repo 対応可     |
| Linter         | ESLint + Prettier     | latest           | 静的解析・整形       |
| スタイリング   | Tailwind CSS          | 3.4.17           | UI                   |
| UI コンポ      | shadcn/ui + Radix     | latest           | アクセシブル         |
| 状態管理       | Zustand               | 5.0.5            | UI ローカル状態      |
| データ取得     | TanStack Query        | 5.80.7           | API キャッシュ       |
| フォーム       | React Hook Form + Zod | 7.58.1 / 3.25.67 | 入力検証             |
| 通知           | Sonner                | 2.0.5            | トースト             |
| アイコン       | Lucide React          | 0.517.0          | アイコン             |
| データベース   | Supabase              | latest           | データ管理           |
| デプロイ       | Vercel                | ―                | Preview / Production |
| CI             | GitHub Actions        | ―                | test → lint → deploy |
| React          | React                 | 18.3.1           | UI ライブラリ        |

### 3.2 外部サービス

#### 3.2.1 Supabase
- PostgreSQL データベース
- リアルタイム機能

## 4. データ設計

### 4.1 データベース設計

#### 4.1.1 ユーザーテーブル（users）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4.1.2 店舗テーブル（restaurants）
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
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 インデックス設計
```sql
-- ユーザーテーブル
CREATE INDEX idx_users_email ON users(email);

-- 店舗テーブル
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_address ON restaurants(address);
CREATE INDEX idx_restaurants_created_at ON restaurants(created_at DESC);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
```

## 5. 画面設計

### 5.1 画面一覧

#### 5.1.1 メイン画面（/）
- 店舗一覧表示
- 検索機能
- 新着店舗表示
- 店舗投稿ボタン（ログイン時のみ表示）

#### 5.1.2 店舗詳細画面（/restaurant/[id]）
- 店舗基本情報
- 地図へのリンク（Google Maps）
- 編集・削除ボタン（ログイン時のみ表示）

#### 5.1.3 店舗投稿画面（/add-restaurant）
- 店舗情報入力フォーム
- 投稿完了画面
- ログイン必須

#### 5.1.4 店舗編集画面（/restaurant/[id]/edit）
- 既存店舗情報の編集フォーム
- 更新完了画面
- ログイン必須

#### 5.1.5 検索結果画面（/search）
- 検索結果の一覧表示
- 検索条件の表示

#### 5.1.6 ログイン画面（/login）
- メールアドレス・パスワード入力フォーム
- アカウント作成リンク
- パスワードリセットリンク

#### 5.1.7 アカウント作成画面（/signup）
- メールアドレス・パスワード入力フォーム
- 利用規約同意
- ログイン画面へのリンク

### 5.2 レスポンシブ対応
- デスクトップ（1024px以上）
- タブレット（768px - 1023px）
- スマートフォン（767px以下）

## 6. API設計

### 6.1 RESTful API

#### 6.1.1 店舗関連
```
GET    /api/restaurants          # 店舗一覧取得
GET    /api/restaurants/[id]     # 店舗詳細取得
POST   /api/restaurants          # 店舗追加（認証必須）
PUT    /api/restaurants/[id]     # 店舗編集（認証必須）
DELETE /api/restaurants/[id]     # 店舗削除（認証必須）
GET    /api/restaurants/search   # 店舗検索
```

#### 6.1.2 認証関連
```
POST   /api/auth/signup          # アカウント作成
POST   /api/auth/login           # ログイン
POST   /api/auth/logout          # ログアウト
GET    /api/auth/me              # 現在のユーザー情報取得
POST   /api/auth/reset-password  # パスワードリセット（将来的な拡張）
```

### 6.2 レスポンス形式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 7. セキュリティ要件

### 7.1 データ保護
- 個人情報の最小化
- データ暗号化（転送時・保存時）
- アクセスログの記録

### 7.2 入力値検証
- フロントエンド・バックエンド両方での検証
- XSS対策
- SQLインジェクション対策

## 8. 運用・保守要件

### 8.1 監視・ログ
- アクセスログの収集
- エラーログの監視
- パフォーマンス監視

### 8.2 バックアップ
- データベースの定期バックアップ

### 8.3 メンテナンス
- 月1回の定期メンテナンス
- セキュリティアップデート

## 9. 開発スケジュール

### 9.1 Phase 1（MVP）- 2週間
- 基本機能の実装
- 店舗一覧・詳細表示
- 基本的な検索機能
- 店舗投稿機能

### 9.2 Phase 2（最適化）- 1週間
- パフォーマンス最適化
- UI/UX改善
- テスト・デバッグ

## 10. リスク・課題

### 10.1 技術的リスク
- パフォーマンス問題
- データベースの負荷

### 10.2 運用リスク
- 不正確な情報の投稿
- 悪意のある投稿

### 10.3 対策
- 入力値の厳格な検証
- 定期的なデータ監査

## 11. 成功指標

### 11.1 技術指標
- ページ読み込み時間：3秒以内
- エラー率：1%以下
- サービス稼働率：99%以上

### 11.2 ビジネス指標
- 月間アクティブユーザー数
- 店舗情報の投稿数
- 検索実行数

## 12. 将来の拡張予定

### 12.1 機能拡張
- お気に入り機能
- レビュー機能
- 画像アップロード機能
- メニュー機能

### 12.2 地図機能
- Google Maps APIの導入
- 地図上での店舗表示
- 位置情報による検索

### 12.3 認証機能
- ユーザーアカウント機能
- ログイン・ログアウト
- プロフィール管理

---

**作成日**: 2024年12月28日  
**作成者**: システム開発チーム  
**バージョン**: 3.3 (MVP版) 