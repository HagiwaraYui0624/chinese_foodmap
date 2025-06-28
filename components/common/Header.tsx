import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">ガチ中華Map</span>
          </Link>
          
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                ホーム
              </Button>
            </Link>
            <Link href="/add-restaurant">
              <Button size="sm" className="text-xs sm:text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">店舗を追加</span>
                <span className="sm:hidden">追加</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}; 