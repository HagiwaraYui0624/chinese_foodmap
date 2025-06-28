import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { updateRestaurantSchema } from '@/lib/validations/restaurant';
import { authUtils } from '@/lib/utils/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// 認証チェック関数
const checkAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;

  if (!token) {
    throw new Error('認証が必要です');
  }

  if (!authUtils.verifyToken(token)) {
    throw new Error('無効なトークンです');
  }

  const user = await authUtils.getCurrentUser();
  if (!user) {
    throw new Error('ユーザーが見つかりません');
  }

  return user;
};

// 店舗の所有者チェック関数
const checkOwnership = async (restaurantId: string, userId: string) => {
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('user_id')
    .eq('id', restaurantId)
    .single();

  if (error || !restaurant) {
    throw new Error('店舗が見つかりません');
  }

  if (restaurant.user_id !== userId) {
    throw new Error('この店舗を編集する権限がありません');
  }

  return restaurant;
};

// GET: レストラン詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: false,
          error: '店舗が見つかりません',
        }, { status: 404 });
      }
      throw new Error(error.message);
    }

    // 画像データを取得
    const { data: images } = await supabase
      .from('images')
      .select('*')
      .eq('restaurant_id', params.id);

    // カテゴリ別に画像をグループ化
    const groupedImages = {
      exterior: images?.filter(img => img.category === 'exterior').map(img => img.image_url) || [],
      interior: images?.filter(img => img.category === 'interior').map(img => img.image_url) || [],
      food: images?.filter(img => img.category === 'food').map(img => img.image_url) || [],
      menu: images?.filter(img => img.category === 'menu').map(img => img.image_url) || [],
    };

    const restaurantWithImages = {
      ...restaurant,
      images: groupedImages,
    };

    return NextResponse.json({
      success: true,
      data: restaurantWithImages,
    });

  } catch (error) {
    console.error('Get restaurant error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '店舗情報の取得に失敗しました',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const user = await checkAuth(request);
    
    // 所有者チェック
    await checkOwnership(params.id, user.id);

    const body = await request.json();
    
    // バリデーション
    const validatedData = updateRestaurantSchema.parse({
      ...body,
      id: params.id,
    });

    // imagesフィールドを除外してからデータベースに更新
    const { images, ...restaurantDataWithoutImages } = validatedData;

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .update(restaurantDataWithoutImages)
      .eq('id', params.id)
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
      message: '店舗を更新しました',
    });

  } catch (error) {
    console.error('Update restaurant error:', error);
    
    if (error instanceof Error && error.message.includes('認証')) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes('権限')) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 403 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '店舗の更新に失敗しました',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const user = await checkAuth(request);
    
    // 所有者チェック
    await checkOwnership(params.id, user.id);

    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: '店舗を削除しました',
    });

  } catch (error) {
    console.error('Delete restaurant error:', error);
    
    if (error instanceof Error && error.message.includes('認証')) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes('権限')) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 403 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '店舗の削除に失敗しました',
    }, { status: 500 });
  }
} 