import { Metadata } from "next"
import { TaskCounter } from "@/components/dashboard/TaskCounter"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

export const metadata: Metadata = {
  title: "Tableau de bord | MyTodo",
  description: "Gérez vos tâches et suivez votre progression",
}

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <TaskCounter
          title="Tâches en cours"
          value={5}
          description="Tâches actives à compléter"
          type="current"
        />
        <TaskCounter
          title="Tâches à venir"
          value={3}
          description="Tâches planifiées"
          type="upcoming"
        />
        <TaskCounter
          title="Tâches terminées"
          value={12}
          description="Tâches accomplies"
          type="completed"
        />
      </div>

      <div className="mt-8">
        <RecentActivity
          activities={[
            {
              id: "1",
              type: "create",
              taskName: "Créer une présentation",
              timestamp: "Il y a 2 heures"
            },
            {
              id: "2",
              type: "complete",
              taskName: "Réunion client",
              timestamp: "Il y a 3 heures"
            },
            {
              id: "3",
              type: "update",
              taskName: "Mise à jour documentation",
              timestamp: "Il y a 5 heures"
            }
          ]}
        />
      </div>
    </div>
  )
} 