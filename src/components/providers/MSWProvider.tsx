'use client'

import { useEffect } from 'react'
import { initializeMocks } from '@/lib/mocks/initialize'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initializeMocks()
    }
  }, [])

  return <>{children}</>
} 