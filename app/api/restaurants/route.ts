import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils/supabase';
import { createRestaurantSchema } from '@/lib/validations/restaurant';

// GET: レストラン一覧取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'レストラン一覧の取得に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// POST: レストラン追加
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    const validatedData = createRestaurantSchema.parse(body);
    
    const { data, error } = await supabase
      .from('restaurants')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'レストランの追加に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 