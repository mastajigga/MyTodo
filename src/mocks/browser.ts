import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Configuration du Service Worker MSW pour l'interception des requêtes
export const worker = setupWorker(...handlers)

// Démarrage conditionnel du worker en développement
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  })
} 