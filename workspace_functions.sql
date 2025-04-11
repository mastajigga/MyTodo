-- Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS create_workspace_with_owner(text, text, text, uuid);
DROP FUNCTION IF EXISTS add_workspace_member(uuid, uuid, text, uuid);
DROP FUNCTION IF EXISTS update_workspace_member(uuid, uuid, text, uuid);
DROP FUNCTION IF EXISTS remove_workspace_member(uuid, uuid, uuid);

-- Fonction pour créer un workspace et son propriétaire initial
CREATE OR REPLACE FUNCTION create_workspace_with_owner(
    workspace_name text,
    workspace_description text,
    workspace_type text,
    owner_id uuid
) RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    new_workspace_id uuid;
BEGIN
    -- Insérer le workspace
    INSERT INTO workspaces (name, description, type)
    VALUES (workspace_name, workspace_description, workspace_type)
    RETURNING id INTO new_workspace_id;

    -- Ajouter le propriétaire
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (new_workspace_id, owner_id, 'owner');

    RETURN json_build_object(
        'workspace_id', new_workspace_id,
        'name', workspace_name,
        'description', workspace_description,
        'type', workspace_type
    );
END;
$$;

-- Fonction pour ajouter un membre à un workspace
CREATE OR REPLACE FUNCTION add_workspace_member(
    p_workspace_id uuid,
    p_user_id uuid,
    p_role text,
    p_current_user_id uuid
) RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    is_authorized boolean;
BEGIN
    -- Vérifier si l'utilisateur actuel est propriétaire ou admin
    SELECT EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = p_workspace_id
        AND user_id = p_current_user_id
        AND (role = 'owner' OR role = 'admin')
    ) INTO is_authorized;

    -- Si autorisé et le rôle n'est pas 'owner', ajouter le membre
    IF is_authorized AND p_role != 'owner' THEN
        INSERT INTO workspace_members (workspace_id, user_id, role)
        VALUES (p_workspace_id, p_user_id, p_role);
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Fonction pour mettre à jour un membre
CREATE OR REPLACE FUNCTION update_workspace_member(
    p_workspace_id uuid,
    p_user_id uuid,
    p_new_role text,
    p_current_user_id uuid
) RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    is_authorized boolean;
    target_is_owner boolean;
BEGIN
    -- Vérifier si l'utilisateur actuel est propriétaire ou admin
    SELECT EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = p_workspace_id
        AND user_id = p_current_user_id
        AND (role = 'owner' OR role = 'admin')
    ) INTO is_authorized;

    -- Vérifier si l'utilisateur cible est propriétaire
    SELECT role = 'owner'
    FROM workspace_members
    WHERE workspace_id = p_workspace_id
    AND user_id = p_user_id
    INTO target_is_owner;

    -- Ne pas permettre la modification des propriétaires
    IF is_authorized AND NOT target_is_owner AND p_new_role != 'owner' THEN
        UPDATE workspace_members
        SET role = p_new_role
        WHERE workspace_id = p_workspace_id
        AND user_id = p_user_id;
        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Fonction pour supprimer un membre
CREATE OR REPLACE FUNCTION remove_workspace_member(
    p_workspace_id uuid,
    p_user_id uuid,
    p_current_user_id uuid
) RETURNS boolean
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    is_authorized boolean;
    target_is_owner boolean;
BEGIN
    -- Vérifier si l'utilisateur actuel est propriétaire ou admin
    SELECT EXISTS (
        SELECT 1
        FROM workspace_members
        WHERE workspace_id = p_workspace_id
        AND user_id = p_current_user_id
        AND (role = 'owner' OR role = 'admin')
    ) INTO is_authorized;

    -- Vérifier si l'utilisateur cible est propriétaire
    SELECT role = 'owner'
    FROM workspace_members
    WHERE workspace_id = p_workspace_id
    AND user_id = p_user_id
    INTO target_is_owner;

    -- Ne pas permettre la suppression des propriétaires
    IF is_authorized AND NOT target_is_owner THEN
        DELETE FROM workspace_members
        WHERE workspace_id = p_workspace_id
        AND user_id = p_user_id;
        RETURN true;
    END IF;

    RETURN false;
END;
$$; 