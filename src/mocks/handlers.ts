import { http, HttpResponse } from 'msw'
import type { PathParams } from 'msw'
import { Task, TaskPriority, TaskStatus } from '@/types/task'

const user = {
  id: '1',
  email: 'john@example.com',
  full_name: 'John Doe',
  avatar_url: 'https://avatars.githubusercontent.com/u/1234567'
}

const projects = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Description of project 1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
]

const tasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description of task 1',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    project_id: '1',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    due_date: '2024-02-01T00:00:00.000Z',
    created_by: '1',
    assigned_to: '1',
    position: 1,
    created_by_user: user,
    assigned_to_user: user,
    project: projects[0]
  }
]

export const handlers = [
  http.post('/api/auth/login', () => {
    return Response.json(user)
  }),

  http.get('/api/projects', () => {
    return Response.json(projects)
  }),

  http.get('/api/projects/:id', ({ params }: { params: PathParams<'id'> }) => {
    const project = projects.find(p => p.id === params.id)
    if (!project) {
      return HttpResponse.json(
        { message: 'Projet non trouvé' },
        { status: 404 }
      )
    }
    return HttpResponse.json(project)
  }),

  http.get('/api/projects/:projectId/tasks', ({ params }: { params: PathParams<'projectId'> }) => {
    const projectTasks = tasks.filter(task => task.project_id === params.projectId)
    return Response.json(projectTasks)
  }),

  http.get('/api/tasks', () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        description: 'Description de la tâche 1',
        status: 'todo' as TaskStatus,
        priority: 'medium' as TaskPriority,
        project_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        due_date: null,
        created_by: '1',
        assigned_to: '1',
        position: 0
      },
      {
        id: '2',
        title: 'Task 2',
        description: 'Description de la tâche 2',
        status: 'done' as TaskStatus,
        priority: 'high' as TaskPriority,
        project_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        due_date: null,
        created_by: '1',
        assigned_to: '1',
        position: 1
      }
    ]
    return HttpResponse.json(tasks)
  }),

  http.get('/api/tasks/:taskId', ({ params }: { params: PathParams<'taskId'> }) => {
    const { taskId } = params
    const taskIdString = Array.isArray(taskId) ? taskId[0] : taskId
    if (!taskIdString) {
      return HttpResponse.json(
        { message: 'ID de tâche invalide' },
        { status: 400 }
      )
    }
    const task: Task = {
      id: taskIdString,
      title: `Task ${taskIdString}`,
      description: `Description ${taskIdString}`,
      status: 'todo' as TaskStatus,
      priority: 'low' as TaskPriority,
      project_id: '1',
      due_date: new Date().toISOString(),
      created_by: '1',
      assigned_to: '1',
      position: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    return HttpResponse.json(task)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const taskData = await request.json() as Partial<Task>
    if (!taskData.title?.trim()) {
      return HttpResponse.json(
        { message: 'Le titre de la tâche est requis' },
        { status: 400 }
      )
    }

    const newTask: Task = {
      id: Math.random().toString(),
      title: taskData.title,
      description: taskData.description || '',
      status: (taskData.status || 'todo') as TaskStatus,
      priority: (taskData.priority || 'medium') as TaskPriority,
      project_id: taskData.project_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: taskData.due_date || null,
      created_by: taskData.created_by || '1',
      assigned_to: taskData.assigned_to || '1',
      position: taskData.position || 0
    }
    return HttpResponse.json({
      message: 'Tâche créée avec succès',
      data: newTask
    }, { status: 201 })
  }),

  http.put('/api/tasks/:taskId', async ({ params, request }: { params: PathParams<'taskId'>, request: Request }) => {
    const { taskId } = params
    const taskIdString = Array.isArray(taskId) ? taskId[0] : taskId
    if (!taskIdString) {
      return HttpResponse.json(
        { message: 'ID de tâche invalide' },
        { status: 400 }
      )
    }

    const updates = await request.json() as Partial<Task>
    if (updates.title !== undefined && !updates.title.trim()) {
      return HttpResponse.json(
        { message: 'Le titre de la tâche ne peut pas être vide' },
        { status: 400 }
      )
    }

    const updatedTask: Task = {
      id: taskIdString,
      title: updates.title || '',
      description: updates.description || '',
      status: (updates.status || 'todo') as TaskStatus,
      priority: (updates.priority || 'medium') as TaskPriority,
      project_id: updates.project_id || null,
      created_at: updates.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: updates.due_date || null,
      created_by: updates.created_by || '1',
      assigned_to: updates.assigned_to || '1',
      position: updates.position || 0
    }
    return HttpResponse.json({
      message: 'Tâche mise à jour avec succès',
      data: updatedTask
    })
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    return HttpResponse.json({
      message: 'Tâche supprimée avec succès',
      data: { id: params.id }
    }, { status: 200 })
  }),

  http.patch('/api/tasks/reorder', async ({ request }) => {
    const { tasks: taskUpdates } = await request.json() as { tasks: Array<Pick<Task, 'id' | 'position' | 'status'>> }
    
    // Valider et transformer les mises à jour
    const validatedUpdates = taskUpdates.map(update => ({
      id: update.id,
      position: update.position,
      status: update.status as TaskStatus
    }))

    return Response.json({ 
      tasks: validatedUpdates,
      message: 'Tâches réorganisées avec succès'
    })
  })
] 