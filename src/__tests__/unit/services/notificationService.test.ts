import { describe, it, expect, beforeEach, vi } from 'vitest'
import { notificationService } from '../notificationService'
import { mockSupabaseClient, mockNotification, resetSupabaseMocks } from '@/test/mocks/supabase'

describe('notificationService', () => {
  beforeEach(() => {
    resetSupabaseMocks()
  })

  describe('getNotifications', () => {
    it('should fetch notifications successfully', async () => {
      const mockNotifications = [mockNotification]
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockNotifications, error: null })

      const result = await notificationService.getNotifications('user-1')
      expect(result).toEqual(mockNotifications)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notifications')
    })

    it('should throw error when fetch fails', async () => {
      const mockError = new Error('Failed to fetch')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(notificationService.getNotifications('user-1')).rejects.toThrow()
    })
  })

  describe('createNotification', () => {
    it('should create notification successfully', async () => {
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockNotification, error: null })

      const result = await notificationService.createNotification({
        user_id: 'user-1',
        type: 'mention',
        content: 'Test Message'
      })

      expect(result).toEqual(mockNotification)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notifications')
    })

    it('should throw error when creation fails', async () => {
      const mockError = new Error('Failed to create')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(notificationService.createNotification({
        user_id: 'user-1',
        type: 'mention',
        content: 'Test Message'
      })).rejects.toThrow()
    })
  })

  describe('updateNotification', () => {
    it('should update notification successfully', async () => {
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: mockNotification, error: null })

      const result = await notificationService.updateNotification('1', { read: true })
      expect(result).toEqual(mockNotification)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notifications')
    })

    it('should throw error when update fails', async () => {
      const mockError = new Error('Failed to update')
      mockSupabaseClient.from().single.mockResolvedValueOnce({ data: null, error: mockError })

      await expect(notificationService.updateNotification('1', { read: true })).rejects.toThrow()
    })
  })

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      mockSupabaseClient.from().mockResolvedValueOnce({ error: null })

      await notificationService.deleteNotification('1')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notifications')
    })

    it('should throw error when deletion fails', async () => {
      const mockError = new Error('Failed to delete')
      mockSupabaseClient.from().mockResolvedValueOnce({ error: mockError })

      await expect(notificationService.deleteNotification('1')).rejects.toThrow()
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      mockSupabaseClient.from().mockResolvedValueOnce({ error: null })

      await notificationService.markAllAsRead('user-1')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('notifications')
    })

    it('should throw error when marking all as read fails', async () => {
      const mockError = new Error('Failed to mark as read')
      mockSupabaseClient.from().mockResolvedValueOnce({ error: mockError })

      await expect(notificationService.markAllAsRead('user-1')).rejects.toThrow()
    })
  })

  describe('subscribeToNotifications', () => {
    it('should subscribe to notification changes successfully', () => {
      const callback = vi.fn()
      const subscription = notificationService.subscribeToNotifications('user-1', callback)

      expect(mockSupabaseClient.channel).toHaveBeenCalledWith('notifications:user-1')
      expect(subscription.unsubscribe).toBeDefined()
    })
  })
}) 