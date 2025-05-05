import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'

// Gestion centralisée des channels et handlers
const channelMap = new Map<string, { channel: any, handler: any }>()

export function getOrCreateChannel(supabase: SupabaseClient, name: string, onConfig?: { event: string, schema: string, table: string, filter: string }, handlerFn?: (payload: any) => void) {
  if (channelMap.has(name)) return channelMap.get(name)!.channel;
  const channel = supabase.channel(name);
  let handler = null;
  if (onConfig && handlerFn) {
    handler = channel.on('postgres_changes' as any, onConfig, handlerFn);
  }
  channel.subscribe();
  channelMap.set(name, { channel, handler });
  return channel;
}

export function removeChannel(supabase: SupabaseClient, name: string) {
  if (channelMap.has(name)) {
    const { channel } = channelMap.get(name)!;
    channel.unsubscribe();
    supabase.removeChannel(channel);
    channelMap.delete(name);
  }
} 