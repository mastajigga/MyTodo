import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CreateWorkspace } from '@/components/workspace/CreateWorkspace'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Créer un espace de travail | MyTodo',
  description: 'Créez un nouvel espace de travail pour collaborer avec votre équipe',
}

export default function NewWorkspacePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        asChild
      >
        <Link href="/workspaces" className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux espaces de travail
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Créer un espace de travail</h1>
        <p className="mt-2 text-muted-foreground">
          Créez un nouvel espace de travail pour collaborer avec votre équipe
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CreateWorkspace />
      </div>
    </div>
  )
} 