'use client';

import Link from 'next/link';
import { UserMenu } from '@/components/auth/UserMenu';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                ガチ中華Map
              </h1>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              ホーム
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              検索
            </Link>
            <UserMenu />
          </nav>
        </div>
      </div>
    </header>
  );
}; 