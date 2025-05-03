import type { SupabaseClient } from '@supabase/supabase-js'
import type { SupabasePayload, SupabaseSubscription } from '@/lib/supabase/client'
import { Notification, CreateNotificationData, UpdateNotificationData } from '@/@types/notification'

export const notificationService = {
  async getNotifications(supabase: SupabaseClient, userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async createNotification(supabase: SupabaseClient, notificationData: CreateNotificationData): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateNotification(supabase: SupabaseClient, id: string, notificationData: UpdateNotificationData): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .update(notificationData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteNotification(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async markAllAsRead(supabase: SupabaseClient, userId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  },

  subscribeToNotifications(
    supabase: SupabaseClient,
    userId: string,
    callback: (notification: Notification) => void
  ): SupabaseSubscription | undefined {
    if (!supabase || typeof (supabase as any).from !== 'function') {
      console.error('[subscribeToNotifications] supabase est undefined ou mal initialisé');
      return;
    }
    return (supabase as any)
      .from('notifications')
      .on('INSERT', (payload: any) => {
        if (payload.new && payload.new.user_id === userId) {
          callback(payload.new as Notification)
        }
      })
      .on('UPDATE', (payload: any) => {
        if (payload.new && payload.new.user_id === userId) {
          callback(payload.new as Notification)
        }
      })
      .on('DELETE', (payload: any) => {
        if (payload.old && payload.old.user_id === userId) {
          callback(payload.old as Notification)
        }
      })
      .subscribe()
  }
} 
//comment