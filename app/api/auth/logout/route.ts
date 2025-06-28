import { NextResponse } from 'next/server';
import { authUtils } from '@/lib/utils/auth';

export async function POST() {
  try {
    // ログアウト処理
    await authUtils.logout();

    return NextResponse.json({
      success: true,
      message: 'ログアウトしました',
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'ログアウトに失敗しました',
    }, { status: 500 });
  }
} 