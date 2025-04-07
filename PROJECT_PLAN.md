# Plan du Projet MyTodo - Application Collaborative de Gestion de Tâches

## 1. Stack Technologique

### Frontend
- Next.js 14 (App Router) - Pour des performances optimales et le SSR
- TailwindCSS - Pour le styling
- Shadcn/ui - Pour des composants modernes et accessibles
- Tanstack Query - Pour la gestion du cache et des requêtes
- Zustand - Pour la gestion d'état locale
- React DnD - Pour le drag and drop des tâches
- Lucide Icons - Pour les icônes modernes

### Backend/Infrastructure
- Supabase - Pour la base de données, l'authentification et les real-time updates
- Edge Functions - Pour la logique métier complexe
- Storage Bucket - Pour les pièces jointes
- Row Level Security (RLS) - Pour la sécurité au niveau des données
- Netlify - Pour l'hébergement et le déploiement continu
  - Déploiement automatique depuis GitHub
  - Gestion des variables d'environnement
  - SSL/TLS automatique
  - CDN global pour des performances optimales
  - Fonctions Netlify pour les API serverless si nécessaire

## 2. Schéma de Base de Données (Supabase)

```sql
-- Utilisateurs (extension de la table auth.users de Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Espaces de travail
create table public.workspaces (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  type text check (type in ('family', 'professional', 'private')) not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Membres des espaces de travail
create table public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text check (role in ('owner', 'admin', 'member')) not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (workspace_id, user_id)
);

-- Projets dans les espaces de travail
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  description text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tâches
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'completed', 'cancelled')) not null,
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) not null,
  due_date timestamp with time zone,
  due_time time,
  created_by uuid references public.profiles(id) not null,
  assigned_to uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sous-tâches
create table public.subtasks (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Commentaires sur les tâches
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pièces jointes
create table public.attachments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  name text not null,
  file_path text not null,
  file_type text not null,
  size integer not null,
  uploaded_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tags
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  name text not null,
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Association Tags-Tâches
create table public.task_tags (
  task_id uuid references public.tasks(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (task_id, tag_id)
);

-- Notifications
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('mention', 'assignment', 'due_soon', 'comment')) not null,
  content text not null,
  read boolean default false,
  task_id uuid references public.tasks(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dépendances entre tâches
create table public.task_dependencies (
  id uuid default uuid_generate_v4() primary key,
  predecessor_id uuid references public.tasks(id) on delete cascade not null,
  successor_id uuid references public.tasks(id) on delete cascade not null,
  offset_days integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint different_tasks check (predecessor_id != successor_id)
);
```

## 3. Structure du Projet
```
mytodo/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── workspace/
│   │   │   ├── projects/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── workspace/
│   │   ├── projects/
│   │   └── tasks/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── utils/
│   │   └── constants/
│   ├── hooks/
│   └── types/
├── public/
└── config/
```

## 4. Fonctionnalités Clés

### Authentification et Autorisation
- Connexion avec email/password ou OAuth (Google, GitHub)
- Gestion des rôles et permissions par workspace
- Invitations par email

### Gestion des Workspaces
- Création de workspaces (famille, professionnel, privé)
- Gestion des membres et leurs rôles
- Personnalisation (couleurs, icônes)

### Gestion des Tâches
- Vue Kanban et Liste
- Drag & Drop pour réorganisation
- Minuteur intégré
- Sous-tâches
- Tags et filtres
- Pièces jointes
- Commentaires en temps réel
- Décalage automatique des tâches dépendantes lors de la modification d'une échéance

### Collaboration
- Mentions @user
- Notifications en temps réel
- Partage de fichiers
- Historique des modifications
- Chat intégré par projet

### Sécurité
- Row Level Security (RLS) dans Supabase
- Validation des données côté serveur
- Rate limiting
- Encryption des données sensibles
- Audit logs

## 5. Optimisations Techniques
- Mise en cache optimisée avec Tanstack Query
- Real-time subscriptions avec Supabase
- Optimistic updates pour une UX fluide
- Progressive Web App (PWA)
- Infinite scrolling pour les listes longues
- Debouncing pour les recherches
- Lazy loading des composants

## 6. Monitoring et Analytics
- Supabase Analytics
- Error tracking
- Performance monitoring
- User behavior analytics 