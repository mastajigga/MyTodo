import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Configuration directe pour la connexion en ligne
const supabaseUrl = 'https://eahjdvmpmqwnupsqnxjz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjMzMTksImV4cCI6MjA1OTUzOTMxOX0.Vx-9AwjbT_hTPOzBQPi8wt5j5EDZYRiCiT85rm2_nPA'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export function getSupabaseClient() {
  return supabase
} 