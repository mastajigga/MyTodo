import { rest } from 'msw';
import { Project } from '@/types/project';
import { PathParams } from 'msw';

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface ProjectParams extends PathParams {
  id: string;
}

interface RequestParams {
  id: string;
}

interface RequestWithBody extends RequestParams {
  request: Request;
}

interface ProjectRequestBody {
  name?: string;
  description?: string;
  workspace_id?: string;
  color?: string;
}

interface ProjectInput {
  name: string;
  description: string;
  completed: boolean;
}

export const handlers = [
  // Auth handlers
  rest.post('*/auth/v1/token', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mock-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      })
    );
  }),

  // Projects handlers
  rest.get('*/rest/v1/projects', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 'project-123',
          name: 'Test Project',
          description: 'Test Project Description',
          workspace_id: 'workspace-123',
          color: '#FF0000',
          created_at: '2024-04-08T00:00:00Z',
          updated_at: '2024-04-08T00:00:00Z',
        },
      ])
    );
  }),

  // Tasks handlers
  rest.get('*/rest/v1/tasks', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Task 1 Description',
          status: 'todo',
          priority: 'high',
          project_id: 'project-123',
          created_by: 'user-123',
          created_at: '2024-04-08T00:00:00Z',
          updated_at: '2024-04-08T00:00:00Z',
        },
      ])
    );
  }),

  // Workspaces handlers
  rest.get('*/rest/v1/workspaces', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 'workspace-123',
          name: 'Test Workspace',
          description: 'Test Workspace Description',
          type: 'professional',
          created_by: 'user-123',
          created_at: '2024-04-08T00:00:00Z',
          updated_at: '2024-04-08T00:00:00Z',
        },
      ])
    );
  }),

  // GET /projects
  rest.get(`${baseUrl}/rest/v1/projects`, (req, res, ctx) => {
    const mockProjects = [
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

    return res(
      ctx.status(200),
      ctx.json(mockProjects)
    );
  }),

  // GET /projects/:id
  rest.get('/projects/:id', (req, res, ctx) => {
    const { id } = req.params;
    if (!id) {
      return res(ctx.status(400));
    }

    const project: Project = {
      id: id as string,
      workspace_id: 'default-workspace',
      name: 'Mock Project',
      description: 'This is a mock project',
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return res(ctx.status(200), ctx.json(project));
  }),

  // POST /projects
  rest.post('/projects', async (req, res, ctx) => {
    const data = await req.json() as ProjectInput;
    const newProject: Project = {
      id: crypto.randomUUID(),
      workspace_id: 'default-workspace',
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return res(ctx.status(201), ctx.json(newProject));
  }),

  // PATCH /projects/:id
  rest.patch('/projects/:id', async (req, res, ctx) => {
    const { id } = req.params;
    if (!id) {
      return res(ctx.status(400));
    }

    const data = await req.json() as Partial<ProjectInput>;
    const updatedProject: Project = {
      id: id as string,
      workspace_id: 'default-workspace',
      name: 'Updated Project',
      description: 'Updated description',
      completed: false,
      ...data,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    return res(ctx.status(200), ctx.json(updatedProject));
  }),

  // DELETE /projects/:id
  rest.delete('/projects/:id', (req, res, ctx) => {
    const { id } = req.params;
    if (!id) {
      return res(ctx.status(400));
    }
    return res(ctx.status(204));
  })
]; 