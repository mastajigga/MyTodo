'use client'

import { Session } from '@supabase/supabase-js'
import SupabaseProvider from '@/lib/supabase/supabase-provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBarNavigation } from '@/components/layout/TopBarNavigation'
import { usePathname } from 'next/navigation'
import { NotificationsProvider } from '@/contexts/NotificationsContext'

interface ClientLayoutContentProps {
  session: Session | null
  children: React.ReactNode
}

export function ClientLayoutContent({ session, children }: ClientLayoutContentProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return (
      <SupabaseProvider>
        <NotificationsProvider>
          <QueryProvider>
            <WorkspaceProvider>
              <CreateTaskDialogProvider>
                {children}
              </CreateTaskDialogProvider>
            </WorkspaceProvider>
          </QueryProvider>
        </NotificationsProvider>
      </SupabaseProvider>
    )
  }

  return (
    <SupabaseProvider>
      <NotificationsProvider>
        <QueryProvider>
          <WorkspaceProvider>
            <CreateTaskDialogProvider>
              <div className="min-h-screen flex flex-col bg-background">
                <TopBarNavigation />
                <div className="flex-1 w-full flex">
                  <div className="md:hidden"><Sidebar /></div>
                  <main className="flex-1 h-full p-4 pt-16 md:pt-4">
                    {children}
                  </main>
                </div>
              </div>
            </CreateTaskDialogProvider>
          </WorkspaceProvider>
        </QueryProvider>
      </NotificationsProvider>
    </SupabaseProvider>
  )
} 