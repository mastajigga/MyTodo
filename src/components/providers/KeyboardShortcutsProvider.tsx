'use client';

import { createContext, useContext, useEffect } from 'react';

interface KeyboardShortcutsContextType {
  registerShortcut: (key: string, callback: () => void) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function KeyboardShortcutsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Gérer l'attribut de raccourci clavier
    const body = document.querySelector('body');
    if (body) {
      // Supprimer l'ancien attribut s'il existe
      body.removeAttribute('cz-shortcut-listen');
      // Ajouter le nouveau data-attribute
      body.setAttribute('data-shortcut-listener', 'true');
    }
  }, []);

  const registerShortcut = (key: string, callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  };

  return (
    <KeyboardShortcutsContext.Provider value={{ registerShortcut }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
} 