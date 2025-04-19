'use client'

import { Session } from '@supabase/supabase-js'
import SupabaseProvider from '@/lib/supabase/supabase-provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider'
import { Sidebar } from '@/components/layout/Sidebar'
import { usePathname } from 'next/navigation'

interface ClientLayoutContentProps {
  session: Session | null
  children: React.ReactNode
}

export function ClientLayoutContent({ session, children }: ClientLayoutContentProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  if (isAuthPage) {
    return (
      <SupabaseProvider session={session}>
        <QueryProvider>
          <WorkspaceProvider>
            <CreateTaskDialogProvider>
              {children}
            </CreateTaskDialogProvider>
          </WorkspaceProvider>
        </QueryProvider>
      </SupabaseProvider>
    )
  }

  return (
    <SupabaseProvider session={session}>
      <QueryProvider>
        <WorkspaceProvider>
          <CreateTaskDialogProvider>
            <div className="min-h-screen flex bg-background">
              <Sidebar />
              <div className="flex-1 md:ml-64">
                <main className="h-full p-4 pt-16 md:pt-4">
                  {children}
                </main>
              </div>
            </div>
          </CreateTaskDialogProvider>
        </WorkspaceProvider>
      </QueryProvider>
    </SupabaseProvider>
  )
} 