import { WorkspaceType } from '@/types/workspace';

describe('WorkspaceType', () => {
  it('devrait accepter les valeurs valides', () => {
    const validTypes: WorkspaceType[] = ['private', 'professional', 'family'];
    validTypes.forEach(type => {
      // TypeScript vérifiera que chaque type est valide
      const workspace = {
        id: '1',
        name: 'Test',
        type: type,
        created_at: new Date(),
      };
      expect(workspace.type).toBe(type);
    });
  });

  it('devrait rejeter les valeurs invalides à la compilation', () => {
    // @ts-expect-error - Type '"invalid"' is not assignable to type 'WorkspaceType'
    const invalidType: WorkspaceType = 'invalid';
    
    // @ts-expect-error - Type 'number' is not assignable to type 'WorkspaceType'
    const numberType: WorkspaceType = 123;
    
    // @ts-expect-error - Type 'boolean' is not assignable to type 'WorkspaceType'
    const booleanType: WorkspaceType = true;
  });
}); 