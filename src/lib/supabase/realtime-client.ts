import { createClient } from '@supabase/supabase-js'

export const supabaseRealtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Gestion centralisée des channels et handlers
const channelMap = new Map<string, { channel: any, handler: any }>()

export function getOrCreateChannel(name: string, onConfig?: { event: string, schema: string, table: string, filter: string }, handlerFn?: (payload: any) => void) {
  if (channelMap.has(name)) return channelMap.get(name)!.channel;
  const channel = supabaseRealtime.channel(name);
  let handler = null;
  if (onConfig && handlerFn) {
    handler = channel.on('postgres_changes', onConfig, handlerFn);
  }
  channel.subscribe();
  channelMap.set(name, { channel, handler });
  return channel;
}

export function removeChannel(name: string) {
  if (channelMap.has(name)) {
    const { channel } = channelMap.get(name)!;
    channel.unsubscribe();
    supabaseRealtime.removeChannel(channel);
    channelMap.delete(name);
  }
} 