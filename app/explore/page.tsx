'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { Search, SlidersHorizontal, ArrowUpRight, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Token = { contract_address: string; name: string; symbol: string; logo_url: string | null; current_price: number | null; market_cap: number | null; volume_24h: number | null; progress: number | null; status: string; verified: boolean }

export default function ExplorePage() {
  const supabase = getSupabaseBrowserClient()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('created_at')
  const { data, error, isLoading, mutate } = useSWR(supabase ? ['explore-tokens', sort] : null, async () => {
    const { data, error } = await supabase!.from('tokens').select('contract_address,name,symbol,logo_url,current_price,market_cap,volume_24h,progress,status,verified').order(sort, { ascending: false }).limit(100)
    if (error) throw error
    return (data ?? []) as Token[]
  })
  const tokens = useMemo(() => (data ?? []).filter(token => `${token.name} ${token.symbol} ${token.contract_address}`.toLowerCase().includes(query.toLowerCase())), [data, query])
  return <main className="min-h-screen bg-[#0b0f16] px-5 pb-16 pt-28 text-white lg:px-10"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#71d7ba]">DISCOVER</p><h1 className="text-4xl font-semibold tracking-tight">Explore tokens</h1><p className="mt-3 text-sm text-[#8c98ab]">Every listing is indexed from SVP Chain and verified against the launchpad database.</p></div><button onClick={() => mutate()} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#b9c3d1]"><RefreshCw data-icon="inline-start" />Refresh</button></header><div className="mb-7 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-[#718096]" /><input aria-label="Search tokens" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, symbol, or contract" className="h-10 w-full rounded-lg border border-white/10 bg-[#111722] pl-10 pr-3 text-sm outline-none focus:border-[#6e9de1]" /></div><div className="flex items-center gap-2"><SlidersHorizontal className="text-[#718096]" /><select aria-label="Sort tokens" value={sort} onChange={event => setSort(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#111722] px-3 text-sm text-[#b9c3d1]"><option value="created_at">Newest</option><option value="market_cap">Market cap</option><option value="volume_24h">Volume</option><option value="current_price">Price</option></select></div></div>{isLoading ? <p className="py-16 text-center text-sm text-[#8c98ab]">Loading indexed tokens…</p> : error ? <p className="py-16 text-center text-sm text-[#e87984]">Unable to load tokens from Supabase.</p> : tokens.length === 0 ? <div className="rounded-2xl border border-dashed border-white/15 bg-[#111722] p-16 text-center text-sm text-[#8c98ab]">No tokens match this search.</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{tokens.map(token => <TokenCard key={token.contract_address} token={token} />)}</div>}</div></main>
}

function TokenCard({ token }: { token: Token }) { return <Link href={`/token/${token.contract_address}`} className="group rounded-2xl border border-white/[0.08] bg-[#111722] p-5 transition hover:-translate-y-0.5 hover:border-[#6e9de1]/60"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full bg-[#345d9d] text-xs font-semibold">{token.symbol.slice(0, 2).toUpperCase()}</div><div><h2 className="font-medium">{token.name}</h2><p className="text-xs text-[#718096]">${token.symbol}</p></div></div><ArrowUpRight className="text-[#718096] transition group-hover:text-white" /></div><div className="mt-7 grid grid-cols-2 gap-4"><Metric label="Price" value={`$${Number(token.current_price ?? 0).toFixed(6)}`} /><Metric label="MCap" value={`$${Number(token.market_cap ?? 0).toLocaleString()}`} /><Metric label="Volume" value={`$${Number(token.volume_24h ?? 0).toLocaleString()}`} /><Metric label="Curve" value={`${Number(token.progress ?? 0).toFixed(1)}%`} /></div><div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] uppercase tracking-wider text-[#718096]"><span>{token.status}</span><span className={token.verified ? 'text-[#71d7ba]' : ''}>{token.verified ? 'Verified' : 'Unverified'}</span></div></Link> }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] text-[#718096]">{label}</p><p className="mt-1 text-sm font-medium text-[#e8edf4]">{value}</p></div> }

// This page intentionally renders only persisted rows; there is no fallback token catalog.
// The explicit empty state makes an empty or fresh testnet index understandable to users.
// eslint-disable-next-line no-unused-vars
const _routeContract = 'tokens'
