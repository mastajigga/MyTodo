import { describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase, resetSupabaseMocks } from '../../test/mocks/supabase';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

describe('Supabase Connection', () => {
  beforeEach(() => {
    resetSupabaseMocks();
  });

  it('devrait créer un client Supabase', () => {
    const supabase = createClientComponentClient();
    expect(supabase).toBeDefined();
    expect(supabase).toEqual(mockSupabase);
  });

  it('devrait effectuer un appel RPC avec succès', async () => {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.rpc('ping');
    
    expect(error).toBeNull();
    expect(data).toEqual({ version: '1.0.0' });
    expect(supabase.rpc).toHaveBeenCalledWith('ping');
  });
}); 