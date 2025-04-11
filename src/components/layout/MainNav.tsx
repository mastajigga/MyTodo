'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users2, ListTodo } from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
  },
  {
    href: '/workspaces',
    label: 'Espaces de travail',
    icon: Users2,
  },
  {
    href: '/tasks',
    label: 'Mes tâches',
    icon: ListTodo,
  },
];

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link
        href="/workspaces"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/workspaces"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Espaces de travail
      </Link>
      <Link
        href="/tasks"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/tasks"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Tâches
      </Link>
    </nav>
  );
} 