import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '../database.types';
import { Database as SupabaseDatabase } from '@/types/supabase';

let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClientComponentClient<Database>();
  }
  return supabaseInstance;
};

// Pour la compatibilité avec le code existant
export const supabase = getSupabaseClient();

export type SupabasePayload = {
  new: any;
  old: any;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export type SupabaseSubscription = RealtimeChannel;

export const createClient = () => {
  return createClientComponentClient<SupabaseDatabase>();
};

const supabaseClient = createClient();

export default supabaseClient; 