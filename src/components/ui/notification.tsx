import React from 'react'
import { Bell, X } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'

interface NotificationProps {
  id: string
  type: 'mention' | 'assignment' | 'due_soon' | 'comment'
  content: string
  read: boolean
  created_at: string
  onClose: (id: string) => void
  onRead: (id: string) => void
}

const notificationIcons = {
  mention: '👋',
  assignment: '📋',
  due_soon: '⏰',
  comment: '💬'
}

export function Notification({ 
  id, 
  type, 
  content, 
  read, 
  created_at, 
  onClose, 
  onRead 
}: NotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        relative p-4 mb-2 rounded-lg shadow-lg
        ${read ? 'bg-background' : 'bg-primary/5'}
        border border-border
      `}
      onClick={() => !read && onRead(id)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {notificationIcons[type]}
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground">
            {content}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(created_at), 'PPp', { locale: fr })}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClose(id)
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {!read && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
      )}
    </motion.div>
  )
}

interface NotificationListProps {
  notifications: Array<Omit<NotificationProps, 'onClose' | 'onRead'>>
  onClose: (id: string) => void
  onRead: (id: string) => void
}

export function NotificationList({ notifications, onClose, onRead }: NotificationListProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={onClose}
            onRead={onRead}
          />
        ))}
      </AnimatePresence>
    </div>
  )
} 