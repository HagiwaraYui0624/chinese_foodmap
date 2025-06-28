import { LoginForm } from '@/components/forms/LoginForm';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
} 