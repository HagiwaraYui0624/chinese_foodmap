import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils/supabase';

// 簡易的な認証チェック（後で実装予定）
const verifyAuth = async (_request: NextRequest) => {
  // 実際の認証ロジックは後で実装
  // 現在は常に成功として扱う
  return { success: true, userId: 'temp-user-id' };
};

// GET: 店舗の画像一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: images, error } = await supabase
      .from('images')
      .select('*')
      .eq('restaurant_id', params.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(images);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 画像アップロード
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // レストランが存在し、ユーザーが所有者かチェック
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, user_id')
      .eq('id', params.id)
      .single();
    
    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    
    if (restaurant.user_id !== authResult.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // フォームデータを取得
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    
    if (!file || !category) {
      return NextResponse.json(
        { error: 'File and category are required' },
        { status: 400 }
      );
    }
    
    // カテゴリのバリデーション
    const validCategories = ['exterior', 'interior', 'food', 'menu'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    // ファイルをバッファに変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // ファイル名を生成（タイムスタンプ付き）
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `image_${timestamp}.${fileExtension}`;
    
    // Supabase Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from('restaurant-images')
      .upload(`${params.id}/${category}/${fileName}`, buffer, {
        contentType: file.type,
        upsert: false
      });
    
    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }
    
    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('restaurant-images')
      .getPublicUrl(`${params.id}/${category}/${fileName}`);
    
    // データベースに画像情報を保存
    const { data: imageData, error: insertError } = await supabase
      .from('images')
      .insert({
        restaurant_id: params.id,
        category,
        image_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(imageData, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: 画像削除
export async function DELETE(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }
    
    // 認証チェック
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 画像が存在し、ユーザーが所有者かチェック
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select('*, restaurants(user_id)')
      .eq('id', imageId)
      .single();
    
    if (imageError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    if (image.restaurants.user_id !== authResult.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // 画像を削除
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 