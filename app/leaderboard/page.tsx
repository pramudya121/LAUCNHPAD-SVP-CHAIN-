'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Search, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { PageFrame } from '@/components/app-header'

type Token = { contract_address: string; name: string; symbol: string; market_cap: number | null; volume_24h: number | null; progress: number | null; verified: boolean | null }
const money = (value: number | null) => value == null ? '—' : `$${Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value)}`

export default function LeaderboardPage() {
  const supabase = getSupabaseBrowserClient()
  const [query, setQuery] = useState('')
  const [metric, setMetric] = useState<'volume_24h' | 'market_cap' | 'progress'>('volume_24h')
  const { data, error, isLoading } = useSWR<Token[]>(supabase ? ['public-leaderboard', metric] : null, async () => {
    const { data: rows, error: fetchError } = await supabase!.from('tokens').select('contract_address,name,symbol,market_cap,volume_24h,progress,verified').order(metric, { ascending: false, nullsFirst: false }).limit(100)
    if (fetchError) throw fetchError
    return rows ?? []
  })
  const ranked = useMemo(() => (data ?? []).filter((token) => `${token.name} ${token.symbol} ${token.contract_address}`.toLowerCase().includes(query.toLowerCase())), [data, query])
  return <PageFrame active="Leaderboard"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[11px] uppercase tracking-[.2em] text-[#71d7ba]">Market pulse</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Leaderboard</h1><p className="mt-3 text-sm text-[#8c98ab]">Public rankings sourced only from indexed SVP Chain activity.</p></div><Trophy className="size-10 text-[#e8b86a]" /></div><div className="mt-8 flex flex-wrap gap-2"><button onClick={() => setMetric('volume_24h')} className={`rounded-lg px-4 py-2 text-xs ${metric === 'volume_24h' ? 'bg-[#345d9d]' : 'border border-white/10'}`}>Volume</button><button onClick={() => setMetric('market_cap')} className={`rounded-lg px-4 py-2 text-xs ${metric === 'market_cap' ? 'bg-[#345d9d]' : 'border border-white/10'}`}>Market cap</button><button onClick={() => setMetric('progress')} className={`rounded-lg px-4 py-2 text-xs ${metric === 'progress' ? 'bg-[#345d9d]' : 'border border-white/10'}`}>Curve progress</button></div><div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111722] px-4 py-3"><Search className="size-4 text-[#71809a]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Search public rankings" aria-label="Search public rankings" /></div><div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#111722]">{isLoading ? <div className="p-8 text-sm text-[#71809a]">Loading indexed rankings…</div> : error ? <div className="p-8 text-sm text-[#e8a0a0]">Rankings are temporarily unavailable. No fallback data is shown.</div> : ranked.length ? ranked.map((token, index) => <Link href={`/token/${token.contract_address}`} key={token.contract_address} className="grid grid-cols-[42px_1fr_120px_120px_100px] items-center gap-3 border-b border-white/[0.06] px-5 py-4 transition hover:bg-white/[0.03]"><span className="text-sm text-[#71809a]">{index + 1}</span><span><span className="block text-sm font-medium">{token.name} <span className="text-[#71809a]">${token.symbol}</span></span>{token.verified && <span className="text-[10px] text-[#71d7ba]">Verified</span>}</span><span className="text-right text-xs text-[#c8d1df]">{money(token.market_cap)}</span><span className="text-right text-xs text-[#c8d1df]">{money(token.volume_24h)}</span><span className="text-right text-xs text-[#c8d1df]">{token.progress == null ? '—' : `${token.progress.toFixed(1)}%`}</span></Link>) : <div className="p-12 text-center"><p className="text-sm text-white">No indexed rankings yet</p><p className="mt-2 text-xs text-[#71809a]">The public leaderboard will populate when the indexer confirms token activity.</p></div>}</div></div></PageFrame>
}
