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

      {/* Menu utilisateur déplacé dans la top bar principale */}
    </div>
  );
} 