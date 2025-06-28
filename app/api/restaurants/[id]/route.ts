import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils/supabase';

// GET: レストラン詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'レストランが見つかりません' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'レストラン詳細の取得に失敗しました' },
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