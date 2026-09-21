'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ArrowUpRight, BriefcaseBusiness, Eye, RefreshCw, WalletCards } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Position = { token_address: string; balance: number; usd_value: number; avg_buy_price: number; pnl_24h: number }
type Token = { contract_address: string; name: string; symbol: string; logo_url: string | null; current_price: number | null }

export default function PortfolioPage() {
  const supabase = getSupabaseBrowserClient()
  const wallet = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('address') : null
  const key = supabase && wallet ? ['portfolio', wallet] : null
  const fetcher = async () => {
    const { data, error } = await supabase!.from('user_portfolio').select('token_address,balance,usd_value,avg_buy_price,pnl_24h').eq('user_address', wallet!).order('usd_value', { ascending: false })
    if (error) throw error
    return (data ?? []) as Position[]
  }
  const { data: positions, error, isLoading, mutate } = useSWR(key, fetcher)
  const total = (positions ?? []).reduce((sum, row) => sum + Number(row.usd_value ?? 0), 0)
  const pnl = (positions ?? []).reduce((sum, row) => sum + Number(row.pnl_24h ?? 0), 0)

  return <main className="min-h-screen bg-[#0b0f16] px-5 pb-16 pt-28 text-white lg:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[#71d7ba]">ACCOUNT CENTER</p><h1 className="text-4xl font-semibold tracking-tight">Portfolio</h1><p className="mt-3 max-w-xl text-sm text-[#8c98ab]">Track on-chain positions, performance, and tokens saved from the SVP ecosystem.</p></div>
        <button onClick={() => mutate()} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#b9c3d1] hover:bg-white/[0.05]"><RefreshCw data-icon="inline-start" />Refresh</button>
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-3"><Metric label="Portfolio value" value={wallet ? `$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Connect wallet'} /><Metric label="24h PNL" value={wallet ? `${pnl >= 0 ? '+' : ''}$${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'} tone={pnl >= 0 ? 'positive' : 'negative'} /><Metric label="Positions" value={wallet ? String(positions?.length ?? 0) : '—'} /></div>
      <section className="rounded-2xl border border-white/[0.08] bg-[#111722] p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-medium">Holdings</h2><p className="mt-1 text-xs text-[#718096]">Balances indexed from Supabase portfolio snapshots.</p></div><WalletCards className="text-[#71d7ba]" /></div>
        {!wallet ? <Empty title="Connect a wallet to view your portfolio" body="Add ?address=0x... to load a wallet-scoped portfolio from the database." /> : isLoading ? <p className="py-10 text-center text-sm text-[#8c98ab]">Loading positions…</p> : error ? <Empty title="Portfolio unavailable" body="The portfolio table could not be read. Check your connection and try again." /> : positions?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-[#718096]"><tr><th className="pb-3">Token</th><th className="pb-3">Balance</th><th className="pb-3">Value</th><th className="pb-3">Avg. entry</th><th className="pb-3">24h PNL</th><th className="pb-3" /></tr></thead><tbody>{positions.map((row) => <tr key={row.token_address} className="border-b border-white/[0.05] last:border-0"><td className="py-4 font-mono text-xs">{row.token_address.slice(0, 8)}…{row.token_address.slice(-6)}</td><td className="py-4">{Number(row.balance).toLocaleString()}</td><td className="py-4">${Number(row.usd_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td><td className="py-4">${Number(row.avg_buy_price).toFixed(5)}</td><td className={Number(row.pnl_24h) >= 0 ? 'py-4 text-[#71d7ba]' : 'py-4 text-[#e87984]'}>{Number(row.pnl_24h) >= 0 ? '+' : ''}${Number(row.pnl_24h).toFixed(2)}</td><td className="py-4 text-right"><Link href={`/token/${row.token_address}`} aria-label="Open token" className="text-[#8eb1eb]"><ArrowUpRight /></Link></td></tr>)}</tbody></table></div> : <Empty title="No indexed positions yet" body="Buy a token on SVP Chain and your confirmed position will appear here." />}
      </section>
    </div>
  </main>
}
function Metric({ label, value, tone = 'default' }: { label: string; value: string; tone?: string }) { return <div className="rounded-2xl border border-white/[0.08] bg-[#111722] p-5"><p className="text-xs text-[#718096]">{label}</p><p className={`mt-3 text-2xl font-semibold ${tone === 'positive' ? 'text-[#71d7ba]' : tone === 'negative' ? 'text-[#e87984]' : 'text-white'}`}>{value}</p></div> }
function Empty({ title, body }: { title: string; body: string }) { return <div className="flex flex-col items-center justify-center py-14 text-center"><BriefcaseBusiness className="mb-4 text-[#718096]" /><h3 className="font-medium">{title}</h3><p className="mt-2 max-w-md text-sm text-[#718096]">{body}</p></div> }
