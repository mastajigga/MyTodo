import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  LogOut,
  FolderKanban,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspaces', href: '/workspaces', icon: Briefcase },
  { name: 'Projets', href: '/projects', icon: FolderKanban },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
];

export function TopBarNavigation() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { supabase } = useSupabase();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      document.cookie.split(';').forEach((c) => {
        const cookieName = c.split('=')[0].trim();
        document.cookie = `${cookieName}=; Max-Age=0; path=/;`;
      });
      localStorage.clear();
      sessionStorage.clear();
      toast.success('Déconnexion réussie');
      window.location.replace('/auth/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <nav className="hidden md:flex w-full h-16 items-center px-6 bg-white/90 dark:bg-gray-900/90 shadow-lg rounded-b-2xl backdrop-blur-md z-30 animate-fade-in sticky top-0">
      <div className="flex flex-1 gap-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/10 text-primary shadow-md'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary')} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Link
          href="/settings"
          className={cn(
            'group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
            pathname.startsWith('/settings')
              ? 'bg-primary/10 text-primary shadow-md'
              : 'text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary'
          )}
        >
          <Settings className={cn('h-5 w-5', pathname.startsWith('/settings') ? 'text-primary' : 'text-gray-400 group-hover:text-primary')} />
          Paramètres
        </Link>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary px-4 py-2"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </nav>
  );
} 