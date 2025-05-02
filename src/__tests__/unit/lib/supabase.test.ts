import { describe, it, expect, beforeEach } from 'vitest';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { mockSupabase, resetSupabaseMocks } from '@/test/mocks/supabase';

describe('Supabase Client', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('devrait créer un client Supabase', () => {
    const supabase = createClientComponentClient();
    expect(supabase).toBeDefined();
    expect(supabase).toEqual(mockSupabase);
  });

  it('devrait pouvoir effectuer un appel RPC', async () => {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.rpc('ping');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(supabase.rpc).toHaveBeenCalledWith('ping');
  });
}); 