"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DialogProps } from "@radix-ui/react-dialog"
import { Search } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useKeyboardShortcuts } from "@/components/providers/KeyboardShortcutsProvider"

export function SearchBar({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { registerShortcut } = useKeyboardShortcuts()

  React.useEffect(() => {
    return registerShortcut("k", () => {
      setOpen((open) => !open)
    })
  }, [registerShortcut])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <CommandPrimitive className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
              value={value}
              onValueChange={setValue}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Rechercher..."
            />
          </div>
          <CommandPrimitive.List>
            <CommandPrimitive.Empty data-testid="search-empty">Aucun résultat trouvé.</CommandPrimitive.Empty>
            {value === "" && (
              <CommandPrimitive.Group heading="Suggestions">
                <CommandPrimitive.Item
                  onSelect={() => runCommand(() => router.push('/projects'))}
                >
                  Projets
                </CommandPrimitive.Item>
                <CommandPrimitive.Item
                  onSelect={() => runCommand(() => router.push('/workspaces'))}
                >
                  Espaces de travail
                </CommandPrimitive.Item>
              </CommandPrimitive.Group>
            )}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  )
} 