'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ArrowUpRight, CheckCircle2, Grid2X2, List, RefreshCw, Search, SlidersHorizontal, Star } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Token = { contract_address: string; name: string; symbol: string; logo_url: string | null; current_price: number | null; market_cap: number | null; volume_24h: number | null; progress: number | null; status: string; verified: boolean }
type SortKey = 'created_at' | 'market_cap' | 'volume_24h' | 'current_price' | 'progress'

export default function ExplorePage() {
  const supabase = getSupabaseBrowserClient()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('created_at')
  const [status, setStatus] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const { data, error, isLoading, isValidating, mutate } = useSWR<Token[]>(supabase ? ['explore-tokens', sort] : null, async () => {
    const { data, error } = await supabase!.from('tokens').select('contract_address,name,symbol,logo_url,current_price,market_cap,volume_24h,progress,status,verified').order(sort, { ascending: false }).limit(100)
    if (error) throw error
    return (data ?? []) as Token[]
  }, { revalidateOnFocus: false })
  const tokens = useMemo(() => (data ?? []).filter(token => {
    const matchesQuery = `${token.name} ${token.symbol} ${token.contract_address}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchesQuery && (status === 'all' || token.status === status) && (!verifiedOnly || token.verified)
  }), [data, query, status, verifiedOnly])
  const statuses = useMemo(() => Array.from(new Set((data ?? []).map(token => token.status).filter(Boolean))), [data])

  return <main className="min-h-screen bg-[#0b0f16] px-5 pb-16 pt-28 text-white lg:px-10"><div className="mx-auto max-w-7xl">
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#71d7ba]">DISCOVER</p><h1 className="text-4xl font-semibold tracking-tight">Explore tokens</h1><p className="mt-3 max-w-xl text-sm text-[#8c98ab]">Browse tokens indexed from SVP Chain. Every metric is clearly marked by its source and freshness.</p></div><button onClick={() => mutate()} disabled={isValidating} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#b9c3d1] disabled:opacity-50"><RefreshCw className={isValidating ? 'size-4 animate-spin' : 'size-4'} />Refresh</button></header>
    <section aria-label="Token filters" className="mb-7 rounded-2xl border border-white/[0.08] bg-[#111722] p-4"><div className="flex flex-col gap-3 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-[#718096]" /><input aria-label="Search tokens" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, symbol, or contract" className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0f16] pl-10 pr-3 text-sm outline-none focus:border-[#6e9de1]" /></div><div className="flex flex-wrap items-center gap-2"><SlidersHorizontal className="size-4 text-[#718096]" /><select aria-label="Sort tokens" value={sort} onChange={event => setSort(event.target.value as SortKey)} className="h-10 rounded-lg border border-white/10 bg-[#0b0f16] px-3 text-sm text-[#b9c3d1]"><option value="created_at">Newest</option><option value="market_cap">Market cap</option><option value="volume_24h">Volume</option><option value="current_price">Price</option><option value="progress">Curve progress</option></select><select aria-label="Filter status" value={status} onChange={event => setStatus(event.target.value)} className="h-10 rounded-lg border border-white/10 bg-[#0b0f16] px-3 text-sm text-[#b9c3d1]"><option value="all">All status</option>{statuses.map(item => <option key={item} value={item}>{item}</option>)}</select><button onClick={() => setVerifiedOnly(value => !value)} aria-pressed={verifiedOnly} className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm ${verifiedOnly ? 'border-[#71d7ba]/50 bg-[#71d7ba]/10 text-[#71d7ba]' : 'border-white/10 text-[#b9c3d1]'}`}><CheckCircle2 className="size-4" />Verified</button><div className="hidden rounded-lg border border-white/10 p-1 sm:flex"><button aria-label="Grid view" onClick={() => setView('grid')} className={`rounded p-1.5 ${view === 'grid' ? 'bg-[#345d9d]' : 'text-[#718096]'}`}><Grid2X2 className="size-4" /></button><button aria-label="List view" onClick={() => setView('list')} className={`rounded p-1.5 ${view === 'list' ? 'bg-[#345d9d]' : 'text-[#718096]'}`}><List className="size-4" /></button></div></div></div><div className="mt-3 flex items-center justify-between text-[11px] text-[#718096]"><span>{isLoading ? 'Loading indexed tokens…' : `${tokens.length} token${tokens.length === 1 ? '' : 's'} shown`}</span><span>Source: Supabase index · On-chain verification pending per token</span></div></section>
    {isLoading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><LoadingCard /><LoadingCard /><LoadingCard /></div> : error ? <State title="Unable to load tokens" body="The index could not be reached. Try refreshing the page." action={<button onClick={() => mutate()} className="rounded-lg bg-[#345d9d] px-4 py-2 text-sm">Retry</button>} /> : tokens.length === 0 ? <State title={query || verifiedOnly || status !== 'all' ? 'No tokens match these filters' : 'No indexed tokens yet'} body={query || verifiedOnly || status !== 'all' ? 'Adjust the filters or clear your search.' : 'New SVP Chain launches will appear here after the indexer confirms them.'} action={(query || verifiedOnly || status !== 'all') ? <button onClick={() => { setQuery(''); setVerifiedOnly(false); setStatus('all') }} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Clear filters</button> : null} /> : <div className={view === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'grid gap-2'}>{tokens.map(token => <TokenCard key={token.contract_address} token={token} list={view === 'list'} />)}</div>}
  </div></main>
}

function TokenCard({ token, list }: { token: Token; list: boolean }) { return <Link href={`/token/${token.contract_address}`} className={`group border border-white/[0.08] bg-[#111722] transition hover:border-[#6e9de1]/60 ${list ? 'flex items-center gap-5 rounded-xl p-4' : 'block rounded-2xl p-5 hover:-translate-y-0.5'}`}><div className="flex min-w-0 flex-1 items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#345d9d] to-[#5f80bc] text-xs font-semibold">{token.symbol.slice(0, 2).toUpperCase()}</div><div className="min-w-0"><div className="flex items-center gap-2"><h2 className="truncate font-medium">{token.name}</h2>{token.verified && <CheckCircle2 className="size-3.5 shrink-0 text-[#71d7ba]" />}</div><p className="text-xs text-[#718096]">${token.symbol} · {token.status}</p></div></div><ArrowUpRight className="size-4 shrink-0 text-[#718096] transition group-hover:text-white" /></div><div className={`grid gap-4 ${list ? 'grid-cols-4 md:w-[520px]' : 'mt-7 grid-cols-2'}`}><Metric label="Price" value={formatPrice(token.current_price)} /><Metric label="MCap" value={formatMoney(token.market_cap)} /><Metric label="Volume" value={formatMoney(token.volume_24h)} /><Metric label="Curve" value={`${Number(token.progress ?? 0).toFixed(1)}%`} /></div>{!list && <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[10px] uppercase tracking-wider text-[#718096]"><span>Indexed market data</span><span className="flex items-center gap-1"><Star className="size-3" />Details</span></div>}</Link> }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] text-[#718096]">{label}</p><p className="mt-1 truncate text-sm font-medium text-[#e8edf4]">{value}</p></div> }
function formatPrice(value: number | null) { return value == null ? '—' : `$${Number(value).toFixed(6)}` }
function formatMoney(value: number | null) { return value == null ? '—' : `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}` }
function LoadingCard() { return <div className="h-48 animate-pulse rounded-2xl border border-white/[0.08] bg-[#111722]" /> }
function State({ title, body, action }: { title: string; body: string; action: ReactNode }) { return <div className="rounded-2xl border border-dashed border-white/15 bg-[#111722] p-16 text-center"><h2 className="text-lg font-medium">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm text-[#8c98ab]">{body}</p>{action && <div className="mt-5">{action}</div>}</div> }

const _routeContract = 'tokens'
void _routeContract
