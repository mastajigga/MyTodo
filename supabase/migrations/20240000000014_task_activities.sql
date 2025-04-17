-- Drop existing table and related objects
DROP TABLE IF EXISTS task_activities CASCADE;
DROP FUNCTION IF EXISTS task_status_update_trigger CASCADE;

-- Create task_activities table
CREATE TABLE task_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_task_activities_task_id ON task_activities(task_id);
CREATE INDEX idx_task_activities_user_id ON task_activities(user_id);
CREATE INDEX idx_task_activities_created_at ON task_activities(created_at DESC);

-- Enable RLS
ALTER TABLE task_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view task activities if workspace member"
    ON task_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM tasks t
            JOIN projects p ON p.id = t.project_id
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE t.id = task_activities.task_id
            AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create task activities if workspace member"
    ON task_activities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM tasks t
            JOIN projects p ON p.id = t.project_id
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE t.id = task_id
            AND wm.user_id = auth.uid()
        )
    );

-- Create trigger function for task status updates
CREATE FUNCTION task_status_update_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO task_activities (task_id, task_title, action, previous_status, new_status, user_id)
    VALUES (NEW.id, NEW.title, 'update', OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER task_status_update
  AFTER UPDATE OF status ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION task_status_update_trigger();

CREATE TRIGGER set_task_activities_updated_at
    BEFORE UPDATE ON task_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger if it doesn't exist
DROP TRIGGER IF EXISTS set_task_activities_updated_at ON task_activities;
CREATE TRIGGER set_task_activities_updated_at
    BEFORE UPDATE ON task_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 