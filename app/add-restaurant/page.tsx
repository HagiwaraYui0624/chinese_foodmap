'use client';

import { RestaurantForm } from '@/components/forms/RestaurantForm';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddRestaurantPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  ホームに戻る
                </Button>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                新しいレストランを追加
              </h1>
              <p className="text-lg text-gray-600">
                本格的な中華料理店の情報を共有しましょう
              </p>
            </div>

            <RestaurantForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
} 