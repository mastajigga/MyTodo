-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view projects if workspace member" ON projects;
DROP POLICY IF EXISTS "Users can create projects if workspace member" ON projects;
DROP POLICY IF EXISTS "Users can update projects if workspace member" ON projects;
DROP POLICY IF EXISTS "Users can delete projects if workspace member" ON projects;

-- Create policies
CREATE POLICY "Users can view projects if workspace member"
    ON projects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create projects if workspace member"
    ON projects FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update projects if workspace member"
    ON projects FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can delete projects if workspace member"
    ON projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = projects.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    ); 