import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTaskTag, type TaskTag } from '@/lib/hooks/useTaskTag'
import { Tag, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TaskTagsProps = {
  workspaceId: string
  taskId?: string
  onTagsChange?: (tags: TaskTag[]) => void
  className?: string
}

export function TaskTags({ workspaceId, taskId, onTagsChange, className }: TaskTagsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#3b82f6') // Bleu par défaut
  const [tags, setTags] = useState<TaskTag[]>([])
  const { loading, getTaskTags, createTaskTag, deleteTaskTag, assignTagToTask, removeTagFromTask, getTaskTagsByTaskId } = useTaskTag()

  // Charger les étiquettes au montage
  useEffect(() => {
    const loadTags = async () => {
      if (taskId) {
        const taskTags = await getTaskTagsByTaskId(taskId)
        setTags(taskTags)
      } else {
        const workspaceTags = await getTaskTags(workspaceId)
        setTags(workspaceTags)
      }
    }
    loadTags()
  }, [workspaceId, taskId])

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    const newTag = await createTaskTag({
      name: newTagName.trim(),
      color: newTagColor,
      workspace_id: workspaceId,
    })

    if (newTag) {
      if (taskId) {
        await assignTagToTask(taskId, newTag.id)
      }
      setTags([...tags, newTag])
      setNewTagName('')
      onTagsChange?.(tags)
    }
  }

  const handleRemoveTag = async (tagId: string) => {
    if (taskId) {
      const success = await removeTagFromTask(taskId, tagId)
      if (success) {
        setTags(tags.filter(tag => tag.id !== tagId))
        onTagsChange?.(tags.filter(tag => tag.id !== tagId))
      }
    } else {
      const success = await deleteTaskTag(tagId)
      if (success) {
        setTags(tags.filter(tag => tag.id !== tagId))
        onTagsChange?.(tags.filter(tag => tag.id !== tagId))
      }
    }
  }

  const handleTagClick = async (tag: TaskTag) => {
    if (!taskId) return

    const isTagged = tags.some(t => t.id === tag.id)
    if (isTagged) {
      await removeTagFromTask(taskId, tag.id)
      setTags(tags.filter(t => t.id !== tag.id))
    } else {
      await assignTagToTask(taskId, tag.id)
      setTags([...tags, tag])
    }
    onTagsChange?.(tags)
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map(tag => (
        <div
          key={tag.id}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-sm"
          style={{ backgroundColor: tag.color + '20', color: tag.color }}
        >
          <Tag size={14} />
          <span>{tag.name}</span>
          <button
            onClick={() => handleRemoveTag(tag.id)}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={loading}
          >
            <Plus size={16} className="mr-1" />
            Ajouter une étiquette
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Nom de l&apos;étiquette</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="Nouvelle étiquette..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagColor">Couleur</Label>
              <Input
                id="tagColor"
                type="color"
                value={newTagColor}
                onChange={e => setNewTagColor(e.target.value)}
              />
            </div>
            <Button
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || loading}
              className="w-full"
            >
              Créer l&apos;étiquette
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 