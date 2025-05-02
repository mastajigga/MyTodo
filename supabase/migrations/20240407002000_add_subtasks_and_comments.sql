-- Create subtasks table
CREATE TABLE subtasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Subtasks policies
CREATE POLICY "Users can view subtasks in their workspaces" ON subtasks
    FOR SELECT USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create subtasks in their workspaces" ON subtasks
    FOR INSERT WITH CHECK (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update subtasks in their workspaces" ON subtasks
    FOR UPDATE USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete subtasks in their workspaces" ON subtasks
    FOR DELETE USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

-- Comments policies
CREATE POLICY "Users can view comments in their workspaces" ON comments
    FOR SELECT USING (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create comments in their workspaces" ON comments
    FOR INSERT WITH CHECK (
        task_id IN (
            SELECT t.id FROM tasks t
            JOIN workspace_members wm ON t.workspace_id = wm.workspace_id
            WHERE wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (
        user_id = auth.uid()
    );

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (
        user_id = auth.uid()
    );

-- Add triggers for updated_at
CREATE TRIGGER set_subtasks_updated_at
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at(); 