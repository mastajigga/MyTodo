import { motion } from "framer-motion";
import { Home, LayoutGrid, CheckSquare, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/workspaces", icon: LayoutGrid, label: "Espaces" },
  { href: "/tasks", icon: CheckSquare, label: "Tâches" },
  { href: "/settings", icon: Settings, label: "Réglages" },
];

const mobileTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30
};

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={mobileTransition}
        className="flex-1"
      >
        {children}
      </motion.div>

      {/* Navigation mobile fixe en bas */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={mobileTransition}
      >
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center p-2 relative"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  transition={mobileTransition}
                >
                  <Icon 
                    className={`w-6 h-6 ${
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    }`} 
                  />
                  <span className={`text-xs mt-1 ${
                    isActive 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                      transition={mobileTransition}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.nav>
    </div>
  );
} 