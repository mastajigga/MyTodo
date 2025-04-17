'use client'

import { QueryProvider } from '@/components/providers/QueryProvider'
import { CreateTaskDialogProvider } from '@/components/providers/CreateTaskDialogProvider'
import { WorkspaceProvider } from '@/contexts/workspace-context'
import { initializeMocks } from '@/lib/mocks/initialize'

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <WorkspaceProvider>
        <CreateTaskDialogProvider>
          {children}
        </CreateTaskDialogProvider>
      </WorkspaceProvider>
    </QueryProvider>
  )
} 