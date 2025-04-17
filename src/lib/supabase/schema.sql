-- Création de la table entries
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
    priority VARCHAR NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création des index
CREATE INDEX IF NOT EXISTS idx_entries_workspace ON public.entries(workspace_id);
CREATE INDEX IF NOT EXISTS idx_entries_user ON public.entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_status ON public.entries(status);

-- Création de la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Création du trigger pour la mise à jour automatique
CREATE TRIGGER update_entries_updated_at
    BEFORE UPDATE ON public.entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 