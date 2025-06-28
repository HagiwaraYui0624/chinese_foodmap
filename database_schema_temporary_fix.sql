-- 一時的な解決策: RLSを無効化
ALTER TABLE images DISABLE ROW LEVEL SECURITY;

-- または、より緩いポリシーを設定
-- DROP POLICY IF EXISTS "Users can create images for their restaurants" ON images;
-- CREATE POLICY "Allow all operations on images" ON images
--   FOR ALL USING (true) WITH CHECK (true); 