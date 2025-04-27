export const defaultLoggerConfig = {
  // Niveaux de log activés par environnement
  enabledLevels: {
    development: ['info', 'warn', 'error', 'debug'],
    test: ['warn', 'error'],
    production: ['error']
  },

  // Contextes à logger (pour filtrer les logs par domaine)
  contexts: {
    auth: {
      enabled: true,
      description: 'Authentification et gestion des sessions'
    },
    todo: {
      enabled: true, 
      description: 'Gestion des todos'
    },
    api: {
      enabled: true,
      description: 'Appels API'
    },
    ui: {
      enabled: true,
      description: 'Interactions utilisateur'
    },
    projects: {
      enabled: true,
      description: 'Gestion des projets'
    },
    workspaces: {
      enabled: true,
      description: 'Gestion des espaces de travail'
    }
  },

  // Format du timestamp
  timestampFormat: 'ISO', // 'ISO' | 'locale'

  // Retention des logs (en jours)
  retentionDays: {
    development: 7,
    test: 14, 
    production: 30
  }
}; 