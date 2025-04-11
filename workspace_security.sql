-- Désactiver RLS temporairement
ALTER TABLE workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members DISABLE ROW LEVEL SECURITY;

-- Supprimer les objets existants
DROP MATERIALIZED VIEW IF EXISTS workspace_permissions CASCADE;
DROP TRIGGER IF EXISTS workspace_members_changes ON workspace_members;
DROP FUNCTION IF EXISTS trigger_refresh_permissions();
DROP FUNCTION IF EXISTS refresh_workspace_permissions();
DROP FUNCTION IF EXISTS check_workspace_permission(uuid, uuid, text);
DROP FUNCTION IF EXISTS create_workspace(text, text, text, uuid);

-- Créer une vue matérialisée pour les permissions
CREATE MATERIALIZED VIEW workspace_permissions AS
SELECT DISTINCT
    wm.workspace_id,
    wm.user_id,
    wm.role,
    w.name as workspace_name
FROM workspace_members wm
JOIN workspaces w ON w.id = wm.workspace_id;

-- Créer des index pour de meilleures performances
CREATE UNIQUE INDEX idx_workspace_permissions_unique 
ON workspace_permissions(workspace_id, user_id);

CREATE INDEX idx_workspace_permissions_user 
ON workspace_permissions(user_id);

-- Fonction helper pour vérifier les permissions
CREATE OR REPLACE FUNCTION check_workspace_permission(
    p_workspace_id uuid,
    p_user_id uuid,
    p_required_role text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM workspace_permissions
        WHERE workspace_id = p_workspace_id
        AND user_id = p_user_id
        AND (p_required_role IS NULL OR role = p_required_role)
    );
END;
$$;

-- Fonction pour rafraîchir les permissions
CREATE OR REPLACE FUNCTION refresh_workspace_permissions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY workspace_permissions;
END;
$$;

-- Trigger pour rafraîchir les permissions automatiquement
CREATE OR REPLACE FUNCTION trigger_refresh_permissions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM refresh_workspace_permissions();
    RETURN NULL;
END;
$$;

CREATE TRIGGER workspace_members_changes
AFTER INSERT OR UPDATE OR DELETE ON workspace_members
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_permissions();

-- Fonction pour créer un workspace
CREATE OR REPLACE FUNCTION create_workspace(
    p_name text,
    p_description text,
    p_type text,
    p_user_id uuid
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_workspace_id uuid;
BEGIN
    -- Insérer le workspace
    INSERT INTO workspaces (name, description, type)
    VALUES (p_name, p_description, p_type)
    RETURNING id INTO v_workspace_id;

    -- Ajouter le propriétaire
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (v_workspace_id, p_user_id, 'owner');

    -- Rafraîchir la vue matérialisée
    PERFORM refresh_workspace_permissions();

    RETURN json_build_object(
        'id', v_workspace_id,
        'name', p_name,
        'description', p_description,
        'type', p_type
    );
END;
$$; 