import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WorkspaceList } from '@/components/workspace/WorkspaceList'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Mes espaces de travail | MyTodo',
  description: 'Gérez vos espaces de travail et collaborez avec votre équipe',
}

export default function WorkspacesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes espaces de travail</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez vos espaces de travail et collaborez avec votre équipe
          </p>
        </div>

        <Button asChild>
          <Link href="/workspaces/new">
            <Plus className="mr-2 h-4 w-4" />
            Créer un espace
          </Link>
        </Button>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        }
      >
        <WorkspaceList />
      </Suspense>
    </div>
  )
} 