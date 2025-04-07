require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const createTables = async () => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Profiles (extension de la table auth.users)
        create table if not exists public.profiles (
          id uuid references auth.users on delete cascade not null primary key,
          full_name text,
          avatar_url text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Espaces de travail
        create table if not exists public.workspaces (
          id uuid default uuid_generate_v4() primary key,
          name text not null,
          description text,
          type text check (type in ('family', 'professional', 'private')) not null,
          created_by uuid references public.profiles(id) not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Membres des espaces de travail
        create table if not exists public.workspace_members (
          workspace_id uuid references public.workspaces(id) on delete cascade,
          user_id uuid references public.profiles(id) on delete cascade,
          role text check (role in ('owner', 'admin', 'member')) not null,
          joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
          primary key (workspace_id, user_id)
        );

        -- Projets
        create table if not exists public.projects (
          id uuid default uuid_generate_v4() primary key,
          workspace_id uuid references public.workspaces(id) on delete cascade not null,
          name text not null,
          description text,
          color text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Tâches
        create table if not exists public.tasks (
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
        create table if not exists public.subtasks (
          id uuid default uuid_generate_v4() primary key,
          task_id uuid references public.tasks(id) on delete cascade not null,
          title text not null,
          completed boolean default false,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Commentaires
        create table if not exists public.comments (
          id uuid default uuid_generate_v4() primary key,
          task_id uuid references public.tasks(id) on delete cascade not null,
          user_id uuid references public.profiles(id) not null,
          content text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Pièces jointes
        create table if not exists public.attachments (
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
        create table if not exists public.tags (
          id uuid default uuid_generate_v4() primary key,
          workspace_id uuid references public.workspaces(id) on delete cascade not null,
          name text not null,
          color text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Association Tags-Tâches
        create table if not exists public.task_tags (
          task_id uuid references public.tasks(id) on delete cascade,
          tag_id uuid references public.tags(id) on delete cascade,
          primary key (task_id, tag_id)
        );

        -- Notifications
        create table if not exists public.notifications (
          id uuid default uuid_generate_v4() primary key,
          user_id uuid references public.profiles(id) not null,
          type text check (type in ('mention', 'assignment', 'due_soon', 'comment')) not null,
          content text not null,
          read boolean default false,
          task_id uuid references public.tasks(id) on delete cascade,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Dépendances entre tâches
        create table if not exists public.task_dependencies (
          id uuid default uuid_generate_v4() primary key,
          predecessor_id uuid references public.tasks(id) on delete cascade not null,
          successor_id uuid references public.tasks(id) on delete cascade not null,
          offset_days integer default 0,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          constraint different_tasks check (predecessor_id != successor_id)
        );
      `
    });

    if (error) {
      console.error('Error creating tables:', error);
      throw error;
    }

    console.log('Tables created successfully:', data);
  } catch (error) {
    console.error('Failed:', error);
  }
};

createTables(); 