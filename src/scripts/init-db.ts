import { supabase } from '../lib/supabase'
import fs from 'fs'
import path from 'path'

async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...')

    // Lecture du fichier SQL
    const schemaPath = path.join(__dirname, '../lib/supabase/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Exécution du schéma SQL
    const { error } = await supabase.rpc('exec_sql', { sql: schema })

    if (error) {
      throw error
    }

    console.log('✅ Base de données initialisée avec succès')

    // Test de la table
    const { data, error: testError } = await supabase
      .from('entries')
      .select('count')
      .limit(1)

    if (testError) {
      throw testError
    }

    console.log('✅ Table entries créée et accessible')
    console.log('Nombre d\'entrées :', data?.[0]?.count || 0)

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error)
    process.exit(1)
  }
}

initDatabase() 