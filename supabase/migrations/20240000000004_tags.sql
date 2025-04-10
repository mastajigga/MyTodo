-- Create tags table
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    UNIQUE(name, workspace_id)
);

-- Create task_tags table
CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    PRIMARY KEY (task_id, tag_id)
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX tags_workspace_id_idx ON tags(workspace_id);
CREATE INDEX task_tags_task_id_idx ON task_tags(task_id);
CREATE INDEX task_tags_tag_id_idx ON task_tags(tag_id);

-- Add updated_at trigger for tags
CREATE TRIGGER set_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tags Policies

-- Read policy: Users can read tags if they are members of the workspace
CREATE POLICY "Users can read tags if workspace member"
    ON tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = tags.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Insert policy: Users can create tags if they are members of the workspace
CREATE POLICY "Users can create tags if workspace member"
    ON tags
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Update policy: Users can update tags if they are members of the workspace
CREATE POLICY "Users can update tags if workspace member"
    ON tags
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = tags.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = tags.workspace_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Delete policy: Only workspace owners and admins can delete tags
CREATE POLICY "Only workspace owners and admins can delete tags"
    ON tags
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = tags.workspace_id
            AND workspace_members.user_id = auth.uid()
            AND workspace_members.role IN ('owner', 'admin')
        )
    );

-- Task Tags Policies

-- Read policy: Users can read task tags if they can read the task
CREATE POLICY "Users can read task tags if they can read the task"
    ON task_tags
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN task_lists ON task_lists.id = tasks.list_id
            JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
            WHERE tasks.id = task_tags.task_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Insert policy: Users can add tags to tasks if they can update the task
CREATE POLICY "Users can add tags to tasks if they can update the task"
    ON task_tags
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN task_lists ON task_lists.id = tasks.list_id
            JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
            WHERE tasks.id = task_id
            AND workspace_members.user_id = auth.uid()
        )
    );

-- Delete policy: Users can remove tags from tasks if they can update the task
CREATE POLICY "Users can remove tags from tasks if they can update the task"
    ON task_tags
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN task_lists ON task_lists.id = tasks.list_id
            JOIN workspace_members ON workspace_members.workspace_id = task_lists.workspace_id
            WHERE tasks.id = task_id
            AND workspace_members.user_id = auth.uid()
        )
    ); 