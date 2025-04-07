import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProjects } from '../useProjects'
import { projectService } from '@/services/projectService'
import { mockProject } from '@/test/mocks/supabase'

vi.mock('@/services/projectService')

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch projects on mount', async () => {
    const mockProjects = [mockProject]
    vi.mocked(projectService.getProjects).mockResolvedValueOnce(mockProjects)
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useProjects('workspace-1'))

    expect(projectService.getProjects).toHaveBeenCalledWith('workspace-1')
    expect(projectService.subscribeToProjects).toHaveBeenCalledWith('workspace-1', expect.any(Function))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.projects).toEqual(mockProjects)
  })

  it('should create project successfully', async () => {
    const newProject = { ...mockProject, name: 'New Project' }
    vi.mocked(projectService.createProject).mockResolvedValueOnce(newProject)
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useProjects('workspace-1'))

    await act(async () => {
      await result.current.createProject.mutate({
        workspace_id: 'workspace-1',
        name: 'New Project'
      })
    })

    expect(projectService.createProject).toHaveBeenCalledWith({
      workspace_id: 'workspace-1',
      name: 'New Project'
    })
  })

  it('should update project successfully', async () => {
    const updatedProject = { ...mockProject, name: 'Updated Project' }
    vi.mocked(projectService.updateProject).mockResolvedValueOnce(updatedProject)
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useProjects('workspace-1'))

    await act(async () => {
      await result.current.updateProject.mutate({ id: '1', data: { name: 'Updated Project' } })
    })

    expect(projectService.updateProject).toHaveBeenCalledWith('1', {
      name: 'Updated Project'
    })
  })

  it('should delete project successfully', async () => {
    vi.mocked(projectService.deleteProject).mockResolvedValueOnce()
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useProjects('workspace-1'))

    await act(async () => {
      await result.current.deleteProject.mutate('1')
    })

    expect(projectService.deleteProject).toHaveBeenCalledWith('1')
  })

  it('should reorder projects successfully', async () => {
    const projects = [mockProject]
    vi.mocked(projectService.reorderProjects).mockResolvedValueOnce()
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useProjects('workspace-1'))

    await act(async () => {
      await result.current.reorderProjects.mutate(projects)
    })

    expect(projectService.reorderProjects).toHaveBeenCalledWith(projects)
  })

  it('should unsubscribe on unmount', () => {
    const unsubscribe = vi.fn()
    vi.mocked(projectService.subscribeToProjects).mockReturnValueOnce({
      unsubscribe
    })

    const { unmount } = renderHook(() => useProjects('workspace-1'))
    unmount()

    expect(unsubscribe).toHaveBeenCalled()
  })
}) 