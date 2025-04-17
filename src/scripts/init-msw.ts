import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

async function initMSW() {
  // Créer le dossier public s'il n'existe pas
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public')
  }

  try {
    // Copier le fichier mockServiceWorker.js depuis node_modules/msw
    execSync('npx msw init public/ --save')
    console.log('✅ Service worker MSW copié avec succès dans public/')
  } catch (error) {
    console.error('❌ Erreur lors de la copie du service worker MSW:', error)
    process.exit(1)
  }
}

initMSW() 