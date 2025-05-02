export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateNotificationData = Omit<Notification, 'id' | 'created_at' | 'updated_at'>;
export type UpdateNotificationData = Partial<CreateNotificationData>; 