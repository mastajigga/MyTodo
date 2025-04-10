'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LogOut, Settings, User } from "lucide-react";
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

export function UserNav() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };

    getProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      toast.error('Une erreur est survenue lors de la déconnexion');
    }
  };

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="flex items-center gap-4" data-testid="user-nav">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-8 w-8 rounded-full"
            data-testid="user-menu-button"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={profile?.avatar_url || 'https://github.com/shadcn.png'} 
                alt={profile?.full_name || 'Avatar'} 
                data-testid="user-avatar"
              />
              <AvatarFallback data-testid="user-avatar-fallback">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none" data-testid="user-full-name">
                {profile?.full_name || 'Utilisateur'}
              </p>
              <p className="text-xs leading-none text-muted-foreground" data-testid="user-email">
                {profile?.full_name ? 'user@example.com' : ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem 
              onClick={() => router.push('/profile')}
              data-testid="profile-menu-item"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => router.push('/settings')}
              data-testid="settings-menu-item"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="text-red-600 focus:text-red-600"
            data-testid="logout-menu-item"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 