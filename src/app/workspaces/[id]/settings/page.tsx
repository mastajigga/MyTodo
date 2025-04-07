import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WorkspaceDetails } from '@/components/workspace/WorkspaceDetails'
import { ArrowLeft } from 'lucide-react'

interface WorkspaceSettingsPageProps {
  params: {
    id: string
  }
}

export default function WorkspaceSettingsPage({ params }: WorkspaceSettingsPageProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        asChild
      >
        <Link href={`/workspaces/${params.id}`} className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à l&apos;espace de travail
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Paramètres de l&apos;espace de travail</h1>
        <p className="mt-2 text-muted-foreground">
          Gérez les paramètres et les membres de votre espace de travail
        </p>
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

export async function generateMetadata({ params }: WorkspaceSettingsPageProps) {
  return {
    title: "Paramètres de l'espace de travail | MyTodo",
    description: "Gérez les paramètres et les membres de votre espace de travail",
  }
} 