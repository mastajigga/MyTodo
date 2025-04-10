-- Activer RLS sur les tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS view_workspaces ON workspaces;
DROP POLICY IF EXISTS create_workspaces ON workspaces;

-- Créer les nouvelles politiques
CREATE POLICY view_workspaces 
ON workspaces 
FOR SELECT TO authenticated 
USING (
    id IN (
        SELECT workspace_id 
        FROM workspace_members 
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY create_workspaces 
ON workspaces 
FOR INSERT TO authenticated 
WITH CHECK (true);
