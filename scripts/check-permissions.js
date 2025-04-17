import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Créer un client avec la clé de service
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const checkPermissions = async () => {
  try {
    console.log('Vérification des permissions avec la clé de service...');
    
    // Essayer de lire les entrées
    const { data: entries, error: readError } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', 'b5301a85-1fd2-418e-8755-2b4acb806796');

    if (readError) {
      console.error('Erreur lors de la lecture:', readError);
    } else {
      console.log('Entrées trouvées:', entries);
    }

    // Essayer de créer une politique de sécurité avec la clé de service
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql_query: `
        drop policy if exists "Enable read access for all users" on public.entries;
        create policy "Enable read access for all users" on public.entries for select using (true);
      `
    });

    if (policyError) {
      console.error('Erreur lors de la création de la politique:', policyError);
    } else {
      console.log('Politique de sécurité créée avec succès');
    }

  } catch (error) {
    console.error('Échec:', error);
    process.exit(1);
  }
};

checkPermissions(); 