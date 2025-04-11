'use client'

import ClientLayout from '@/components/layout/ClientLayout'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
} 