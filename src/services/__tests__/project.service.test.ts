import { ProjectService } from '../project.service';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';

describe('ProjectService', () => {
  const mockProject: Project = {
    id: '1',
    workspace_id: '1',
    name: 'Projet Test',
    description: 'Description du projet test',
    color: 'blue',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('createProject', () => {
    it('devrait créer un nouveau projet', async () => {
      const input: CreateProjectInput = {
        workspace_id: '1',
        name: 'Nouveau Projet',
        description: 'Description du nouveau projet',
        color: 'red',
      };

      const result = await ProjectService.createProject(input);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(input.name);
      expect(result.description).toBe(input.description);
      expect(result.color).toBe(input.color);
    });
  });

  describe('updateProject', () => {
    it('devrait mettre à jour un projet existant', async () => {
      const updates: UpdateProjectInput = {
        name: 'Projet Mis à Jour',
        description: 'Description mise à jour',
        color: 'green',
      };

      const result = await ProjectService.updateProject('1', updates);
      expect(result.id).toBe('1');
      expect(result.name).toBe(updates.name);
      expect(result.description).toBe(updates.description);
      expect(result.color).toBe(updates.color);
    });
  });

  describe('deleteProject', () => {
    it('devrait supprimer un projet', async () => {
      await expect(ProjectService.deleteProject('1')).resolves.not.toThrow();
    });
  });

  describe('getProject', () => {
    it('devrait récupérer un projet par son ID', async () => {
      const result = await ProjectService.getProject('1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('getWorkspaceProjects', () => {
    it('devrait récupérer tous les projets d\'un espace de travail', async () => {
      const result = await ProjectService.getWorkspaceProjects('1');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
    });
  });

  describe('getProjectStats', () => {
    it('devrait récupérer les statistiques d\'un projet', async () => {
      const stats = await ProjectService.getProjectStats('1');
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('completed');
      expect(stats).toHaveProperty('inProgress');
      expect(stats).toHaveProperty('todo');
      expect(stats).toHaveProperty('progress');
      expect(typeof stats.progress).toBe('number');
    });
  });
}); 