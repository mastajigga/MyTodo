import { supabase, type SupabasePayload, type SupabaseSubscription } from '@/lib/supabase/client'
import { Notification, CreateNotificationData, UpdateNotificationData } from '@/types/notification'

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateNotification(id: string, notificationData: UpdateNotificationData): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update(notificationData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteNotification(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  },

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): SupabaseSubscription {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload: SupabasePayload) => {
        callback(payload.new as Notification)
      })
      .subscribe()
  }
} 