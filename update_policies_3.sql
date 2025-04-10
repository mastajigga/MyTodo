-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS view_workspace_members ON workspace_members;
DROP POLICY IF EXISTS manage_workspace_members ON workspace_members;
DROP POLICY IF EXISTS insert_initial_owner ON workspace_members;

-- Politique pour permettre au créateur initial du workspace d'être ajouté comme membre
CREATE POLICY insert_initial_owner 
ON workspace_members 
FOR INSERT TO authenticated 
WITH CHECK (
    role = 'owner' AND
    NOT EXISTS (
        SELECT 1 
        FROM workspace_members 
        WHERE workspace_id = workspace_members.workspace_id
    )
);

-- Politique pour permettre aux membres authentifiés de voir les membres des espaces de travail
CREATE POLICY view_workspace_members 
ON workspace_members 
FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 
        FROM workspace_members wm
        WHERE wm.workspace_id = workspace_members.workspace_id 
        AND wm.user_id = auth.uid()
    )
);

-- Politique pour permettre aux propriétaires et administrateurs de gérer les membres
CREATE POLICY manage_workspace_members 
ON workspace_members 
FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 
        FROM workspace_members wm
        WHERE wm.workspace_id = workspace_members.workspace_id 
        AND wm.user_id = auth.uid() 
        AND (wm.role = 'owner' OR wm.role = 'admin')
    )
);
