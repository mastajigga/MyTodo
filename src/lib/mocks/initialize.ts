async function initializeMocks() {
  if (typeof window === 'undefined') {
    return
  }

  if (process.env.NEXT_PUBLIC_API_MOCKING !== 'enabled') {
    return
  }

  try {
    const { worker } = await import('@/mocks/browser')
    
    // Démarrage du worker avec les options de MSW v2
    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: process.env.NODE_ENV === 'test', // Désactive les logs en mode test
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de MSW:', error)
  }
}

export { initializeMocks } 