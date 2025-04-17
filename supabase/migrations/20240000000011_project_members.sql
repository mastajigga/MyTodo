-- Create project_members table
CREATE TABLE project_members (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('owner', 'admin', 'member')) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (project_id, user_id)
);

-- Enable RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX project_members_project_id_idx ON project_members(project_id);
CREATE INDEX project_members_user_id_idx ON project_members(user_id);

-- Create policies
CREATE POLICY "Users can view project members if workspace member"
    ON project_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_members.project_id
            AND wm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add project members if workspace admin"
    ON project_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_id
            AND wm.user_id = auth.uid()
            AND wm.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can update project members if workspace admin"
    ON project_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_members.project_id
            AND wm.user_id = auth.uid()
            AND wm.role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_members.project_id
            AND wm.user_id = auth.uid()
            AND wm.role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Users can remove project members if workspace admin"
    ON project_members FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects p
            JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
            WHERE p.id = project_members.project_id
            AND wm.user_id = auth.uid()
            AND wm.role IN ('owner', 'admin')
        )
    );

-- Create function to automatically add project creator as owner
CREATE OR REPLACE FUNCTION add_project_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger to add project creator as owner
CREATE TRIGGER on_project_created
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION add_project_creator_as_member(); 