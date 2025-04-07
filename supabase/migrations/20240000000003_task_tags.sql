-- Création de la table des étiquettes
create table task_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  color text not null,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(name, workspace_id)
);

-- Création de la table de liaison entre tâches et étiquettes
create table task_tag_assignments (
  task_id uuid references tasks(id) on delete cascade,
  tag_id uuid references task_tags(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (task_id, tag_id)
);

-- Politiques de sécurité pour les étiquettes
create policy "Les membres de l'espace de travail peuvent lire les étiquettes"
  on task_tags for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = task_tags.workspace_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Les membres de l'espace de travail peuvent créer des étiquettes"
  on task_tags for insert
  with check (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = task_tags.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('admin', 'member')
    )
  );

create policy "Les membres de l'espace de travail peuvent modifier les étiquettes"
  on task_tags for update
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = task_tags.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('admin', 'member')
    )
  );

create policy "Les membres de l'espace de travail peuvent supprimer les étiquettes"
  on task_tags for delete
  using (
    exists (
      select 1 from workspace_members
      where workspace_members.workspace_id = task_tags.workspace_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('admin', 'member')
    )
  );

-- Politiques de sécurité pour les assignations d'étiquettes
create policy "Les membres de l'espace de travail peuvent lire les assignations d'étiquettes"
  on task_tag_assignments for select
  using (
    exists (
      select 1 from tasks
      join workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_tag_assignments.task_id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Les membres de l'espace de travail peuvent assigner des étiquettes"
  on task_tag_assignments for insert
  with check (
    exists (
      select 1 from tasks
      join workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_tag_assignments.task_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('admin', 'member')
    )
  );

create policy "Les membres de l'espace de travail peuvent supprimer des assignations d'étiquettes"
  on task_tag_assignments for delete
  using (
    exists (
      select 1 from tasks
      join workspace_members on workspace_members.workspace_id = tasks.workspace_id
      where tasks.id = task_tag_assignments.task_id
      and workspace_members.user_id = auth.uid()
      and workspace_members.role in ('admin', 'member')
    )
  );

-- Activation de la sécurité niveau ligne
alter table task_tags enable row level security;
alter table task_tag_assignments enable row level security; 