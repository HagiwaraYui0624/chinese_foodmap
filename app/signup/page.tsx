import { SignupForm } from '@/components/forms/SignupForm';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false}>
      <SignupForm />
    </AuthGuard>
  );
} 