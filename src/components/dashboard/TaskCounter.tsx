"use client"

import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface TaskCounterProps {
  title: string
  value: number
  description: string
  type: 'current' | 'upcoming' | 'completed'
}

export function TaskCounter({ title, value, description, type }: TaskCounterProps) {
  const getIcon = () => {
    switch (type) {
      case 'current':
        return <Clock className="h-6 w-6 text-amber-500" />
      case 'upcoming':
        return <AlertCircle className="h-6 w-6 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />
      default:
        return null
    }
  }

  const getGradient = () => {
    switch (type) {
      case 'current':
        return 'from-amber-500/20 to-amber-600/20'
      case 'upcoming':
        return 'from-blue-500/20 to-blue-600/20'
      case 'completed':
        return 'from-emerald-500/20 to-emerald-600/20'
      default:
        return 'from-primary/20 to-purple-500/20'
    }
  }

  const getTextGradient = () => {
    switch (type) {
      case 'current':
        return 'from-amber-500 to-amber-600'
      case 'upcoming':
        return 'from-blue-500 to-blue-600'
      case 'completed':
        return 'from-emerald-500 to-emerald-600'
      default:
        return 'from-primary to-purple-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="p-6 backdrop-blur-sm bg-card/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform">
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className="flex items-start space-x-4"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${getGradient()}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-semibold bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent`}>
                {title}
              </h3>
              <div className="mt-2 flex items-baseline space-x-2">
                <motion.span
                  className={`text-4xl font-bold bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {value}
                </motion.span>
                <span className="text-sm text-muted-foreground">tâches</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>
          </motion.div>
          <div className={`absolute top-0 right-0 -z-10 h-24 w-24 rounded-full bg-gradient-to-br ${getGradient()} blur-2xl`} />
        </div>
      </Card>
    </motion.div>
  )
} 