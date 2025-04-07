import { Home, Settings } from "lucide-react"
import Link from "next/link"
import { WorkspaceList } from "@/components/workspace/WorkspaceList"
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog"

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-gray-50/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 border-b flex items-center px-6">
        <Link href="/" className="font-semibold text-xl">
          MyTodo
        </Link>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
        >
          <Home className="w-4 h-4" />
          Tableau de bord
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
      </nav>

      {/* Liste des espaces de travail */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">Espaces de travail</h2>
          <CreateWorkspaceDialog />
        </div>
        <WorkspaceList />
      </div>
    </div>
  )
} 