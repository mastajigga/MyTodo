'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  FolderKanban,
  Briefcase
} from 'lucide-react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspaces', href: '/workspaces', icon: Briefcase },
  { name: 'Projets', href: '/projects', icon: FolderKanban },
  { name: 'Tâches', href: '/tasks', icon: ListTodo },
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const overlayVariants = {
  open: {
    opacity: 1,
    backdropFilter: "blur(4px)",
    transition: { duration: 0.3 }
  },
  closed: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3 }
  }
};

// Déplacer NavContent en dehors du composant principal
const NavContent = ({ pathname, onLogout }: { pathname: string; onLogout: () => Promise<void> }) => (
  <>
    <div className="flex h-16 items-center justify-center border-b border-gray-800">
      <h1 className="text-xl font-bold text-white" data-testid="sidebar-title">MyTodo</h1>
    </div>
    <div className="flex flex-1 flex-col space-y-1 p-3">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href);
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
    <div className="mt-auto p-3 space-y-2">
      <Link
        href="/settings"
        data-testid="nav-link-settings"
        className={cn(
          'group flex items-center rounded-lg px-3 py-2 text-sm font-medium',
          pathname.startsWith('/settings')
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        )}
      >
        <Settings
          className={cn(
            'mr-3 h-5 w-5',
            pathname.startsWith('/settings')
              ? 'text-white'
              : 'text-gray-400 group-hover:text-white'
          )}
        />
        Paramètres
      </Link>
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
        onClick={onLogout}
        data-testid="logout-button"
      >
        <LogOut className="mr-3 h-5 w-5" />
        Déconnexion
      </Button>
    </div>
  </>
);

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isOpen, setIsOpen] = useState(false);

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Empêcher le défilement du body quand le menu est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Suppression de tous les cookies du domaine
      document.cookie.split(';').forEach((c) => {
        const cookieName = (c.split('=')[0] || '').trim();
        document.cookie = `${cookieName}=; Max-Age=0; path=/;`;
      });

      // Suppression du localStorage et sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      toast.success('Déconnexion réussie');
      window.location.replace('/auth/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const toggleMenu = () => {
    console.log('Toggle menu, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton du menu burger (visible uniquement sur mobile) */}
      <button
        type="button"
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-[100] rounded-full bg-gray-900 p-2 text-white md:hidden focus:outline-none focus:ring-2 focus:ring-primary active:bg-gray-800"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Version desktop : remplacée par TopBarNavigation */}

      {/* Version mobile avec animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay avec effet de flou */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 z-[90] bg-black/50"
              onClick={toggleMenu}
            />

            {/* Menu latéral */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed inset-y-0 left-0 z-[95] w-64 bg-gray-900 shadow-xl flex flex-col"
            >
              <NavContent pathname={pathname || ''} onLogout={handleLogout} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 