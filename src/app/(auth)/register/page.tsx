import { RegisterForm } from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription | MyTodo',
  description: 'Créez votre compte MyTodo',
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Créez votre compte
          </h1>
          <p className="text-sm text-muted-foreground">
            Inscrivez-vous pour commencer à gérer vos tâches
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 