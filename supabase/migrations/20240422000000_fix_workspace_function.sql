-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.create_workspace_with_owner;

-- Recréer la fonction avec les bons paramètres
CREATE OR REPLACE FUNCTION public.create_workspace_with_owner(
    owner_id uuid,
    workspace_description text,
    workspace_name text,
    workspace_type text
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_workspace_id uuid;
BEGIN
    -- Vérifier que le type est valide
    IF workspace_type NOT IN ('personal', 'team', 'family') THEN
        RAISE EXCEPTION 'Type d''espace de travail invalide';
    END IF;

    -- Créer le workspace
    INSERT INTO workspaces (name, description, type, created_by)
    VALUES (workspace_name, workspace_description, workspace_type, owner_id)
    RETURNING id INTO new_workspace_id;

    -- Ajouter le créateur comme propriétaire
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (new_workspace_id, owner_id, 'owner');

    RETURN json_build_object(
        'id', new_workspace_id,
        'name', workspace_name,
        'description', workspace_description,
        'type', workspace_type,
        'created_by', owner_id
    );
END;
$$; 