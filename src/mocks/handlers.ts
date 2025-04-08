import { http, HttpResponse } from 'msw';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project';

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export const handlers = [
  // GET /projects
  http.get(`${baseUrl}/rest/v1/projects`, () => {
    const mockProjects: Project[] = [
      {
        id: '1',
        workspace_id: '1',
        name: 'Projet Test 1',
        description: 'Description du projet test 1',
        color: 'blue',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        workspace_id: '1',
        name: 'Projet Test 2',
        description: 'Description du projet test 2',
        color: 'green',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return HttpResponse.json(mockProjects, { status: 200 });
  }),

  // GET /projects/:id
  http.get(`${baseUrl}/rest/v1/projects/:id`, ({ params }) => {
    const { id } = params;
    const mockProject: Project = {
      id: id as string,
      workspace_id: '1',
      name: 'Projet Test',
      description: 'Description du projet test',
      color: 'blue',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(mockProject, { status: 200 });
  }),

  // POST /projects
  http.post(`${baseUrl}/rest/v1/projects`, async ({ request }) => {
    const newProject = await request.json() as CreateProjectInput;
    const mockProject: Project = {
      id: Math.random().toString(),
      workspace_id: newProject.workspace_id,
      name: newProject.name,
      description: newProject.description,
      color: newProject.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(mockProject, { status: 201 });
  }),

  // PATCH /projects/:id
  http.patch(`${baseUrl}/rest/v1/projects/:id`, async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as UpdateProjectInput;
    const mockProject: Project = {
      id: id as string,
      workspace_id: '1',
      name: updates.name || 'Projet Test',
      description: updates.description,
      color: updates.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(mockProject, { status: 200 });
  }),

  // DELETE /projects/:id
  http.delete(`${baseUrl}/rest/v1/projects/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
]; 