-- Mise à jour des types de workspace
BEGIN;

-- Créer un type temporaire pour la transition
ALTER TABLE workspaces 
ADD COLUMN temp_type text;

-- Convertir les anciens types vers les nouveaux
UPDATE workspaces 
SET temp_type = CASE type
    WHEN 'family' THEN 'family'
    WHEN 'professional' THEN 'team'
    WHEN 'private' THEN 'personal'
    ELSE 'personal' -- Valeur par défaut
END;

-- Supprimer l'ancienne contrainte
ALTER TABLE workspaces 
DROP CONSTRAINT IF EXISTS workspaces_type_check;

-- Supprimer l'ancienne colonne et renommer la nouvelle
ALTER TABLE workspaces 
DROP COLUMN type;

ALTER TABLE workspaces 
RENAME COLUMN temp_type TO type;

-- Ajouter la nouvelle contrainte
ALTER TABLE workspaces 
ADD CONSTRAINT workspaces_type_check 
CHECK (type IN ('family', 'team', 'personal'));

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer des workspaces" ON workspaces;
CREATE POLICY "Les utilisateurs peuvent créer des workspaces" ON workspaces
FOR INSERT TO authenticated
WITH CHECK (
    type IN ('family', 'team', 'personal')
);

DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leurs workspaces" ON workspaces;
CREATE POLICY "Les utilisateurs peuvent voir leurs workspaces" ON workspaces
FOR SELECT TO authenticated
USING (
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = workspaces.id
        AND workspace_members.user_id = auth.uid()
    )
);

COMMIT; 