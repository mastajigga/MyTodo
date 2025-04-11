import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ClientWrapper } from '@/components/layout/ClientWrapper';
import SupabaseProvider from '@/lib/supabase/supabase-provider';

export const metadata: Metadata = {
  title: 'MyTodo - Gérez vos tâches efficacement',
  description: 'Application de gestion de tâches moderne et intuitive',
};

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-background">
        <Suspense fallback={<Loading />}>
          <SupabaseProvider>
            <ClientWrapper>{children}</ClientWrapper>
          </SupabaseProvider>
        </Suspense>
      </body>
    </html>
  );
} 