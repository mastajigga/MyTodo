import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Ces chemins ne nécessitent pas d'authentification
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback'
];

export async function middleware(request: NextRequest) {
  console.log('🔄 Middleware - URL demandée:', request.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  console.log('🔄 Vérification de la session...');
  const { data: { session } } = await supabase.auth.getSession();
  console.log('👤 Session trouvée:', !!session);

  // Vérifier si le chemin actuel est public
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  console.log('🔒 Chemin public:', isPublicPath);

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !isPublicPath) {
    console.log('⚠️ Accès non autorisé - Redirection vers la page de connexion');
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification
  if (session && isPublicPath) {
    console.log('ℹ️ Utilisateur déjà connecté - Redirection vers le tableau de bord');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  console.log('✅ Middleware - Accès autorisé');
  return res;
}

// Spécifier les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/* (image files)
     * - api/* (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}; 