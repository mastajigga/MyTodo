-- Create task_activities table
CREATE TABLE task_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'completed', 'updated')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_task_activities_created_at ON task_activities(created_at DESC);
CREATE INDEX idx_task_activities_task_id ON task_activities(task_id);
CREATE INDEX idx_task_activities_user_id ON task_activities(user_id);

-- Enable RLS
ALTER TABLE task_activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view activities of tasks they have access to" ON task_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_activities.task_id
      AND (
        t.created_by = auth.uid() OR
        t.assigned_to = auth.uid() OR
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can create activities for tasks they have access to" ON task_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = task_activities.task_id
      AND (
        t.created_by = auth.uid() OR
        t.assigned_to = auth.uid() OR
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_members pm
          WHERE pm.project_id = p.id
          AND pm.user_id = auth.uid()
        )
      )
    )
  );

-- Trigger to automatically create activity when task is created
CREATE OR REPLACE FUNCTION create_task_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO task_activities (task_id, task_title, action, user_id)
  VALUES (NEW.id, NEW.title, 'created', auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_created_activity
  AFTER INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION create_task_activity();

-- Trigger to automatically create activity when task status is updated to completed
CREATE OR REPLACE FUNCTION create_task_completed_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO task_activities (task_id, task_title, action, user_id)
    VALUES (NEW.id, NEW.title, 'completed', auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_completed_activity
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION create_task_completed_activity();

-- Trigger to create activity when task is updated (except completion)
CREATE OR REPLACE FUNCTION create_task_updated_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.title != OLD.title OR NEW.description != OLD.description OR 
      NEW.priority != OLD.priority OR NEW.due_date != OLD.due_date OR
      NEW.assigned_to != OLD.assigned_to) AND
     NOT (NEW.status = 'completed' AND OLD.status != 'completed') THEN
    INSERT INTO task_activities (task_id, task_title, action, user_id)
    VALUES (NEW.id, NEW.title, 'updated', auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER task_updated_activity
  AFTER UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION create_task_updated_activity(); 