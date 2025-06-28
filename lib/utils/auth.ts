import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { AuthCredentials, AuthResponse, User } from '@/lib/types/user';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// クライアントサイドでのみlocalStorageを使用するためのヘルパー関数
const getLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const removeLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// APIルート用の認証検証関数
export const verifyAuth = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth_token')?.value;

  if (!token) {
    return { success: false, error: 'No token provided' };
  }

  try {
    const decoded = JSON.parse(atob(token));
    const userId = decoded.userId;

    if (!userId) {
      return { success: false, error: 'Invalid token format' };
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, userId: user.id, user };
  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
};

export const authUtils = {
  // パスワードハッシュ化（簡易版 - 本番ではbcrypt等を使用）
  hashPassword: async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  // ユーザー登録
  signup: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const { email, password, nickname } = credentials;
    
    // パスワードハッシュ化
    const passwordHash = await authUtils.hashPassword(password);
    
    // ユーザー作成
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          nickname,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // トークン生成（簡易版）
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));

    return {
      user,
      token
    };
  },

  // ログイン
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const { email, password } = credentials;
    
    // パスワードハッシュ化
    const passwordHash = await authUtils.hashPassword(password);
    
    // ユーザー検索
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password_hash', passwordHash)
      .single();

    if (error || !user) {
      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    // トークン生成（簡易版）
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));

    return {
      user,
      token
    };
  },

  // ログアウト
  logout: async (): Promise<void> => {
    // トークンの削除はクライアントサイドで行う
    removeLocalStorage('auth_token');
    removeLocalStorage('user');
  },

  // 現在のユーザー取得
  getCurrentUser: async (): Promise<User | null> => {
    const token = getLocalStorage('auth_token');
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token));
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        removeLocalStorage('auth_token');
        removeLocalStorage('user');
        return null;
      }

      return user;
    } catch {
      removeLocalStorage('auth_token');
      removeLocalStorage('user');
      return null;
    }
  },

  // トークン検証
  verifyToken: (token: string): boolean => {
    try {
      const decoded = JSON.parse(atob(token));
      return !!(decoded.userId && decoded.email);
    } catch {
      return false;
    }
  }
}; 