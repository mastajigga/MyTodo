'use client';

import { Bell, Search, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { useRouter } from 'next/navigation';
import React from 'react';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function TopNav() {
  const { supabase } = useSupabase();
  const [user, setUser] = React.useState<any>(null);
  const router = useRouter();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, [supabase]);

  const fullName = user?.user_metadata?.full_name || user?.email || '';
  const email = user?.email || '';
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (email[0] || '').toUpperCase();

  return (
    <div className="h-16 border-b bg-white px-6 flex items-center justify-between" data-testid="top-nav">
      <div className="flex items-center flex-1 gap-4">
        <div className="w-72">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              data-testid="search-input"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
          data-testid="notifications-button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white" data-testid="notifications-count">
            2
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
              data-testid="user-menu-button"
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
                <p className="text-sm font-medium leading-none" data-testid="user-name">{fullName}</p>
                <p className="text-xs leading-none text-muted-foreground" data-testid="user-email">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="profile-menu-item" onClick={() => router.push('/profile')} tabIndex={0} aria-label="Aller au profil">
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="settings-menu-item" onClick={() => router.push('/settings')} tabIndex={0} aria-label="Aller aux paramètres">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 