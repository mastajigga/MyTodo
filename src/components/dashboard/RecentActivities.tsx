import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface Activity {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  date: string
}

interface RecentActivitiesProps {
  activities: Activity[]
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-3">
            {getStatusIcon(activity.status)}
            <span className="font-medium">{activity.title}</span>
          </div>
          <span className="text-sm text-muted-foreground">{activity.date}</span>
        </div>
      ))}
    </div>
  )
} 