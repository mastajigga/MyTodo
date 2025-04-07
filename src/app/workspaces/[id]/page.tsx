import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WorkspaceDetails } from '@/components/workspace/WorkspaceDetails'
import { ArrowLeft, Settings } from 'lucide-react'

interface WorkspacePageProps {
  params: {
    id: string
  }
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          className="inline-flex items-center"
          asChild
        >
          <Link href="/workspaces">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux espaces de travail
          </Link>
        </Button>

        <Button
          variant="outline"
          asChild
        >
          <Link href={`/workspaces/${params.id}/settings`}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
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
        <WorkspaceDetails workspaceId={params.id} />
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params }: WorkspacePageProps) {
  return {
    title: 'Espace de travail | MyTodo',
    description: 'Gérez votre espace de travail et collaborez avec votre équipe',
  }
} 