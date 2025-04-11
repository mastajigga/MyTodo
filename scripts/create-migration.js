const fs = require('fs').promises;
const path = require('path');

async function createMigration() {
  try {
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error('Veuillez spécifier un nom pour la migration');
      console.error('Usage: npm run migrate:create <nom_migration>');
      process.exit(1);
    }

    // Obtenir la date actuelle au format YYYYMMDDHHMMSS
    const timestamp = new Date().toISOString()
      .replace(/[-T:]|\.\d{3}Z$/g, '')
      .slice(0, 14);

    const fileName = `${timestamp}_${migrationName}.sql`;
    const migrationsDir = path.join(__dirname, '../supabase/migrations');

    // Créer le répertoire des migrations s'il n'existe pas
    await fs.mkdir(migrationsDir, { recursive: true });

    // Créer le fichier de migration avec un template
    const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}

-- Write your SQL migration here

-- Example:
-- CREATE TABLE example (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     name TEXT NOT NULL,
--     created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
-- );

-- Remember to:
-- 1. Enable RLS if needed
-- ALTER TABLE example ENABLE ROW LEVEL SECURITY;

-- 2. Create necessary indexes
-- CREATE INDEX example_name_idx ON example(name);

-- 3. Add RLS policies if needed
-- CREATE POLICY "Users can read their own data" ON example FOR SELECT USING (created_by = auth.uid());

-- 4. Add triggers if needed
-- CREATE TRIGGER set_updated_at
--     BEFORE UPDATE ON example
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- 5. Add any necessary constraints
-- ALTER TABLE example ADD CONSTRAINT example_name_unique UNIQUE (name);
`;

    await fs.writeFile(path.join(migrationsDir, fileName), template);
    console.log(`Migration créée : ${fileName}`);
  } catch (error) {
    console.error('Erreur lors de la création de la migration :', error);
    process.exit(1);
  }
}

createMigration(); 