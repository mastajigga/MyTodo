require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas définies')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count')
    
    if (error) throw error
    
    console.log('✅ Connexion à Supabase réussie !')
    console.log('Nombre de profils dans la base :', data[0]?.count || 0)
  } catch (error) {
    console.error('❌ Erreur de connexion à Supabase :', error.message)
    process.exit(1)
  }
}

testConnection() 