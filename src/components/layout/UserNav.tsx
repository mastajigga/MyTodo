'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const { user, signOut } = useAuth();
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

  if (!user) return null;

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
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ""} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configuration
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 