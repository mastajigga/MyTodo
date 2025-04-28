import { User } from '@supabase/supabase-js';

const mockOwner: User = {
  id: 'owner-id',
  email: 'owner@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Owner User' },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  phone: undefined,
  confirmed_at: undefined,
  email_confirmed_at: undefined,
  phone_confirmed_at: undefined,
  last_sign_in_at: undefined,
  role: undefined,
  factors: [],
  recovery_sent_at: undefined
};

const mockMember: User = {
  id: 'member-id',
  email: 'member@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Member User' },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  phone: undefined,
  confirmed_at: undefined,
  email_confirmed_at: undefined,
  phone_confirmed_at: undefined,
  last_sign_in_at: undefined,
  role: undefined,
  factors: [],
  recovery_sent_at: undefined
};

const mockGuest: User = {
  id: 'guest-id',
  email: 'guest@example.com',
  app_metadata: { provider: 'email' },
  user_metadata: { name: 'Guest User' },
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  phone: undefined,
  confirmed_at: undefined,
  email_confirmed_at: undefined,
  phone_confirmed_at: undefined,
  last_sign_in_at: undefined,
  role: undefined,
  factors: [],
  recovery_sent_at: undefined
}; 