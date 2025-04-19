"use client";

import { Home, LayoutGrid, CheckSquare, User, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Accueil" },
  { href: "/projects", icon: LayoutGrid, label: "Projets" },
  { href: "/tasks", icon: CheckSquare, label: "Tâches" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">MyTodo</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">{children}</main>

      <nav className="border-t">
        <ul className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
} 