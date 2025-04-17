-- Suppression des objets existants
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TYPE IF EXISTS task_position_update CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- Création de la fonction de mise à jour automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    ELSE
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

-- Type personnalisé pour la mise à jour des positions
CREATE TYPE task_position_update AS (
    id UUID,
    position INTEGER
);

-- Création de la table tasks
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo',
    priority TEXT NOT NULL DEFAULT 'medium',
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_status CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Création des index
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS tasks_created_by_idx ON tasks(created_by);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);
CREATE INDEX IF NOT EXISTS tasks_position_idx ON tasks(position);

-- Ajout du trigger updated_at
DROP TRIGGER IF EXISTS set_tasks_updated_at ON tasks;
CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction de réorganisation des tâches
CREATE OR REPLACE FUNCTION reorder_tasks(task_updates task_position_update[], project_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    task_update task_position_update;
BEGIN
    -- Vérifie que l'utilisateur a accès au projet
    IF NOT EXISTS (
        SELECT 1 FROM projects p
        JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
        WHERE p.id = project_id_param
        AND wm.user_id = auth.uid()
    ) THEN
        RAISE EXCEPTION 'Accès non autorisé à ce projet';
    END IF;

    -- Met à jour les positions des tâches
    FOREACH task_update IN ARRAY task_updates
    LOOP
        UPDATE tasks
        SET position = task_update.position,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = task_update.id
        AND project_id = project_id_param;
    END LOOP;
END;
$$;

-- Activation de RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
DROP POLICY IF EXISTS "Users can read tasks if workspace member" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks if workspace member" ON tasks;
DROP POLICY IF EXISTS "Users can update tasks if workspace member" ON tasks;
DROP POLICY IF EXISTS "Only workspace owners, admins, and task creator can delete tasks" ON tasks;

CREATE POLICY "Users can read tasks if workspace member"
    ON tasks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            JOIN workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = tasks.project_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks if workspace member"
    ON tasks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            JOIN workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = project_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks if workspace member"
    ON tasks FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            JOIN workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = tasks.project_id
            AND workspace_members.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects
            JOIN workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = tasks.project_id
            AND workspace_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Only workspace owners, admins, and task creator can delete tasks"
    ON tasks FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM projects
            JOIN workspace_members ON workspace_members.workspace_id = projects.workspace_id
            WHERE projects.id = tasks.project_id
            AND workspace_members.user_id = auth.uid()
            AND (
                workspace_members.role IN ('owner', 'admin')
                OR tasks.created_by = auth.uid()
            )
        )
    ); 