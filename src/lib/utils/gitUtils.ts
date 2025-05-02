export {};

/**
 * Effectue un commit git automatique si l'environnement est en développement et la variable ENABLE_GIT_AUTOCOMMIT activée.
 * @param message Message de commit personnalisé
 */
export const commitGit = (message: string) => {
  if (typeof window !== 'undefined') return;
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_GIT_AUTOCOMMIT !== 'true') return;
  // Code de commit git désactivé côté client/Next.js
} 