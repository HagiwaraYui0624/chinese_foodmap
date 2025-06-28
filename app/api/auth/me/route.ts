import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;

    console.log('Auth header:', authHeader);
    console.log('Token:', token);

    if (!token) {
      return NextResponse.json({
        success: false,
        error: '認証が必要です',
      }, { status: 401 });
    }

    try {
      const decoded = JSON.parse(atob(token));
      console.log('Decoded token:', decoded);
      
      const userId = decoded.userId;
      if (!userId) {
        return NextResponse.json({
          success: false,
          error: 'ユーザーIDが見つかりません',
        }, { status: 401 });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Database query result:', { user, error });

      if (error || !user) {
        return NextResponse.json({
          success: false,
          error: 'ユーザーが見つかりません',
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        data: user,
      });

    } catch (decodeError) {
      console.log('Token decode error:', decodeError);
      return NextResponse.json({
        success: false,
        error: 'トークンの解析に失敗しました',
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'ユーザー情報の取得に失敗しました',
    }, { status: 500 });
  }
} 