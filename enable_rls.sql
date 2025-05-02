-- Réactiver RLS sur les tables principales
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Rafraîchir la vue matérialisée des permissions
REFRESH MATERIALIZED VIEW CONCURRENTLY workspace_permissions;

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('workspaces', 'workspace_members');

-- Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('workspaces', 'workspace_members')
ORDER BY tablename, policyname;

-- Vérifier les index de la vue matérialisée
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE tablename = 'workspace_permissions'; 