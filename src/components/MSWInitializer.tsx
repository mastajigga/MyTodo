'use client'

import { useEffect } from 'react'

export function MSWInitializer() {
  useEffect(() => {
    const enableMocking = async () => {
      if (process.env.NODE_ENV !== 'development') {
        return
      }

      const { worker } = await import('../mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
    }

    enableMocking()
  }, [])

  return null
} 