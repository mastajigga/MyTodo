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
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Vérifier si le chemin actuel est public
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !isPublicPath) {
    const redirectUrl = new URL('/auth/login', request.url);
    // Ajouter l'URL de redirection comme paramètre pour revenir après la connexion
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'authentification
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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