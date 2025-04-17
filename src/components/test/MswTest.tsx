'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/task'

export function MswTest() {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch('/api/tasks/1')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la tâche')
        }
        const data = await response.json()
        setTask(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [])

  if (loading) {
    return <div className="p-4">Chargement...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error}</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Test MSW</h2>
      {task && (
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
              {task.status}
            </span>
            <span className="ml-2 inline-block px-2 py-1 text-sm rounded bg-purple-100 text-purple-800">
              {task.priority}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 