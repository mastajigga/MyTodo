'use client'

import { Session } from '@supabase/supabase-js'
import SupabaseProvider from '@/lib/supabase/supabase-provider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider'
import { Navigation } from '@/components/layout/Navigation'
import { usePathname } from 'next/navigation'

interface ClientLayoutContentProps {
  session: Session | null
  children: React.ReactNode
}

export default function ClientLayoutContent({ session, children }: ClientLayoutContentProps) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')

  return (
    <SupabaseProvider session={session}>
      <QueryProvider>
        <WorkspaceProvider>
          <CreateTaskDialogProvider>
            <div className={isAuthPage ? '' : 'flex h-screen'}>
              {!isAuthPage && <Navigation />}
              <main className={isAuthPage ? '' : 'flex-1 overflow-y-auto'}>
                {children}
              </main>
            </div>
          </CreateTaskDialogProvider>
        </WorkspaceProvider>
      </QueryProvider>
    </SupabaseProvider>
  )
} 