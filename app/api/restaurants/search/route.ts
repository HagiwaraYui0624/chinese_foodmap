import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/utils/supabase';
import { searchRestaurantSchema } from '@/lib/validations/restaurant';

// GET: レストラン検索
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const price_range = searchParams.get('price_range');
    const parking = searchParams.get('parking');
    const reservation_required = searchParams.get('reservation_required');

    // バリデーション
    const validatedParams = searchRestaurantSchema.parse({
      query: query || undefined,
      price_range: price_range || undefined,
      parking: parking === 'true' ? true : parking === 'false' ? false : undefined,
      reservation_required: reservation_required === 'true' ? true : reservation_required === 'false' ? false : undefined,
    });

    let supabaseQuery = supabase
      .from('restaurants')
      .select('*');

    // 検索条件を適用
    if (validatedParams.query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${validatedParams.query}%,address.ilike.%${validatedParams.query}%`);
    }

    if (validatedParams.price_range) {
      supabaseQuery = supabaseQuery.eq('price_range', validatedParams.price_range);
    }

    if (validatedParams.parking !== undefined) {
      supabaseQuery = supabaseQuery.eq('parking', validatedParams.parking);
    }

    if (validatedParams.reservation_required !== undefined) {
      supabaseQuery = supabaseQuery.eq('reservation_required', validatedParams.reservation_required);
    }

    const { data, error } = await supabaseQuery.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'レストラン検索に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
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