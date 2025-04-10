-- Suppression des politiques existantes
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Users can manage workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON workspaces;
DROP POLICY IF EXISTS "Enable insert for workspace members" ON workspace_members;

-- Activation de RLS sur les tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Politique pour voir les espaces de travail dont on est membre
CREATE POLICY "Users can view workspaces they are members of"
ON workspaces
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM workspace_members 
    WHERE workspace_id = id
  )
);

-- Politique pour voir les membres d'un espace de travail
CREATE POLICY "Users can view workspace members"
ON workspace_members
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM workspace_members 
    WHERE workspace_id = workspace_id
  )
);

-- Politique pour gérer les membres (uniquement pour les propriétaires et administrateurs)
CREATE POLICY "Users can manage workspace members"
ON workspace_members
FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM workspace_members 
    WHERE workspace_id = workspace_id 
    AND role IN ('owner', 'admin')
  )
);

-- Politique pour permettre l'insertion de nouveaux espaces de travail
CREATE POLICY "Enable insert for authenticated users only"
ON workspaces
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre l'insertion de membres (via la fonction create_workspace_with_owner)
CREATE POLICY "Enable insert for workspace members"
ON workspace_members
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
