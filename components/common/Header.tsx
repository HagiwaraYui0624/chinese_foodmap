'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';
import { usePathname } from 'next/navigation';
import { MapPin } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();
  const hideNav = pathname === '/login' || pathname === '/signup';

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <MapPin className="h-6 w-6 text-red-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                ガチ中華Map
              </h1>
            </Link>
          </div>
          
          {!hideNav && (
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                ホーム
              </Link>
              <Link href="/add-restaurant">
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  店舗登録
                </Button>
              </Link>
              <UserMenu />
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}; 