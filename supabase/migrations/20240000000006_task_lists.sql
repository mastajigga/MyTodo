-- Create task_lists table
CREATE TABLE task_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX task_lists_workspace_id_idx ON task_lists(workspace_id);
CREATE INDEX task_lists_created_by_idx ON task_lists(created_by);

-- Add updated_at trigger
CREATE TRIGGER set_task_lists_updated_at
    BEFORE UPDATE ON task_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Policies

-- Read policy: Users can read lists if they are members of the workspace
CREATE POLICY "Users can read lists if workspace member"
    ON task_lists
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = task_lists.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Insert policy: Users can create lists if they are members of the workspace
CREATE POLICY "Users can create lists if workspace member"
    ON task_lists
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Update policy: Users can update lists if they are members of the workspace
CREATE POLICY "Users can update lists if workspace member"
    ON task_lists
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = task_lists.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = task_lists.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Delete policy: Only workspace owners and admins can delete lists
CREATE POLICY "Only workspace owners and admins can delete lists"
    ON task_lists
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = task_lists.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    ); 