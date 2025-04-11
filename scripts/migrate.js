const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

async function getCurrentMigrationVersion() {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')
    .order('version', { ascending: false })
    .limit(1);

  if (error) {
    if (error.message.includes('relation "schema_migrations" does not exist')) {
      // Créer la table schema_migrations si elle n'existe pas
      await supabase.rpc('create_migrations_table');
      return 0;
    }
    throw error;
  }

  return data.length > 0 ? parseInt(data[0].version) : 0;
}

async function applyMigration(version, sql) {
  try {
    // Exécuter la migration dans une transaction
    await supabase.rpc('begin_transaction');
    await supabase.rpc('run_sql', { sql });
    
    // Enregistrer la version de migration
    await supabase
      .from('schema_migrations')
      .insert([{ version, applied_at: new Date().toISOString() }]);
    
    await supabase.rpc('commit_transaction');
    console.log(`Migration ${version} appliquée avec succès`);
  } catch (error) {
    await supabase.rpc('rollback_transaction');
    throw error;
  }
}

async function migrate() {
  try {
    const currentVersion = await getCurrentMigrationVersion();
    console.log(`Version actuelle de la base de données : ${currentVersion}`);

    // Lire tous les fichiers de migration
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const files = await fs.readdir(migrationsDir);
    
    // Filtrer et trier les fichiers de migration
    const migrations = files
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => {
        const versionA = parseInt(a.split('_')[0]);
        const versionB = parseInt(b.split('_')[0]);
        return versionA - versionB;
      });

    // Appliquer les nouvelles migrations
    for (const file of migrations) {
      const version = parseInt(file.split('_')[0]);
      if (version > currentVersion) {
        console.log(`Application de la migration ${file}...`);
        const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
        await applyMigration(version, sql);
      }
    }

    console.log('Toutes les migrations ont été appliquées avec succès');
  } catch (error) {
    console.error('Erreur lors de la migration :', error);
    process.exit(1);
  }
}

// Exécuter les migrations
migrate(); 