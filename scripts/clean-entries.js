import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: join(__dirname, '..', '.env.test') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const WORKSPACE_ID = 'b5301a85-1fd2-418e-8755-2b4acb806796';

async function cleanDuplicateEntries() {
  console.log('🧹 Nettoyage des entrées en double...');

  try {
    // 1. Récupérer toutes les entrées
    const { data: entries, error: fetchError } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', WORKSPACE_ID)
      .order('created_at', { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📝 Entrées trouvées: ${entries.length}`);

    // 2. Grouper les entrées par titre
    const entriesByTitle = entries.reduce((acc, entry) => {
      if (!acc[entry.title]) {
        acc[entry.title] = [];
      }
      acc[entry.title].push(entry);
      return acc;
    }, {});

    // 3. Identifier les doublons à supprimer
    const entriesToDelete = [];
    for (const [title, titleEntries] of Object.entries(entriesByTitle)) {
      if (titleEntries.length > 1) {
        // Garder la première entrée, marquer les autres pour suppression
        entriesToDelete.push(...titleEntries.slice(1).map(e => e.id));
        console.log(`🔍 Trouvé ${titleEntries.length - 1} doublons pour "${title}"`);
      }
    }

    if (entriesToDelete.length === 0) {
      console.log('✨ Aucun doublon trouvé !');
      return;
    }

    // 4. Supprimer les doublons
    console.log(`🗑️ Suppression de ${entriesToDelete.length} doublons...`);
    const { error: deleteError } = await supabase
      .from('entries')
      .delete()
      .in('id', entriesToDelete);

    if (deleteError) {
      throw deleteError;
    }

    console.log('✅ Nettoyage terminé avec succès !');

    // 5. Vérifier le résultat final
    const { data: finalEntries, error: finalError } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', WORKSPACE_ID)
      .order('created_at', { ascending: true });

    if (finalError) {
      throw finalError;
    }

    console.log('\n📊 État final des entrées :');
    finalEntries.forEach(entry => {
      console.log(`- ${entry.title} (${entry.status})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    process.exit(1);
  }
}

cleanDuplicateEntries(); 