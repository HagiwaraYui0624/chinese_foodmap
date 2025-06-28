-- 画像データを管理するテーブル
CREATE TABLE IF NOT EXISTS images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category VARCHAR(20) NOT NULL CHECK (category IN ('exterior', 'interior', 'food', 'menu')),
  image_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成してパフォーマンスを向上
CREATE INDEX IF NOT EXISTS idx_images_restaurant_id ON images(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);

-- 更新時のタイムスタンプを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_images_updated_at 
  BEFORE UPDATE ON images 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) を有効化
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（もし存在する場合）
DROP POLICY IF EXISTS "Images are viewable by everyone" ON images;
DROP POLICY IF EXISTS "Users can create images for their restaurants" ON images;
DROP POLICY IF EXISTS "Users can update images for their restaurants" ON images;
DROP POLICY IF EXISTS "Users can delete images for their restaurants" ON images;

-- 画像の閲覧ポリシー（全ユーザーが閲覧可能）
CREATE POLICY "Images are viewable by everyone" ON images
  FOR SELECT USING (true);

-- 画像の作成ポリシー（認証済みユーザーのみ）
CREATE POLICY "Users can create images for their restaurants" ON images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = images.restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
    OR 
    -- APIルートからのアクセスを許可（service_roleキーを使用）
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

-- 画像の更新ポリシー（レストランの所有者のみ）
CREATE POLICY "Users can update images for their restaurants" ON images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = images.restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
    OR 
    -- APIルートからのアクセスを許可（service_roleキーを使用）
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  );

-- 画像の削除ポリシー（レストランの所有者のみ）
CREATE POLICY "Users can delete images for their restaurants" ON images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = images.restaurant_id 
      AND restaurants.user_id = auth.uid()
    )
    OR 
    -- APIルートからのアクセスを許可（service_roleキーを使用）
    (current_setting('request.jwt.claims', true)::json->>'role')::text = 'service_role'
  ); 