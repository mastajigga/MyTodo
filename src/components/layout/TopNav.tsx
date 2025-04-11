'use client';

import { Bell, Search } from 'lucide-react';
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
import { useSupabase } from '@/hooks/useSupabase';

export function TopNav() {
  const { supabase } = useSupabase();
  const user = supabase.auth.getUser();

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
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none" data-testid="user-name">Utilisateur</p>
                <p className="text-xs leading-none text-muted-foreground" data-testid="user-email">
                  user@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="profile-menu-item">
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="settings-menu-item">
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 