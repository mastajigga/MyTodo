const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eahjdvmpmqwnupsqnxjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Créer la table todos avec une requête SQL directe
    const { data: createTableData, error: createTableError } = await supabase
      .from('_sql')
      .select('*')
      .eq('query', `
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

    if (createTableError) {
      console.error('Erreur lors de la création de la table:', createTableError);
    } else {
      console.log('Table créée avec succès:', createTableData);
    }

    // Tester la connexion en essayant de lire les todos
    const { data: todos, error: readError } = await supabase
      .from('todos')
      .select('*');

    if (readError) {
      console.error('Erreur lors de la lecture des todos:', readError);
    } else {
      console.log('Todos récupérés avec succès:', todos);
    }

  } catch (error) {
    console.error('Erreur inattendue:', error);
  }
}

main(); 