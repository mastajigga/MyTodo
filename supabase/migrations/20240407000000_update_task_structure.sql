-- Ajout de la colonne tags à la table tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Mise à jour des contraintes de status
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check 
  CHECK (status = ANY (ARRAY['todo', 'in_progress', 'review', 'done']));

-- Mise à jour des contraintes de priority
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_priority_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_priority_check 
  CHECK (priority = ANY (ARRAY['low', 'medium', 'high', 'urgent']));

-- Mise à jour des colonnes timestamp pour qu'elles ne soient pas nullables
ALTER TABLE tasks 
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET NOT NULL; 