-- Create task_tags table
CREATE TABLE task_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, workspace_id)
);

-- Create task_tag_assignments table
CREATE TABLE task_tag_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES task_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(task_id, tag_id)
);

-- Add RLS policies
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Task tags policies
CREATE POLICY "Users can view task tags in their workspaces" ON task_tags
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create task tags in their workspaces" ON task_tags
    FOR INSERT WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update task tags in their workspaces" ON task_tags
    FOR UPDATE USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete task tags in their workspaces" ON task_tags
    FOR DELETE USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
        )
    );

-- Task tag assignments policies
CREATE POLICY "Users can view task tag assignments in their workspaces" ON task_tag_assignments
    FOR SELECT USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create task tag assignments in their workspaces" ON task_tag_assignments
    FOR INSERT WITH CHECK (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete task tag assignments in their workspaces" ON task_tag_assignments
    FOR DELETE USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON task_tags
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 