import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const createTables = async () => {
  try {
    console.log('Tentative de création d\'une entrée de test dans le workspace "bnp - api sas"...');
    
    // Création des tables
    const { error } = await supabase.from('entries').insert({
      title: 'Test Entry',
      description: 'Test Description',
      workspace_id: 'b5301a85-1fd2-418e-8755-2b4acb806796', // Workspace ID fourni
      user_id: '00000000-0000-0000-0000-000000000000',
      status: 'todo',
      priority: 'medium'
    });

    if (error) {
      if (error.code === '42P01') {
        console.log('La table entries n\'existe pas, tentative de création...');
        
        const { error: createError } = await supabase
          .query(`
            create table if not exists public.entries (
              id uuid default gen_random_uuid() primary key,
              title varchar not null,
              description text,
              workspace_id uuid not null,
              user_id uuid not null,
              status varchar not null check (status in ('todo', 'in_progress', 'done')),
              priority varchar not null check (priority in ('low', 'medium', 'high')),
              due_date timestamp with time zone,
              created_at timestamp with time zone default current_timestamp,
              updated_at timestamp with time zone default current_timestamp
            );

            -- Index pour entries
            create index if not exists idx_entries_workspace on public.entries(workspace_id);
            create index if not exists idx_entries_user on public.entries(user_id);
            create index if not exists idx_entries_status on public.entries(status);

            -- Politique de sécurité pour permettre l'accès en lecture
            create policy "Enable read access for all users" on public.entries
              for select
              using (true);

            -- Activer RLS sur la table
            alter table public.entries enable row level security;
          `);

        if (createError) {
          console.error('Erreur lors de la création de la table:', createError);
          throw createError;
        } else {
          console.log('Table entries créée avec succès, nouvelle tentative d\'insertion...');
          return createTables(); // Réessayer l'insertion après la création de la table
        }
      } else {
        console.error('Erreur lors de l\'insertion du test:', error);
        throw error;
      }
    }

    console.log('Entrée de test créée avec succès dans le workspace "bnp - api sas"');

    // Vérifier que l'entrée est accessible
    const { data: checkData, error: checkError } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', 'b5301a85-1fd2-418e-8755-2b4acb806796')
      .single();

    if (checkError) {
      console.error('Erreur lors de la vérification de l\'entrée:', checkError);
    } else {
      console.log('Entrée vérifiée avec succès:', checkData);
    }
  } catch (error) {
    console.error('Échec:', error);
    process.exit(1);
  }
};

createTables(); 