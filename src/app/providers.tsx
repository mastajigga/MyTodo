'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider';
import { KeyboardShortcutsProvider } from '@/components/providers/KeyboardShortcutsProvider';
import { useState } from 'react';
import SupabaseProvider from '@/lib/supabase/supabase-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SupabaseProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <KeyboardShortcutsProvider>
            <WorkspaceProvider>
              <CreateTaskDialogProvider>
                {children}
              </CreateTaskDialogProvider>
            </WorkspaceProvider>
          </KeyboardShortcutsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  );
} 