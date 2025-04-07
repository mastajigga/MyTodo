import { PageHeader } from "@/components/ui/PageHeader"

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        heading="Tableau de bord"
        text="Bienvenue sur votre espace de travail personnel"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* TODO: Add dashboard widgets */}
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Tâches récentes</h3>
          <p className="text-sm text-gray-500">
            Aucune tâche récente à afficher
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Activité</h3>
          <p className="text-sm text-gray-500">
            Aucune activité récente à afficher
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Espaces de travail</h3>
          <p className="text-sm text-gray-500">
            Aucun espace de travail à afficher
          </p>
        </div>
      </div>
    </div>
  )
} 