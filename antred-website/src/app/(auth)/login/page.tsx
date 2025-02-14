// src/app/(auth)/login/page.tsx
import { LoginForm } from '@/features/authentication/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow">
        <h3>Connexion Admin</h3>
        <LoginForm />
      </div>
    </div>
  )
}
