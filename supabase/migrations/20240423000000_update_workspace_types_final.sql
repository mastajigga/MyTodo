-- Update workspace types to match current database state
BEGIN;

-- Drop the existing type check constraint
ALTER TABLE workspaces DROP CONSTRAINT IF EXISTS workspaces_type_check;

-- Add the new constraint with the correct types
ALTER TABLE workspaces 
ADD CONSTRAINT workspaces_type_check 
CHECK (type IN ('family', 'professional', 'private'));

-- Update the workspace creation function to use the new types
CREATE OR REPLACE FUNCTION create_workspace(
    workspace_name text,
    workspace_type text DEFAULT 'private'
) RETURNS uuid
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS $$
DECLARE
    new_workspace_id uuid;
BEGIN
    -- Validate workspace type
    IF workspace_type NOT IN ('family', 'professional', 'private') THEN
        RAISE EXCEPTION 'Invalid workspace type. Must be one of: family, professional, private';
    END IF;

    -- Create the workspace
    INSERT INTO workspaces (name, type)
    VALUES (workspace_name, workspace_type)
    RETURNING id INTO new_workspace_id;

    -- Add the creator as the owner
    INSERT INTO workspace_members (workspace_id, profile_id, role)
    VALUES (new_workspace_id, auth.uid(), 'owner');

    RETURN new_workspace_id;
END;
$$;

-- Update RLS policies to reflect the new types
DROP POLICY IF EXISTS "Users can view their own workspaces" ON workspaces;
CREATE POLICY "Users can view their own workspaces"
    ON workspaces
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM workspace_members
            WHERE workspace_members.workspace_id = workspaces.id
            AND workspace_members.profile_id = auth.uid()
        )
    );

COMMIT; 