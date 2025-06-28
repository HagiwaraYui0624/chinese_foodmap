import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/utils/auth';
import { loginSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = loginSchema.parse(body);
    
    // ログイン
    const response = await authUtils.login({
      email: validatedData.email,
      password: validatedData.password,
    });

    return NextResponse.json({
      success: true,
      data: response,
      message: 'ログインしました',
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'ログインに失敗しました',
    }, { status: 500 });
  }
} 