import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Vérifier les variables d'environnement requises
const requiredEnvVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est requise pour les tests`);
  }
}

// Créer le client Supabase global pour les tests
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Mock global de fetch pour les tests
global.fetch = vi.fn();

// Configuration des mocks globaux
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => supabase,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Nettoyage après chaque test
afterEach(() => {
  vi.clearAllMocks();
}); 