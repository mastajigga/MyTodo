import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RealtimeChannel } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export type SupabasePayload = {
  new: any;
  old: any;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export type SupabaseSubscription = RealtimeChannel;

export const supabase = createClientComponentClient(); 