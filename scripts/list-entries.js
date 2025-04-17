import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Utiliser les variables d'environnement de production
const supabaseUrl = 'https://eahjdvmpmqwnupsqnxjz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U';

const supabase = createClient(supabaseUrl, supabaseKey);

const WORKSPACE_ID = 'b5301a85-1fd2-418e-8755-2b4acb806796';

async function listAllEntries() {
  console.log('📋 Liste de toutes les entrées dans le workspace BNP (Base de données en ligne)...\n');

  try {
    // Récupérer toutes les entrées
    const { data: entries, error } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', WORKSPACE_ID)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!entries || entries.length === 0) {
      console.log('❌ Aucune entrée trouvée dans ce workspace.');
      return;
    }

    console.log(`📊 Statistiques :`);
    console.log(`Total des entrées : ${entries.length}`);
    
    // Compter par statut
    const statusCount = entries.reduce((acc, entry) => {
      acc[entry.status] = (acc[entry.status] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`${status}: ${count} entrées`);
    });

    // Compter par priorité
    const priorityCount = entries.reduce((acc, entry) => {
      acc[entry.priority] = (acc[entry.priority] || 0) + 1;
      return acc;
    }, {});

    console.log('\n🎯 Par priorité :');
    Object.entries(priorityCount).forEach(([priority, count]) => {
      console.log(`${priority}: ${count} entrées`);
    });

    console.log('\n📝 Liste détaillée des entrées :');
    entries.forEach((entry, index) => {
      console.log(`\n${index + 1}. ${entry.title}`);
      console.log(`   Description: ${entry.description || 'Non définie'}`);
      console.log(`   Statut: ${entry.status}`);
      console.log(`   Priorité: ${entry.priority}`);
      console.log(`   Date d'échéance: ${entry.due_date || 'Non définie'}`);
      console.log(`   ID Utilisateur: ${entry.user_id}`);
      console.log(`   Créé le: ${new Date(entry.created_at).toLocaleString('fr-FR')}`);
      if (entry.created_at !== entry.updated_at) {
        console.log(`   Dernière mise à jour: ${new Date(entry.updated_at).toLocaleString('fr-FR')}`);
      }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des entrées:', error);
    process.exit(1);
  }
}

listAllEntries(); 