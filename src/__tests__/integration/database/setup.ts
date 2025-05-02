import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.test' })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

export const setupTestEnvironment = async () => {
  // Désactiver RLS pour toutes les tables nécessaires
  await supabase.rpc('disable_rls_for_testing', {
    tables: [
      'workspaces',
      'workspace_members',
      'projects',
      'project_members',
      'tasks',
      'task_lists',
      'tags'
    ]
  })

  // Créer un utilisateur de test
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'test@example.com',
    password: 'testpassword123',
    email_confirm: true
  })

  if (userError) {
    throw new Error(`Erreur lors de la création de l'utilisateur de test: ${userError.message}`)
  }

  return { testUser: user }
}

export const cleanupTestEnvironment = async () => {
  // Réactiver RLS pour toutes les tables
  await supabase.rpc('enable_rls_for_testing', {
    tables: [
      'workspaces',
      'workspace_members',
      'projects',
      'project_members',
      'tasks',
      'task_lists',
      'tags'
    ]
  })

  // Supprimer l'utilisateur de test et ses données
  const { error } = await supabase.auth.admin.deleteUser(
    (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'test@example.com')?.id || ''
  )

  if (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur de test:', error)
  }
} 