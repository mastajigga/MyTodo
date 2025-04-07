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
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LogOut, Settings, User } from "lucide-react"

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
    <div className="flex items-center gap-4">
      <button
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        onClick={() => {/* TODO: Implement dropdown menu */}}
      >
        <Avatar>
          <img
            src={profile?.avatar_url || 'https://github.com/shadcn.png'}
            alt={profile?.full_name || 'Avatar'}
            className="rounded-full"
          />
        </Avatar>
        <span className="text-sm font-medium">
          {profile?.full_name || 'John Doe'}
        </span>
      </button>
      {/* TODO: Implement dropdown menu with these items
        - Profile
        - Settings
        - Logout
      */}
    </div>
  );
} 