import { SignupForm } from '@/components/forms/SignupForm';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false} redirectIfAuthenticated={true}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-md w-full mx-auto mt-8 space-y-4">
            <div>
            </div>
            <SignupForm />
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
} 