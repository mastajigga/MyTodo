import { beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_SUPABASE_URL: string;
      VITE_SUPABASE_ANON_KEY: string;
    }
  }
}

beforeAll(() => {
  // Vérification des variables d'environnement nécessaires
  if (!process.env.VITE_SUPABASE_URL) {
    throw new Error('VITE_SUPABASE_URL is not defined');
  }
  if (!process.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('VITE_SUPABASE_ANON_KEY is not defined');
  }

  // Création du client Supabase pour les tests
  const supabase = createClient<Database>(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
  );

  // Vérification de la connexion
  const checkConnection = async () => {
    const { error } = await supabase.from('tasks').select('id').limit(1);
    if (error) {
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }
  };

  return checkConnection();
}); 