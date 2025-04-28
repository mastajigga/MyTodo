import { vi } from 'vitest';
import { SupabaseClient, AuthError } from '@supabase/supabase-js';
import { NextRouter } from 'next/router';

// Types pour le chaînage des méthodes
type ChainedMethods = {
  select: () => ChainedMethods & Promise<{ data: any; error: null }>;
  insert: () => ChainedMethods & Promise<{ data: any; error: null }>;
  update: () => ChainedMethods & Promise<{ data: any; error: null }>;
  delete: () => ChainedMethods & Promise<{ data: any; error: null }>;
  eq: () => ChainedMethods & Promise<{ data: any; error: null }>;
  single: () => Promise<{ data: any; error: null }>;
  match: () => ChainedMethods & Promise<{ data: any; error: null }>;
  in: () => ChainedMethods & Promise<{ data: any; error: null }>;
  order: () => ChainedMethods & Promise<{ data: any; error: null }>;
};

// Mock des données
export const mockTask = {
  id: '1',
  title: 'Tâche de test',
  description: 'Description de la tâche de test',
  status: 'todo',
  priority: 'medium',
  project_id: '1',
  workspace_id: '1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockProject = {
  id: '1',
  name: 'Projet de test',
  description: 'Description du projet de test',
  workspace_id: '1',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const mockWorkspace = {
  id: '1',
  name: 'Espace de travail de test',
  description: 'Description de l\'espace de travail de test',
  type: 'private',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock des notifications toast
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  loading: vi.fn(),
  dismiss: vi.fn(),
};

// Mock du router Next.js
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
};

// Mock des données utilisateur
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'authenticated',
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const mockSession = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  user: mockUser,
};

// Mock du client Supabase
export const mockSupabaseClient = {
  // URLs de service
  supabaseUrl: 'http://localhost:54321',
  supabaseKey: 'test-key',
  realtimeUrl: 'http://localhost:54321/realtime',
  authUrl: 'http://localhost:54321/auth',
  storageUrl: 'http://localhost:54321/storage',
  functionsUrl: 'http://localhost:54321/functions',

  // Méthodes d'authentification
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          role: 'authenticated',
          aud: 'authenticated',
          created_at: new Date().toISOString()
        }
      },
      error: null
    }),
    signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      callback('SIGNED_IN', {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        }
      })
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
        error: null
      }
    })
  },

  // Méthodes realtime
  realtime: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    removeAllChannels: vi.fn(),
  },

  // Méthodes de stockage
  storage: {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ data: null, error: null }),
      download: vi.fn().mockResolvedValue({ data: null, error: null }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },

  // Méthodes de base de données avec chaînage
  from: vi.fn().mockImplementation((table: string): ChainedMethods => {
    const methods = {
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      single: vi.fn(),
      match: vi.fn(),
      in: vi.fn(),
      order: vi.fn(),
    };

    // Configuration du chaînage pour chaque méthode
    (Object.keys(methods) as Array<keyof typeof methods>).forEach((method) => {
      methods[method] = vi.fn().mockImplementation((...args) => {
        const chainedPromise = Promise.resolve({ data: null, error: null });
        return Object.assign(chainedPromise, methods);
      });
    });

    return methods as unknown as ChainedMethods;
  }),

  // Méthodes RPC
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),

  // Méthodes de fonctions
  functions: {
    invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
  },
} as unknown as SupabaseClient;

// Mock des hooks personnalisés
export const mockUseWorkspace = {
  workspace: mockWorkspace,
  isLoading: false,
  error: null,
};

export const mockUseProject = {
  project: mockProject,
  isLoading: false,
  error: null,
};

export const mockUseTasks = {
  tasks: [mockTask],
  isLoading: false,
  error: null,
  mutate: vi.fn(),
};

// Création d'une classe AuthError personnalisée pour les tests
export class CustomAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
export { CustomAuthError as AuthError }; 