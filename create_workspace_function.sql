CREATE OR REPLACE FUNCTION create_workspace_with_owner(
    workspace_name text,
    workspace_description text,
    workspace_type text,
    owner_id uuid
) RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
DECLARE
    workspace_record json;
BEGIN
    -- Vérifier si l'utilisateur existe
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = owner_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Créer l'espace de travail
    INSERT INTO workspaces (name, description, type)
    VALUES (workspace_name, workspace_description, workspace_type)
    RETURNING to_json(workspaces.*) INTO workspace_record;

    -- Ajouter le créateur comme propriétaire
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (
        (workspace_record->>'id')::uuid,
        owner_id,
        'owner'
    );

    RETURN workspace_record;
END;
$$;
