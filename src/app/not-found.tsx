import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">Page non trouvée</h2>
          <p className="text-gray-600">Désolé, la page que vous recherchez n'existe pas.</p>
        </div>
        <Button asChild>
          <Link href="/" className="inline-flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>
    </div>
  );
} 