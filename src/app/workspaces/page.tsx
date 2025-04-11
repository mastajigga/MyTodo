import { Metadata } from "next"
import { WorkspaceList } from "@/components/workspace/WorkspaceList"
import { CreateWorkspaceButton } from "@/components/workspace/CreateWorkspaceButton"

export const metadata: Metadata = {
  title: "Espaces de travail | MyTodo",
  description: "Gérez vos espaces de travail et collaborez avec votre équipe",
}

export default function WorkspacesPage() {
  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Espaces de travail
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="flex justify-end mb-6">
        <CreateWorkspaceButton />
      </div>

      <WorkspaceList />
    </div>
  )
} 