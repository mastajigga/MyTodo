-- Création des tables si elles n'existent pas
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('family', 'professional', 'private')) NOT NULL,
  created_by UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID REFERENCES workspaces ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (workspace_id, user_id)
);

-- Activer RLS pour les tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Lecture des workspaces pour les membres" ON workspaces;
DROP POLICY IF EXISTS "Création de workspace" ON workspaces;
DROP POLICY IF EXISTS "Modification de workspace par les admins" ON workspaces;
DROP POLICY IF EXISTS "Suppression de workspace par le propriétaire" ON workspaces;
DROP POLICY IF EXISTS "Lecture des membres d'un workspace" ON workspace_members;
DROP POLICY IF EXISTS "Ajout de membres par les admins" ON workspace_members;
DROP POLICY IF EXISTS "Modification des rôles par les admins" ON workspace_members;
DROP POLICY IF EXISTS "Suppression de membres" ON workspace_members;

-- Politiques pour la table workspaces
CREATE POLICY "Lecture des workspaces pour les membres"
ON workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = workspaces.id
    AND workspace_members.user_id = auth.uid()
  )
);

CREATE POLICY "Création de workspace"
ON workspaces FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Modification de workspace par les admins"
ON workspaces FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = workspaces.id
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Suppression de workspace par le propriétaire"
ON workspaces FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = workspaces.id
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role = 'owner'
  )
);

-- Politiques pour la table workspace_members
CREATE POLICY "Lecture des membres d'un workspace"
ON workspace_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workspace_members members
    WHERE members.workspace_id = workspace_members.workspace_id
    AND members.user_id = auth.uid()
  )
);

CREATE POLICY "Ajout de membres par les admins"
ON workspace_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = "NEW".workspace_id
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role IN ('owner', 'admin')
  )
  OR NOT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = "NEW".workspace_id
  )
);

CREATE POLICY "Modification des rôles par les admins"
ON workspace_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members admin
    WHERE admin.workspace_id = workspace_members.workspace_id
    AND admin.user_id = auth.uid()
    AND (
      admin.role = 'owner'
      OR (
        admin.role = 'admin'
        AND workspace_members.role = 'member'
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members admin
    WHERE admin.workspace_id = "NEW".workspace_id
    AND admin.user_id = auth.uid()
    AND (
      admin.role = 'owner'
      OR (
        admin.role = 'admin'
        AND "NEW".role = 'member'
      )
    )
  )
);

CREATE POLICY "Suppression de membres"
ON workspace_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workspace_members admin
    WHERE admin.workspace_id = workspace_members.workspace_id
    AND admin.user_id = auth.uid()
    AND (
      admin.role = 'owner'
      OR (
        admin.role = 'admin'
        AND workspace_members.role = 'member'
      )
    )
  )
); 