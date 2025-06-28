import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">ガチ中華Map</span>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">ホーム</Button>
            </Link>
            <Link href="/add-restaurant">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                店舗を追加
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}; 