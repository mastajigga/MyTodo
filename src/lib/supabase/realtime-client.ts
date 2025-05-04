import { createClient } from '@supabase/supabase-js'

export const supabaseRealtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Gestion centralisée des channels pour éviter les doublons
const channelMap = new Map<string, any>()

export function getOrCreateChannel(name: string) {
  if (channelMap.has(name)) return channelMap.get(name)
  const channel = supabaseRealtime.channel(name)
  channelMap.set(name, channel)
  return channel
}

export function removeChannel(name: string) {
  if (channelMap.has(name)) {
    supabaseRealtime.removeChannel(channelMap.get(name))
    channelMap.delete(name)
  }
} 