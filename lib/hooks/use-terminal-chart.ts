'use client'

import useSWR from 'swr'
import { useEffect } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Timeframe } from '@/lib/contracts/config'

export type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number }

export function useTerminalChart(tokenAddress: string | undefined, timeframe: Timeframe = '1h') {
  const supabase = getSupabaseBrowserClient()
  const key = tokenAddress && supabase ? ['candles', tokenAddress, timeframe] : null
  const { data, mutate, error } = useSWR<Candle[]>(key, async () => {
    const { data, error } = await supabase!.from('token_candles').select('timestamp, open, high, low, close, volume').eq('token_address', tokenAddress).eq('timeframe', timeframe).order('timestamp', { ascending: true }).limit(500)
    if (error) throw error
    return (data ?? []).map((row) => ({ time: Math.floor(new Date(row.timestamp).getTime() / 1000), open: Number(row.open), high: Number(row.high), low: Number(row.low), close: Number(row.close), volume: Number(row.volume) }))
  }, { revalidateOnFocus: false })

  useEffect(() => {
    if (!tokenAddress || !supabase) return
    const channel = supabase.channel(`trades:${tokenAddress}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'token_trades', filter: `token_address=eq.${tokenAddress}` }, (payload) => {
      const trade = payload.new as { price: number; volume: number; created_at: string }
      mutate((current = []) => {
        const time = Math.floor(new Date(trade.created_at).getTime() / 1000)
        const bucketSeconds = timeframe === '1m' ? 60 : timeframe === '5m' ? 300 : timeframe === '15m' ? 900 : timeframe === '1h' ? 3600 : timeframe === '4h' ? 14400 : timeframe === '1d' ? 86400 : 604800
        const bucket = Math.floor(time / bucketSeconds) * bucketSeconds
        const last = current.at(-1)
        if (last && last.time === bucket) return [...current.slice(0, -1), { ...last, high: Math.max(last.high, Number(trade.price)), low: Math.min(last.low, Number(trade.price)), close: Number(trade.price), volume: last.volume + Number(trade.volume) }]
        return [...current, { time: bucket, open: Number(trade.price), high: Number(trade.price), low: Number(trade.price), close: Number(trade.price), volume: Number(trade.volume) }]
      }, false)
    }).subscribe()
    return () => { void supabase.removeChannel(channel) }
  }, [mutate, supabase, tokenAddress, timeframe])

  return { candles: data ?? [], error, live: Boolean(tokenAddress && supabase && !error), loading: !data && !error }
}
