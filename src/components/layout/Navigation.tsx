import { MainNav } from "@/components/layout/MainNav"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Workflow, ListTodo } from "lucide-react"
import { motion } from "framer-motion"

export function Navigation() {
  const pathname = usePathname()

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative flex h-full flex-col bg-background/50 backdrop-blur-sm"
    >
      <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-border/50 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/10 to-transparent" />
      
      <div className="flex h-16 items-center border-b border-border/30 px-6">
        <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent"
          >
            MyTodo
          </motion.span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start gap-2 px-4 text-sm font-medium">
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
            { href: "/workspaces", icon: Workflow, label: "Espaces de travail" },
            { href: "/tasks", icon: ListTodo, label: "Tâches" }
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ease-in-out",
                  "hover:bg-gradient-to-r hover:from-indigo-500/10 hover:via-purple-500/10 hover:to-pink-500/10",
                  pathname?.startsWith(item.href) 
                    ? "bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 font-semibold" 
                    : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "transition-colors duration-200",
                    pathname?.startsWith(item.href) 
                      ? "text-indigo-500" 
                      : "text-muted-foreground group-hover:text-indigo-500"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <span className={cn(
                  "font-medium transition-all duration-200",
                  pathname?.startsWith(item.href) && "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                )}>
                  {item.label}
                </span>
                {pathname?.startsWith(item.href) && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.div>
  )
} 