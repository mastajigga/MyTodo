'use client'

import { createContext, useContext } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseClient()

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase doit être utilisé dans un SupabaseProvider')
  }
  return context
} 