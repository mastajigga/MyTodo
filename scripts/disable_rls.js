import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const envPath = join(__dirname, '..', '.env.local')

dotenv.config({ path: envPath })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const tables = [
  'workspaces',
  'workspace_members',
  'projects',
  'project_members',
  'tasks',
  'task_lists',
  'tags'
]

async function disableRLS() {
  try {
    console.log('Tentative de désactivation de RLS avec les paramètres suivants :')
    console.log('URL:', supabaseUrl)
    console.log('Tables:', tables)
    
    // Désactiver RLS pour chaque table
    for (const table of tables) {
      const { error } = await supabase.rpc('disable_rls_for_testing', {
        tables: [table]
      })
      
      if (error) {
        console.error(`Erreur lors de la désactivation de RLS pour ${table}:`, error)
      } else {
        console.log(`RLS désactivé pour la table ${table}`)
      }
    }
    
    console.log('Désactivation de RLS terminée')
  } catch (error) {
    console.error('Erreur lors de la désactivation de RLS:', error)
    process.exit(1)
  }
}

disableRLS() 