"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const settingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
  language: z.enum(["fr", "en"]),
  privacyEnabled: z.boolean(),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="theme">Thème</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Sélectionnez un thème" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choisissez le thème de l'application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="language">Langue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choisissez la langue de l'application
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailNotifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel htmlFor="emailNotifications" className="text-base">
                  Notifications par email
                </FormLabel>
                <FormDescription>
                  Recevez des notifications par email pour les mises à jour importantes
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="emailNotifications"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="privacyEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel htmlFor="privacyEnabled" className="text-base">
                  Mode privé
                </FormLabel>
                <FormDescription>
                  Masquez vos informations personnelles aux autres utilisateurs
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  id="privacyEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </form>
    </Form>
  )
} 