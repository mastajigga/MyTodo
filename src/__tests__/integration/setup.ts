import { beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Créer un client Supabase global pour les tests d'intégration avec la clé de service
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_API_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

beforeAll(() => {
  // Vérifier que les variables d'environnement sont définies
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
    throw new Error('Les variables d\'environnement Supabase ne sont pas définies');
  }
}); 