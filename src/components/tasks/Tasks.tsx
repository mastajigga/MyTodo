import React, { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
// import { getTasks } from '../../lib/tasks' // Module introuvable, à corriger si besoin
import { Task } from '@/@types/task'

const Tasks: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [listId, setListId] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])
  const supabase = getSupabaseClient();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [supabase.auth])

  // TODO: Implémenter la récupération des tâches depuis Supabase ici
  // const loadTasks = async () => {
  //   const { data: fetchedTasks } = await supabase.from('tasks').select('*').eq('workspace_id', workspaceId)
  //   setTasks(fetchedTasks || [])
  // }

  return (
    <div>Tasks component</div>
  )
}

export default Tasks 