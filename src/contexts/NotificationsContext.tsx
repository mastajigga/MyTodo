import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
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
  const subscriptionRef = useRef<any>(null)

  useEffect(() => {
    console.debug('[NotificationsProvider] user:', user)
    if (!user) {
      // Cleanup si user devient null
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
      setNotifications([])
      return
    }
    let active = true
    notificationService.getNotifications(user.id).then(data => {
      if (active) setNotifications(data)
    })
    // Cleanup ancienne souscription si elle existe
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }
    // Nouvelle souscription
    subscriptionRef.current = notificationService.subscribeToNotifications(user.id, (notif) => {
      setNotifications(prev => [notif, ...prev])
    })
    return () => {
      active = false
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
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