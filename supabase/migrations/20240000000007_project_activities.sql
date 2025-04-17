-- Create project_activities table
CREATE TABLE project_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('comment', 'status_change', 'completion')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger
CREATE TRIGGER set_project_activities_updated_at
    BEFORE UPDATE ON project_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view activities if workspace member"
    ON project_activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_activities.project_id
            AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create activities if workspace member"
    ON project_activities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_id
            AND wm.user_id = auth.uid()
        )
    );

-- Create indexes
CREATE INDEX idx_project_activities_project_id ON project_activities(project_id);
CREATE INDEX idx_project_activities_user_id ON project_activities(user_id);
CREATE INDEX idx_project_activities_created_at ON project_activities(created_at DESC);

-- Create function to add activity
CREATE OR REPLACE FUNCTION add_project_activity(
    p_project_id UUID,
    p_type TEXT,
    p_description TEXT
)
RETURNS SETOF project_activities
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Verify user has access to project
    IF NOT EXISTS (
        SELECT 1 FROM projects p
        JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = p_project_id
        AND wm.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'User does not have access to this project';
    END IF;

    -- Insert and return the activity
    RETURN QUERY
    INSERT INTO project_activities (project_id, user_id, type, description)
    VALUES (p_project_id, auth.uid(), p_type, p_description)
    RETURNING *;
END;
$$; 