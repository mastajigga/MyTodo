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
  Menu,
  X
} from 'lucide-react';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tâches', href: '/dashboard/tasks', icon: ListTodo },
  { name: 'Équipe', href: '/dashboard/team', icon: Users },
  { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
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

export function Sidebar() {
  const pathname = usePathname();
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
      await supabase.auth.signOut();
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const NavContent = () => (
    <>
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
    </>
  );

  return (
    <>
      {/* Bouton du menu burger (visible uniquement sur mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 rounded-full bg-gray-900 p-2 text-white md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Version desktop */}
      <div className="hidden h-full w-64 flex-col bg-gray-900 md:flex" data-testid="sidebar">
        <NavContent />
      </div>

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
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu latéral */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900"
            >
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 