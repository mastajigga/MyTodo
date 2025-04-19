-- Insertion des espaces de travail
INSERT INTO public.workspaces (id, name, description, type, created_by, created_at, updated_at)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', 'Espace Personnel', 'Mon espace de travail personnel', 'personal', auth.uid(), NOW(), NOW()),
  ('123e4567-e89b-12d3-a456-426614174001', 'Équipe Marketing', 'Espace de travail pour l''équipe marketing', 'team', auth.uid(), NOW(), NOW()),
  ('123e4567-e89b-12d3-a456-426614174002', 'Projet Web', 'Développement du nouveau site web', 'team', auth.uid(), NOW(), NOW());

-- Insertion des membres des espaces de travail
INSERT INTO public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
VALUES
  ('123e4567-e89b-12d3-a456-426614174000', auth.uid(), 'owner', NOW(), NOW()),
  ('123e4567-e89b-12d3-a456-426614174001', auth.uid(), 'admin', NOW(), NOW()),
  ('123e4567-e89b-12d3-a456-426614174002', auth.uid(), 'member', NOW(), NOW()); 