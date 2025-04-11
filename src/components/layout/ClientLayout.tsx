'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/supabase-provider"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { SearchBar } from "@/components/layout/SearchBar"
import { Navigation } from "@/components/layout/Navigation"
import { ToasterProvider } from "@/components/layout/ToasterProvider"
import { UserNav } from "@/components/layout/UserNav"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex min-h-screen bg-background">
          <div className="hidden border-r bg-background md:block md:w-64">
            <Navigation />
          </div>
          <div className="flex w-full flex-1 flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center justify-between px-4">
                <div className="flex flex-1">
                  <SearchBar />
                </div>
                <div className="flex items-center gap-4">
                  <UserNav />
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
      <ToasterProvider />
    </>
  )
} 