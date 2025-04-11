# Structure de la Base de Données MyTodo

## Tables Principales

### 1. Workspaces
Table contenant les espaces de travail des utilisateurs.
```sql
CREATE TABLE workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);
```

### 2. Task Lists
Table contenant les listes de tâches appartenant à un workspace.
```sql
CREATE TABLE task_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
);
```

### 3. Tasks
Table contenant les tâches individuelles.
```sql
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
    due_date TIMESTAMPTZ,
    list_id UUID NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES auth.users(id),
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0
);
```

### 4. Tags (Nouveau)
Table pour la gestion des tags.
```sql
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    UNIQUE(name, workspace_id)
);
```

### 5. Task Tags (Nouveau)
Table de liaison entre les tâches et les tags.
```sql
CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    PRIMARY KEY (task_id, tag_id)
);
```

## Indexes

### Tasks
- `tasks_list_id_idx`: Optimise les requêtes par liste
- `tasks_assigned_to_idx`: Optimise les requêtes par assignation
- `tasks_created_by_idx`: Optimise les requêtes par créateur

### Task Lists
- `task_lists_workspace_id_idx`: Optimise les requêtes par workspace

### Tags
- `tags_workspace_id_idx`: Optimise les requêtes de tags par workspace

## Politiques de Sécurité (RLS)

Toutes les tables sont protégées par Row Level Security (RLS) avec les politiques suivantes :

### Tasks
- Lecture : Membres du workspace uniquement
- Création : Membres du workspace uniquement
- Mise à jour : Membres du workspace uniquement
- Suppression : Propriétaires, admins et créateur de la tâche

### Task Lists
- Lecture : Membres du workspace uniquement
- Création : Membres du workspace uniquement
- Mise à jour : Membres du workspace uniquement
- Suppression : Propriétaires et admins uniquement

### Tags
- Lecture : Membres du workspace uniquement
- Création : Membres du workspace uniquement
- Mise à jour : Membres du workspace uniquement
- Suppression : Propriétaires et admins uniquement

## Triggers

- `set_tasks_updated_at`: Met à jour le timestamp `updated_at` des tâches
- `set_task_lists_updated_at`: Met à jour le timestamp `updated_at` des listes
- `set_tags_updated_at`: Met à jour le timestamp `updated_at` des tags 