import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const checkTable = async () => {
  try {
    console.log('Vérification des entrées dans la table...');
    
    // Vérifier les entrées existantes
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('*');

    if (entriesError) {
      console.error('Erreur lors de la vérification des entrées:', entriesError);
    } else {
      console.log('Entrées trouvées:', entries);
    }

    // Essayer d'insérer une nouvelle entrée
    const { data: newEntry, error: insertError } = await supabase
      .from('entries')
      .insert({
        title: 'Test Entry 2',
        description: 'Test Description 2',
        workspace_id: 'b5301a85-1fd2-418e-8755-2b4acb806796',
        user_id: '00000000-0000-0000-0000-000000000000',
        status: 'todo',
        priority: 'medium'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'insertion:', insertError);
    } else {
      console.log('Nouvelle entrée créée:', newEntry);
    }

  } catch (error) {
    console.error('Échec:', error);
    process.exit(1);
  }
};

checkTable(); 