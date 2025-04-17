export type NotificationType = 'mention' | 'assignment' | 'due_soon' | 'comment'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  content: string
  read: boolean
  task_id?: string
  created_at: string
}

export interface CreateNotificationData {
  user_id: string
  type: NotificationType
  content: string
  task_id?: string
}

export interface UpdateNotificationData {
  read?: boolean
} 