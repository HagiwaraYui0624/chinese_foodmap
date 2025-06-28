import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    // Authorization ヘッダーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        error: '認証トークンがありません',
      }, { status: 401 });
    }

    // トークン検証
    if (!authUtils.verifyToken(token)) {
      return NextResponse.json({
        success: false,
        error: '無効なトークンです',
      }, { status: 401 });
    }

    // ユーザー情報取得
    const user = await authUtils.getCurrentUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'ユーザーが見つかりません',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });

  } catch (error) {
    console.error('Get current user error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'ユーザー情報の取得に失敗しました',
    }, { status: 500 });
  }
} 