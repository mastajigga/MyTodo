import { motion } from "framer-motion"
import { Home, LayoutGrid, CheckSquare, ChevronRight, Folder } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { UserNav } from "./UserNav"
import { useSupabase } from '@/lib/supabase/supabase-provider'

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Tableau de bord",
    description: "Vue d'ensemble de vos activités"
  },
  {
    href: "/workspaces",
    icon: LayoutGrid,
    label: "Espaces de travail",
    description: "Gérez vos espaces collaboratifs"
  },
  {
    href: "/projects",
    icon: Folder,
    label: "Projets",
    description: "Gérez vos projets et leurs tâches"
  },
  {
    href: "/tasks",
    icon: CheckSquare,
    label: "Tâches",
    description: "Suivez vos tâches et projets"
  }
]

const navTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
}

export function Navigation() {
  const pathname = usePathname()
  const { user } = useSupabase()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={navTransition}
      className="w-64 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block"
    >
      <div className="flex flex-col h-screen sticky top-0">
        <div className="flex-1 p-4">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Navigation
              </h2>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-x-3 rounded-md p-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground relative",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={navTransition}
                      className="flex items-center gap-x-3 flex-1"
                    >
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <span>{item.label}</span>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground/50 transition-transform",
                          isActive && "transform rotate-90"
                        )}
                      />
                    </motion.div>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute left-0 w-1 h-8 bg-primary rounded-r-full my-auto"
                        transition={navTransition}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
        <motion.div 
          className="mt-auto p-4 border-t border-border/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ...navTransition }}
        >
          <UserNav user={user} />
        </motion.div>
      </div>
    </motion.div>
  )
} 