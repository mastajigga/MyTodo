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
  Briefcase,
  Bell,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';

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
  const [user, setUser] = React.useState<any>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [supabase]);

  const fullName = user?.user_metadata?.full_name || user?.email || '';
  const email = user?.email || '';
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (email[0] || '').toUpperCase();

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
      <div className="flex items-center gap-4 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            2
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={`rounded-2xl shadow-2xl border-none backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 transition-all duration-200 ${isMobile ? 'w-full max-w-xs left-0' : 'w-56'}`}
            side={isMobile ? 'left' : 'top'}
            align="center"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/profile')} tabIndex={0} aria-label="Aller au profil">
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')} tabIndex={0} aria-label="Aller aux paramètres">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} tabIndex={0} aria-label="Déconnexion">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
} 