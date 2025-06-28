import { NextRequest, NextResponse } from 'next/server';
import { authUtils } from '@/lib/utils/auth';
import { signupSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = signupSchema.parse(body);
    
    // ユーザー作成
    const response = await authUtils.signup({
      email: validatedData.email,
      password: validatedData.password,
    });

    return NextResponse.json({
      success: true,
      data: response,
      message: 'アカウントを作成しました',
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'アカウント作成に失敗しました',
    }, { status: 500 });
  }
} 