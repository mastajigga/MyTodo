"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const settingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.enum(["fr", "en"]).default("fr"),
  privacyEnabled: z.boolean().default(true),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      theme: "system",
      language: "fr",
      privacyEnabled: true,
    },
  })

  const onSubmit = async (data: SettingsFormData) => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          ...data,
        })

      if (error) throw error

      toast.success("Paramètres mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des paramètres")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Gérez vos préférences et paramètres de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Notifications par email</Label>
              <CardDescription>
                Recevez des notifications par email pour les tâches importantes
              </CardDescription>
            </div>
            <Switch
              checked={form.watch("emailNotifications")}
              onCheckedChange={(checked) => form.setValue("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Thème</Label>
              <CardDescription>
                Choisissez votre thème préféré
              </CardDescription>
            </div>
            <Select
              value={form.watch("theme")}
              onValueChange={(value) => form.setValue("theme", value as "light" | "dark" | "system")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Langue</Label>
              <CardDescription>
                Choisissez votre langue préférée
              </CardDescription>
            </div>
            <Select
              value={form.watch("language")}
              onValueChange={(value) => form.setValue("language", value as "fr" | "en")}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Confidentialité</Label>
              <CardDescription>
                Activer les paramètres de confidentialité avancés
              </CardDescription>
            </div>
            <Switch
              checked={form.watch("privacyEnabled")}
              onCheckedChange={(checked) => form.setValue("privacyEnabled", checked)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
} 