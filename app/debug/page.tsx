'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authToken = localStorage.getItem('auth_token');
      setToken(authToken);
      
      if (authToken) {
        try {
          const decoded = JSON.parse(atob(authToken));
          setDecodedToken(decoded);
        } catch (error) {
          console.error('Token decode error:', error);
        }
      }
    }
  }, []);

  const testAuth = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      const data = await response.json();
      console.log('Auth test result:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Auth test error:', error);
      alert('Error: ' + error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">認証デバッグ情報</h1>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">認証状態</h2>
          <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
          <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">ユーザー情報</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">トークン</h2>
          <p className="text-sm break-all">{token || 'No token'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">デコードされたトークン</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(decodedToken, null, 2)}
          </pre>
        </div>

        <button
          onClick={testAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          認証APIテスト
        </button>
      </div>
    </div>
  );
} 