'use client'

import useSWR from 'swr'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export type TokenMetadata = { name: string; symbol: string; description: string | null; creator_address: string; current_price: number | null; market_cap: number | null; volume_24h: number | null; progress: number | null; status: string; verified: boolean; total_supply: number | null; decimals: number | null; holders_count: number | null }

export function useTokenMetadata(address: string | undefined) {
  const supabase = getSupabaseBrowserClient()
  return useSWR<TokenMetadata | null>(address && supabase ? ['token-metadata', address] : null, async () => {
    const { data, error } = await supabase!.from('tokens').select('name,symbol,description,creator_address,current_price,market_cap,volume_24h,progress,status,verified,total_supply,decimals,holders_count').eq('contract_address', address as string).maybeSingle()
    if (error) throw error
    return data as TokenMetadata | null
  }, { revalidateOnFocus: false })
}
