'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  LogOut,
} from 'lucide-react';
import { useSupabase } from '@/hooks/useSupabase';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tâches', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'Équipe', href: '/dashboard/team', icon: Users },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { supabase } = useSupabase();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900" data-testid="sidebar">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-white" data-testid="sidebar-title">MyTodo</h1>
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              data-testid={`nav-link-${item.name.toLowerCase()}`}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 group-hover:text-white'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={handleLogout}
          data-testid="logout-button"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
} 