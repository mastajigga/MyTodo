-- Add type column to workspaces table
ALTER TABLE workspaces ADD COLUMN type TEXT NOT NULL DEFAULT 'personal';

-- Add constraint to validate type values
ALTER TABLE workspaces ADD CONSTRAINT valid_workspace_type CHECK (type IN ('personal', 'team'));

-- Update RLS policies to include type column
DROP POLICY IF EXISTS "Création de workspace" ON workspaces;
CREATE POLICY "Création de workspace" ON workspaces
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND
        type IN ('personal', 'team')
    ); 