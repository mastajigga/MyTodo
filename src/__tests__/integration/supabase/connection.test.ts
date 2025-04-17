import { describe, it, expect } from 'vitest';
import { supabase } from '../setup';

describe('Supabase Connection', () => {
  it('devrait se connecter à Supabase avec succès', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*');
    
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

  it('devrait avoir accès à la base de données', async () => {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id, name');
    
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('devrait trouver l\'entrée de test dans le workspace BNP', async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('workspace_id', 'b5301a85-1fd2-418e-8755-2b4acb806796')
      .eq('title', 'Test Entry');
    
    console.log('Entrées trouvées:', data);
    console.log('Erreur éventuelle:', error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data?.length).toBeGreaterThan(0);

    // Vérifions la première entrée trouvée
    const entry = data?.[0];
    expect(entry).toBeDefined();
    expect(entry.title).toBe('Test Entry');
    expect(entry.description).toBe('Test Description');
    expect(entry.workspace_id).toBe('b5301a85-1fd2-418e-8755-2b4acb806796');
    expect(entry.status).toBe('todo');
    expect(entry.priority).toBe('medium');
  });
}); 