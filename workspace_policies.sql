-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS view_workspaces ON workspaces;
DROP POLICY IF EXISTS create_workspaces ON workspaces;
DROP POLICY IF EXISTS update_workspaces ON workspaces;
DROP POLICY IF EXISTS delete_workspaces ON workspaces;

DROP POLICY IF EXISTS view_workspace_members ON workspace_members;
DROP POLICY IF EXISTS insert_owner_workspace_members ON workspace_members;
DROP POLICY IF EXISTS manage_workspace_members ON workspace_members;
DROP POLICY IF EXISTS update_workspace_members ON workspace_members;
DROP POLICY IF EXISTS delete_workspace_members ON workspace_members;

-- Activer RLS sur les tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table workspaces
CREATE POLICY create_workspaces ON workspaces
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY view_workspaces ON workspaces
FOR SELECT TO authenticated
USING (true);

CREATE POLICY update_workspaces ON workspaces
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
);

CREATE POLICY delete_workspaces ON workspaces
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = workspaces.id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
);

-- Politiques pour la table workspace_members
CREATE POLICY view_workspace_members ON workspace_members
FOR SELECT TO authenticated
USING (true);

-- Politique pour l'insertion du propriétaire (première insertion)
CREATE POLICY insert_initial_owner ON workspace_members
FOR INSERT TO authenticated
WITH CHECK (
    role = 'owner' AND
    NOT EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = workspace_members.workspace_id
    )
);

-- Politique pour l'ajout de membres par les propriétaires/admins
CREATE POLICY insert_members ON workspace_members
FOR INSERT TO authenticated
WITH CHECK (
    role != 'owner' AND
    EXISTS (
        SELECT 1
        FROM workspaces w
        WHERE w.id = workspace_members.workspace_id
        AND EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = w.id
            AND wm.user_id = auth.uid()
            AND (wm.role = 'owner' OR wm.role = 'admin')
        )
    )
);

-- Politique pour la mise à jour des membres
CREATE POLICY update_members ON workspace_members
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM workspaces w
        WHERE w.id = workspace_members.workspace_id
        AND EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = w.id
            AND wm.user_id = auth.uid()
            AND (wm.role = 'owner' OR wm.role = 'admin')
        )
    )
);

-- Politique pour la suppression des membres
CREATE POLICY delete_members ON workspace_members
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM workspaces w
        WHERE w.id = workspace_members.workspace_id
        AND EXISTS (
            SELECT 1
            FROM workspace_members wm
            WHERE wm.workspace_id = w.id
            AND wm.user_id = auth.uid()
            AND (wm.role = 'owner' OR wm.role = 'admin')
        )
    )
); 