-- Supprimer toutes les politiques de la table workspaces
DROP POLICY IF EXISTS view_workspaces ON workspaces;
DROP POLICY IF EXISTS create_workspaces ON workspaces;
DROP POLICY IF EXISTS update_workspaces ON workspaces;
DROP POLICY IF EXISTS delete_workspaces ON workspaces;

-- Supprimer toutes les politiques de la table workspace_members
DROP POLICY IF EXISTS view_workspace_members ON workspace_members;
DROP POLICY IF EXISTS manage_workspace_members ON workspace_members;
DROP POLICY IF EXISTS insert_initial_owner ON workspace_members;
DROP POLICY IF EXISTS update_workspace_members ON workspace_members;
DROP POLICY IF EXISTS delete_workspace_members ON workspace_members;

-- Désactiver RLS sur les tables
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members DISABLE ROW LEVEL SECURITY; 