'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './client'
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