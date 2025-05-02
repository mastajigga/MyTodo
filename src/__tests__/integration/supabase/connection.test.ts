import { describe, it, expect } from 'vitest';
import { supabase } from '../setup';

describe('Supabase Connection', () => {
  it('devrait se connecter à Supabase avec succès', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('devrait pouvoir effectuer une requête authentifiée', async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    expect(error).toBeNull();
    if (!user) {
      console.log('⚠️ Pas de session active - certains tests peuvent échouer');
    }
  });

  it('devrait avoir accès à la table workspaces', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('devrait avoir accès à la table entries', async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('id, title, description, workspace_id, status, priority')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('devrait avoir accès à la table tasks', async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, workspace_id, status, priority, due_date')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('devrait avoir accès à la table profiles', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .limit(1);
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
}); 