import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.test') });

console.log('Configuration de Supabase...');
console.log('URL:', process.env.SUPABASE_URL);
console.log('API Key:', process.env.SUPABASE_API_KEY ? '***' : 'Non définie');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const WORKSPACE_ID = 'b5301a85-1fd2-418e-8755-2b4acb806796';

console.log('\nTentative de connexion au workspace:', WORKSPACE_ID);

try {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', WORKSPACE_ID)
    .single();

  if (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }

  console.log('Workspace trouvé:', data);

  // Vérifier les entrées
  const { data: entries, error: entriesError } = await supabase
    .from('entries')
    .select('*')
    .eq('workspace_id', WORKSPACE_ID);

  if (entriesError) {
    console.error('Erreur lors de la vérification des entrées:', entriesError);
  } else {
    console.log('\nEntrées trouvées:', entries?.length || 0);
    if (entries?.length > 0) {
      entries.forEach(entry => {
        console.log(`- ${entry.title} (${entry.status})`);
      });
    }
  }

} catch (err) {
  console.error('Erreur inattendue:', err);
  process.exit(1);
} 