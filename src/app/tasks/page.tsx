'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'

export default function TasksPage() {
  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Mes tâches
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-6">
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Tableau Kanban</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[calc(100vh-16rem)] overflow-x-auto">
              <div className="min-w-full p-6">
                <KanbanBoard projectId="all" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 