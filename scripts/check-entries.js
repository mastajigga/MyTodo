import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const checkEntries = async () => {
  try {
    console.log('Vérification des entrées dans la table...');
    
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', 'b5301a85-1fd2-418e-8755-2b4acb806796');

    if (error) {
      console.error('Erreur lors de la vérification:', error);
      process.exit(1);
    }

    console.log('Entrées trouvées:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Échec:', error);
    process.exit(1);
  }
};

checkEntries(); 