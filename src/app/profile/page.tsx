"use client"

import { Card } from "@/components/ui/card"
import { SettingsForm } from "@/components/settings/SettingsForm"

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <div className="relative mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
          Profil
        </h1>
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
      </div>

      <div className="grid gap-6">
        <Card className="p-6 backdrop-blur-sm bg-card/50">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Informations personnelles</h2>
              <p className="text-muted-foreground">
                Mettez à jour vos informations personnelles et vos préférences
              </p>
            </div>
            <SettingsForm />
          </div>
        </Card>
      </div>
    </div>
  )
} 