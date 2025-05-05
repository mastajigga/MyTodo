"use client"
//pull request empty

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/useAuth"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Déconnexion réussie")
      router.push("/auth/login")
    } catch (error) {
      toast.error("Erreur lors de la déconnexion")
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto py-8 space-y-8"
    >
      <motion.div variants={item}>
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full" />
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full blur-sm" />
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card className="backdrop-blur-sm bg-card/50">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ""} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">
                  {user?.user_metadata?.full_name || "Utilisateur"}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 
