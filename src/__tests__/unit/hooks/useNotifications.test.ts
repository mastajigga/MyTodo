import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useNotifications } from '../useNotifications'
import { notificationService } from '@/services/notificationService'
import { mockNotification } from '@/test/mocks/supabase'
import { Notification } from '@/types/notification'

vi.mock('@/services/notificationService')

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch notifications on mount', async () => {
    const mockNotifications: Notification[] = [{ ...mockNotification, type: 'mention' }]
    vi.mocked(notificationService.getNotifications).mockResolvedValueOnce(mockNotifications)
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    expect(notificationService.getNotifications).toHaveBeenCalledWith('user-1')
    expect(notificationService.subscribeToNotifications).toHaveBeenCalledWith('user-1', expect.any(Function))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.notifications).toEqual(mockNotifications)
  })

  it('should calculate unread count correctly', async () => {
    const mockNotifications: Notification[] = [
      { ...mockNotification, type: 'mention', read: false },
      { ...mockNotification, id: '2', type: 'mention', read: false },
      { ...mockNotification, id: '3', type: 'mention', read: true }
    ]
    vi.mocked(notificationService.getNotifications).mockResolvedValueOnce(mockNotifications)
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.unreadCount).toBe(2)
  })

  it('should create notification successfully', async () => {
    const newNotification: Notification = {
      ...mockNotification,
      type: 'mention',
      content: 'New Notification'
    }
    vi.mocked(notificationService.createNotification).mockResolvedValueOnce(newNotification)
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    await act(async () => {
      await result.current.createNotification.mutate({
        user_id: 'user-1',
        type: 'mention',
        content: 'New Notification'
      })
    })

    expect(notificationService.createNotification).toHaveBeenCalledWith({
      user_id: 'user-1',
      type: 'mention',
      content: 'New Notification'
    })
  })

  it('should update notification successfully', async () => {
    const updatedNotification: Notification = { ...mockNotification, type: 'mention', read: true }
    vi.mocked(notificationService.updateNotification).mockResolvedValueOnce(updatedNotification)
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    await act(async () => {
      await result.current.updateNotification.mutate({
        id: '1',
        data: { read: true }
      })
    })

    expect(notificationService.updateNotification).toHaveBeenCalledWith('1', { read: true })
  })

  it('should delete notification successfully', async () => {
    vi.mocked(notificationService.deleteNotification).mockResolvedValueOnce()
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    await act(async () => {
      await result.current.deleteNotification.mutate('1')
    })

    expect(notificationService.deleteNotification).toHaveBeenCalledWith('1')
  })

  it('should mark all notifications as read successfully', async () => {
    vi.mocked(notificationService.markAllAsRead).mockResolvedValueOnce()
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe: vi.fn()
    })

    const { result } = renderHook(() => useNotifications('user-1'))

    await act(async () => {
      await result.current.markAllAsRead.mutate()
    })

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith('user-1')
  })

  it('should unsubscribe on unmount', () => {
    const unsubscribe = vi.fn()
    vi.mocked(notificationService.subscribeToNotifications).mockReturnValueOnce({
      unsubscribe
    })

    const { unmount } = renderHook(() => useNotifications('user-1'))
    unmount()

    expect(unsubscribe).toHaveBeenCalled()
  })
}) 