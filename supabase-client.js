const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eahjdvmpmqwnupsqnxjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Créer la table tasks avec une requête SQL directe
    const { data: createTableData, error: createTableError } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', `
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'todo',
          priority TEXT NOT NULL DEFAULT 'medium',
          project_id UUID NOT NULL,
          position INTEGER NOT NULL DEFAULT 0,
          created_by UUID NOT NULL,
          assigned_to UUID,
          due_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT valid_status CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
          CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
        );
      `);

    if (createTableError) {
      console.error('Erreur lors de la création de la table:', createTableError);
    } else {
      console.log('Table créée avec succès:', createTableData);
    }

    // Tester la connexion en essayant de lire les tâches
    const { data: tasks, error: readError } = await supabase
      .from('tasks')
      .select(`
        *,
        created_by_user:profiles!created_by(id, full_name, avatar_url),
        assigned_to_user:profiles!assigned_to(id, full_name, avatar_url),
        project:projects(id, name)
      `);

    if (readError) {
      console.error('Erreur lors de la lecture des tâches:', readError);
    } else {
      console.log('Tâches récupérées avec succès:', tasks);
    }

  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

main(); 