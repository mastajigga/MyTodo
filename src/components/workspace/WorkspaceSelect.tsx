'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { Skeleton } from "@/components/ui/skeleton"

interface Workspace {
  id: string
  name: string
}

interface WorkspaceSelectProps {
  value?: string
  onValueChange: (value: string) => void
}

export function WorkspaceSelect({ value, onValueChange }: WorkspaceSelectProps) {
  const [open, setOpen] = React.useState(false)
  const { supabase } = useSupabase()

  const { data: workspaces, isLoading } = useQuery<Workspace[]>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('id, name')
        .order('name')
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <Skeleton className="h-10 w-[200px]" />
  }

  const allWorkspaces = [
    { id: 'all', name: 'Tous les espaces de travail' },
    ...(workspaces || [])
  ]

  const selectedWorkspace = value ? allWorkspaces.find((workspace) => workspace.id === value) : allWorkspaces[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedWorkspace?.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un espace..." />
          <CommandEmpty>Aucun espace trouvé.</CommandEmpty>
          <CommandGroup>
            {allWorkspaces.map((workspace) => (
              <CommandItem
                key={workspace.id}
                value={workspace.name}
                onSelect={() => {
                  onValueChange(workspace.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === workspace.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {workspace.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 