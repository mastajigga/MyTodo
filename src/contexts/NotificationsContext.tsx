import React, { createContext, useContext, useEffect, useState } from 'react'
import { notificationService } from '@/services/notificationService'
import { Notification } from '@/@types/notification'
import { useSupabase } from '@/lib/supabase/supabase-provider'

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSupabase()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return
    let active = true
    // Récupération initiale
    notificationService.getNotifications(user.id).then(data => {
      if (active) setNotifications(data)
    })
    // Souscription realtime
    const subscription = notificationService.subscribeToNotifications(user.id, (notif) => {
      setNotifications(prev => [notif, ...prev])
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length)
  }, [notifications])

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotificationsContext = () => {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider')
  return ctx
} 