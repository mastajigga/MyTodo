import { Metadata } from "next"
import { SettingsForm } from "@/components/settings/SettingsForm"

export const metadata: Metadata = {
  title: "Paramètres | MyTodo",
  description: "Gérez vos préférences et paramètres de compte",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Paramètres</h1>
        <SettingsForm />
      </div>
    </div>
  )
} 