'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">Erreur</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Une erreur est survenue</h2>
          <p className="text-gray-600">Nous nous excusons pour la gêne occasionnée.</p>
        </div>
        <div className="space-x-4">
          <Button onClick={() => reset()} variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button asChild>
            <Link href="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 