-- Activer RLS pour les tables
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table workspaces

-- Lecture : Un utilisateur peut voir un workspace s'il en est membre
CREATE POLICY "Lecture des workspaces pour les membres"
ON workspaces FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = workspaces.id
    AND workspace_members.user_id = auth.uid()
  )
);

-- Création : Tout utilisateur authentifié peut créer un workspace
CREATE POLICY "Création de workspace"
ON workspaces FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Mise à jour : Seuls les propriétaires et admins peuvent modifier un workspace
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

-- Suppression : Seuls les propriétaires peuvent supprimer un workspace
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

-- Lecture : Les membres d'un workspace peuvent voir les autres membres
CREATE POLICY "Lecture des membres d'un workspace"
ON workspace_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM workspace_members members
    WHERE members.workspace_id = workspace_members.workspace_id
    AND members.user_id = auth.uid()
  )
);

-- Création : Seuls les propriétaires et admins peuvent ajouter des membres
CREATE POLICY "Ajout de membres par les admins"
ON workspace_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_members.workspace_id = workspace_members.workspace_id
    AND workspace_members.user_id = auth.uid()
    AND workspace_members.role IN ('owner', 'admin')
  )
);

-- Mise à jour : Les propriétaires peuvent modifier tous les rôles, les admins peuvent modifier les rôles des membres
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

-- Suppression : Les propriétaires peuvent supprimer n'importe quel membre, les admins peuvent supprimer des membres
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