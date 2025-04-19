'use client'

import { Session } from '@supabase/supabase-js'
import SupabaseProvider from '@/lib/supabase/supabase-provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider'
import { Navigation } from '@/components/layout/Navigation'
import { MobileLayout } from '@/components/layout/MobileLayout'
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
            <div className="min-h-screen flex">
              <Navigation />
              <div className="flex-1 relative">
                <MobileLayout>
                  <main className="h-full p-4">
                    {children}
                  </main>
                </MobileLayout>
              </div>
            </div>
          </CreateTaskDialogProvider>
        </WorkspaceProvider>
      </QueryProvider>
    </SupabaseProvider>
  )
} 