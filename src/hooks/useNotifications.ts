import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService } from '@/services/notificationService'
import { Notification, CreateNotificationData, UpdateNotificationData } from '@/types/notification'

export function useNotifications(userId: string) {
  const queryClient = useQueryClient()
  const [realtimeEnabled, setRealtimeEnabled] = useState(true)

  const {
    data: notifications = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getNotifications(userId)
  })

  const createNotification = useMutation({
    mutationFn: (data: CreateNotificationData) =>
      notificationService.createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    }
  })

  const updateNotification = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationData }) =>
      notificationService.updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    }
  })

  const deleteNotification = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    }
  })

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    }
  })

  useEffect(() => {
    if (!realtimeEnabled) return

    const subscription = notificationService.subscribeToNotifications(userId, () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, queryClient, realtimeEnabled])

  const unreadCount = notifications.filter((n: Notification) => !n.read).length

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    createNotification,
    updateNotification,
    deleteNotification,
    markAllAsRead,
    realtimeEnabled,
    setRealtimeEnabled
  }
} 