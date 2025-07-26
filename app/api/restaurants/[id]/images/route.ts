import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/utils/supabase';
import { verifyAuth } from '@/lib/utils/auth';

// GET: 店舗の画像一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: images, error } = await supabaseAdmin
      .from('images')
      .select('*')
      .eq('restaurant_id', params.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
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
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
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
    
    // ファイル名を生成（タイムスタンプ付き）
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `image_${timestamp}.${fileExtension}`;
    
    // Supabase Storageにアップロード（Fileオブジェクトを直接使用）
    const { error: uploadError } = await supabaseAdmin.storage
      .from('restaurant-images')
      .upload(`${params.id}/${category}/${fileName}`, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError); // ログに詳細出力
      return NextResponse.json(
        { 
          error: `Failed to upload image: ${uploadError.message}`,
          details: uploadError // 詳細エラー情報も返す
        }, 
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: urlData } = supabaseAdmin.storage
      .from('restaurant-images') // バケット名を正しいものに戻す
      .getPublicUrl(`${params.id}/${category}/${fileName}`);
    
    // データベースに画像情報を保存
    const { data: imageData, error: insertError } = await supabaseAdmin
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
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
    const { data: image, error: imageError } = await supabaseAdmin
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
    const { error: deleteError } = await supabaseAdmin
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
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 