import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createRestaurantSchema } from '@/lib/validations/restaurant';
import { authUtils } from '@/lib/utils/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// 認証チェック関数
const checkAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;

  console.log('Auth header:', authHeader);
  console.log('Token:', token);

  if (!token) {
    throw new Error('認証が必要です');
  }

  if (!authUtils.verifyToken(token)) {
    throw new Error('無効なトークンです');
  }

  // トークンからユーザーIDを取得
  try {
    const decoded = JSON.parse(atob(token));
    console.log('Decoded token:', decoded);
    
    const userId = decoded.userId;

    if (!userId) {
      throw new Error('ユーザーIDが見つかりません');
    }

    // データベースからユーザー情報を取得
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    console.log('Database query result:', { user, error });

    if (error || !user) {
      throw new Error('ユーザーが見つかりません');
    }

    return user;
  } catch (error) {
    console.log('Token processing error:', error);
    if (error instanceof Error && error.message.includes('ユーザー')) {
      throw error;
    }
    throw new Error('トークンの解析に失敗しました');
  }
};

// GET: レストラン一覧取得
export async function GET() {
  try {
    const { data: restaurants, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // 各レストランの画像データを取得
    const restaurantsWithImages = await Promise.all(
      (Array.isArray(restaurants) ? restaurants : []).map(async (restaurant) => {
        const { data: images } = await supabase
          .from('images')
          .select('*')
          .eq('restaurant_id', restaurant.id);

        // カテゴリ別に画像をグループ化
        const groupedImages = {
          exterior: images?.filter(img => img.category === 'exterior').map(img => img.image_url) || [],
          interior: images?.filter(img => img.category === 'interior').map(img => img.image_url) || [],
          food: images?.filter(img => img.category === 'food').map(img => img.image_url) || [],
          menu: images?.filter(img => img.category === 'menu').map(img => img.image_url) || [],
        };

        return {
          ...restaurant,
          images: groupedImages,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: restaurantsWithImages,
    });

  } catch (error) {
    console.error('Get restaurants error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '店舗一覧の取得に失敗しました',
    }, { status: 500 });
  }
}

// POST: レストラン追加
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const user = await checkAuth(request);

    const body = await request.json();
    
    // バリデーション
    const validatedData = createRestaurantSchema.parse(body);
    
    // imagesフィールドを除外してからデータベースに挿入
    const { images, ...restaurantDataWithoutImages } = validatedData;
    
    // ユーザーIDを追加
    const restaurantData = {
      ...restaurantDataWithoutImages,
      user_id: user.id,
    };

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .insert([restaurantData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // 画像データを含むレスポンスを返す
    const restaurantWithImages = {
      ...restaurant,
      images: images || {
        exterior: [],
        interior: [],
        food: [],
        menu: [],
      },
    };

    return NextResponse.json({
      success: true,
      data: restaurantWithImages,
      message: '店舗を追加しました',
    }, { status: 201 });

  } catch (error) {
    console.error('Create restaurant error:', error);
    
    if (error instanceof Error && error.message.includes('認証')) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '店舗の追加に失敗しました',
    }, { status: 500 });
  }
} 