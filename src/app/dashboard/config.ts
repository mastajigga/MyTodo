export const DASHBOARD_CONFIG = {
  // Durée de mise en cache des données du tableau de bord (en secondes)
  revalidate: 60,
  
  // Nombre maximum d'activités récentes à afficher
  maxRecentActivities: 5,
  
  // Configuration des requêtes
  queries: {
    profile: {
      key: 'dashboard-profile',
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    tasks: {
      key: 'dashboard-tasks',
      staleTime: 30 * 1000, // 30 secondes
    },
  },
  
  // Messages d'erreur
  errorMessages: {
    loadingFailed: 'Une erreur est survenue lors du chargement du tableau de bord.',
    authError: 'Erreur d\'authentification. Veuillez vous reconnecter.',
    dataError: 'Impossible de récupérer vos données. Veuillez réessayer.',
  },
} as const; 