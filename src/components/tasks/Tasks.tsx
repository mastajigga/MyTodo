import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getTasks } from '../../lib/tasks'

const Tasks: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [workspaceId, setWorkspaceId] = useState<string>('')
  const [listId, setListId] = useState<string>('')
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [supabase.auth])

  const loadTasks = async () => {
    const fetchedTasks = await getTasks(workspaceId, listId)
    setTasks(fetchedTasks)
  }

  return (
    <div>Tasks component</div>
  )
}

export default Tasks 