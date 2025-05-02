export {};

/**
 * Effectue un commit git automatique si l'environnement est en développement et la variable ENABLE_GIT_AUTOCOMMIT activée.
 * @param message Message de commit personnalisé
 */
export const commitGit = (message: string) => {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_GIT_AUTOCOMMIT !== 'true') return

  // Commande git add + commit
  const cmd = `git add . && git commit -m "${message.replace(/"/g, '\"')}"`
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      // On log l'erreur mais on ne bloque pas l'exécution
      console.error('[gitUtils] Erreur lors du commit git:', error)
      return
    }
    if (stderr) {
      console.warn('[gitUtils] Avertissement git:', stderr)
    }
    console.log('[gitUtils] Commit git automatique effectué:', stdout)
  })
} 