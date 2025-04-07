const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const createTables = async () => {
  try {
    // 1. Création de la table profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('_tables')
      .select('*')
      .eq('name', 'profiles')
      .single();

    if (!profilesData) {
      const { error } = await supabase
        .from('profiles')
        .insert(null)
        .select()
        .then(async () => {
          return await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        });
      if (error && !error.message.includes('does not exist')) throw error;
      console.log('✅ Table profiles créée');
    } else {
      console.log('✅ Table profiles existe déjà');
    }

    // 2. Création de la table workspaces
    const { data: workspacesData, error: workspacesError } = await supabase
      .from('_tables')
      .select('*')
      .eq('name', 'workspaces')
      .single();

    if (!workspacesData) {
      const { error } = await supabase
        .from('workspaces')
        .insert(null)
        .select()
        .then(async () => {
          return await supabase.from('workspaces').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        });
      if (error && !error.message.includes('does not exist')) throw error;
      console.log('✅ Table workspaces créée');
    } else {
      console.log('✅ Table workspaces existe déjà');
    }

    // 3. Création de la table workspace_members
    const { data: membersData, error: membersError } = await supabase
      .from('_tables')
      .select('*')
      .eq('name', 'workspace_members')
      .single();

    if (!membersData) {
      const { error } = await supabase
        .from('workspace_members')
        .insert(null)
        .select()
        .then(async () => {
          return await supabase.from('workspace_members').delete().neq('workspace_id', '00000000-0000-0000-0000-000000000000');
        });
      if (error && !error.message.includes('does not exist')) throw error;
      console.log('✅ Table workspace_members créée');
    } else {
      console.log('✅ Table workspace_members existe déjà');
    }

    // 4. Création de la table projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('_tables')
      .select('*')
      .eq('name', 'projects')
      .single();

    if (!projectsData) {
      const { error } = await supabase
        .from('projects')
        .insert(null)
        .select()
        .then(async () => {
          return await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        });
      if (error && !error.message.includes('does not exist')) throw error;
      console.log('✅ Table projects créée');
    } else {
      console.log('✅ Table projects existe déjà');
    }

    // 5. Création de la table tasks
    const { data: tasksData, error: tasksError } = await supabase
      .from('_tables')
      .select('*')
      .eq('name', 'tasks')
      .single();

    if (!tasksData) {
      const { error } = await supabase
        .from('tasks')
        .insert(null)
        .select()
        .then(async () => {
          return await supabase.from('tasks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        });
      if (error && !error.message.includes('does not exist')) throw error;
      console.log('✅ Table tasks créée');
    } else {
      console.log('✅ Table tasks existe déjà');
    }

    console.log('✨ Toutes les tables de base ont été créées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
    // Si l'erreur indique qu'une table n'existe pas, affichons le SQL nécessaire
    if (error.message.includes('does not exist')) {
      console.log('\n📝 Voici le SQL à exécuter dans l\'interface Supabase :');
      console.log(`
-- Utilisateurs (extension de la table auth.users de Supabase)
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

-- Projets dans les espaces de travail
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
      `);
    }
  }
};

createTables(); 