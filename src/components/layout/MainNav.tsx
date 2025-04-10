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

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col space-y-6" data-testid="main-nav">
      <Link 
        href="/dashboard" 
        className="flex items-center space-x-2"
        data-testid="logo-link"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ListTodo className="h-6 w-6 text-primary" />
        </div>
        <span className="font-bold text-2xl bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
          MyTodo
        </span>
      </Link>

      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.href.replace('/', '')}`}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              )}
            >
              <div className={cn(
                'flex h-6 w-6 items-center justify-center rounded transition-colors',
                isActive ? 'bg-primary/10' : 'bg-muted group-hover:bg-primary/10'
              )}>
                <Icon className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                )} />
              </div>
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 