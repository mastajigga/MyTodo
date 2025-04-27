-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS create_workspace_with_owner;

-- Fonction pour créer un workspace et ajouter le créateur comme propriétaire
CREATE OR REPLACE FUNCTION create_workspace_with_owner(
  workspace_name TEXT,
  workspace_description TEXT,
  workspace_type TEXT
)
RETURNS workspaces
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace workspaces;
BEGIN
  -- Vérifier que l'utilisateur est authentifié
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Utilisateur non authentifié';
  END IF;

  -- Vérifier que le type est valide
  IF workspace_type NOT IN ('personal', 'team', 'family') THEN
    RAISE EXCEPTION 'Type d''espace de travail invalide';
  END IF;

  -- Créer le workspace
  INSERT INTO workspaces (name, description, type, created_by)
  VALUES (workspace_name, workspace_description, workspace_type, auth.uid())
  RETURNING * INTO new_workspace;

  -- Ajouter le créateur comme propriétaire
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace.id, auth.uid(), 'owner');

  RETURN new_workspace;
END;
$$; 