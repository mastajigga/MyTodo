'use client'

import ClientLayout from '@/app/ClientLayout'

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>
} 