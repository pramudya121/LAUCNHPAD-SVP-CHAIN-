'use client'

import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Copy, ExternalLink, Star, Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import { useBondingCurve } from '@/lib/hooks/use-bonding-curve'
import { useTerminalChart } from '@/lib/hooks/use-terminal-chart'
import { explorerAddress, shortenAddress, type Timeframe } from '@/lib/contracts/config'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']

type Token = { name: string; symbol: string; description: string | null; creator_address: string; current_price: number | null; market_cap: number | null; volume_24h: number | null; progress: number | null; status: string; verified: boolean }
type Trade = { price: number; volume: number; side: string; trader: string; tx_hash: string; created_at: string }

export default function TokenDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address: rawAddress } = use(params)
  const address = rawAddress as `0x${string}`
  const supabase = getSupabaseBrowserClient()
  const [timeframe, setTimeframe] = useState<Timeframe>('1h')
  const [watchlisted, setWatchlisted] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { data: curve, loading: curveLoading } = useBondingCurve(address)
  const { candles, live } = useTerminalChart(address, timeframe)
  const { data: token } = useSWR<Token | null>(supabase ? ['token-detail', address] : null, async () => {
    const { data } = await supabase!.from('tokens').select('name,symbol,description,creator_address,current_price,market_cap,volume_24h,progress,status,verified').eq('contract_address', address).maybeSingle()
    return data as Token | null
  })
  const { data: trades } = useSWR<Trade[]>(supabase ? ['token-trades', address] : null, async () => {
    const { data } = await supabase!.from('token_trades').select('price,volume,side,trader,tx_hash,created_at').eq('token_address', address).order('created_at', { ascending: false }).limit(20)
    return (data ?? []) as Trade[]
  })

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user
      setWalletAddress(user?.id ?? null)
      if (!user) return
      (supabase.from('user_watchlist') as any).select('token_address').eq('user_address', user.id).eq('token_address', address).maybeSingle().then(({ data: row }: { data: unknown }) => setWatchlisted(Boolean(row)))
    })
  }, [address, supabase])

  async function toggleWatchlist() {
    if (!supabase || !walletAddress) return
    if (watchlisted) await (supabase.from('user_watchlist') as any).delete().eq('user_address', walletAddress).eq('token_address', address)
    else await (supabase.from('user_watchlist') as any).insert({ user_address: walletAddress, token_address: address })
    setWatchlisted(value => !value)
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const last = candles.at(-1)
  const displayName = token?.name ?? shortenAddress(address, 6)
  const displaySymbol = token?.symbol ? `$${token.symbol}` : 'SVP Chain token'
  return <main className="min-h-screen bg-[#0b0f16] px-5 py-8 text-white lg:px-10"><div className="mx-auto max-w-7xl"><Link href="/explore" className="text-xs text-[#8eb1eb]">← Back to Explore</Link><header className="mt-8 flex flex-wrap items-center gap-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#345d9d] to-[#71d7ba] text-lg font-bold">{token?.symbol?.slice(0, 2) ?? 'SV'}</div><div><div className="flex items-center gap-2"><p className="text-[11px] uppercase tracking-wider text-[#71d7ba]">{token?.status ?? 'On-chain token'}</p>{token?.verified && <span className="rounded-full bg-[#71d7ba]/10 px-2 py-0.5 text-[10px] text-[#71d7ba]">Verified</span>}</div><h1 className="text-3xl font-semibold">{displayName}</h1><button onClick={copyAddress} className="flex items-center gap-1 text-xs text-[#71809a] hover:text-white">{displaySymbol} · {shortenAddress(address, 6)} <Copy className="size-3" /> {copied && 'Copied'}</button></div><div className="ml-auto flex gap-2"><button onClick={toggleWatchlist} disabled={!walletAddress} className={`rounded-lg border p-2 ${watchlisted ? 'border-[#71d7ba]/50 text-[#71d7ba]' : 'border-white/10 text-white'} disabled:cursor-not-allowed disabled:opacity-50`} aria-label={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}><Star className="size-4" fill={watchlisted ? 'currentColor' : 'none'} /></button><a href={explorerAddress(address)} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs">Explorer <ExternalLink className="size-3" /></a></div></header><div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]"><section className="rounded-xl border border-white/10 bg-[#111722] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-2xl font-semibold">{curveLoading ? 'Loading…' : curve?.price ?? token?.current_price ?? last?.close ?? '—'} SVP</p><p className="mt-1 flex items-center gap-2 text-xs text-[#71d7ba]"><span className="size-1.5 rounded-full bg-[#71d7ba]" />{live ? 'Live indexed market data' : 'Waiting for indexed trades'}</p></div><div className="flex gap-1">{timeframes.map(item => <button key={item} onClick={() => setTimeframe(item)} className={`rounded px-2 py-1 text-[10px] ${timeframe === item ? 'bg-[#345d9d] text-white' : 'text-[#71809a]'}`}>{item}</button>)}</div></div><div className="mt-6 flex h-80 items-end gap-1 border-b border-l border-white/10 px-3">{candles.length ? candles.slice(-80).map(c => <div key={c.time} title={`${c.close} · volume ${c.volume}`} className={`flex-1 rounded-t ${c.close >= c.open ? 'bg-[#71d7ba]/70' : 'bg-[#e87984]/70'}`} style={{ height: `${chartHeight(c, candles)}%` }} />) : <div className="flex w-full items-center justify-center text-sm text-[#71809a]">No candle data indexed yet</div>}</div><div className="mt-4 flex justify-between text-[10px] text-[#71809a]"><span>Historical candles from Supabase</span><span>{candles.length} points</span></div></section><aside className="space-y-5"><div className="rounded-xl border border-white/10 bg-[#111722] p-5"><div className="flex items-center gap-2"><Wallet className="size-4 text-[#71d7ba]" /><h2 className="font-medium">Trade terminal</h2></div><p className="mt-2 text-xs leading-5 text-[#8c98ab]">Connect a wallet to quote and execute buy or sell transactions through the bonding curve.</p><div className="mt-5 grid grid-cols-2 gap-2"><button className="flex items-center justify-center gap-2 rounded-lg bg-[#71d7ba] py-2.5 text-xs font-semibold text-[#0b0f16]"><ArrowUpFromLine className="size-3" />Buy</button><button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-xs"><ArrowDownToLine className="size-3" />Sell</button></div></div><div className="rounded-xl border border-white/10 bg-[#111722] p-5"><h2 className="font-medium">Market overview</h2><div className="mt-4 grid grid-cols-2 gap-4"><Metric label="Market cap" value={`$${Number(token?.market_cap ?? 0).toLocaleString()}`} /><Metric label="24h volume" value={`$${Number(token?.volume_24h ?? 0).toLocaleString()}`} /><Metric label="Curve progress" value={`${Number(token?.progress ?? curve?.progress ?? 0).toFixed(1)}%`} /><Metric label="Creator" value={shortenAddress(token?.creator_address, 4)} /></div></div></aside></div><section className="mt-5 rounded-xl border border-white/10 bg-[#111722] p-5"><div className="flex items-center justify-between"><h2 className="font-medium">Recent trades</h2><span className="text-xs text-[#71d7ba]">Indexed on SVP Chain</span></div>{trades?.length ? <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-[#71809a]"><tr><th className="pb-3 font-normal">Side</th><th className="pb-3 font-normal">Price</th><th className="pb-3 font-normal">Volume</th><th className="pb-3 font-normal">Trader</th><th className="pb-3 font-normal">Time</th></tr></thead><tbody>{trades.map((trade, index) => <tr key={`${trade.tx_hash}-${index}`} className="border-t border-white/[0.06]"><td className={`py-3 capitalize ${trade.side === 'buy' ? 'text-[#71d7ba]' : 'text-[#e87984]'}`}>{trade.side}</td><td className="py-3">{Number(trade.price).toPrecision(6)}</td><td className="py-3">{Number(trade.volume).toLocaleString()}</td><td className="py-3 text-[#8c98ab]">{shortenAddress(trade.trader, 4)}</td><td className="py-3 text-[#8c98ab]">{new Date(trade.created_at).toLocaleTimeString()}</td></tr>)}</tbody></table></div> : <p className="mt-4 text-sm text-[#71809a]">No indexed trades for this token yet.</p>}</section>{token?.description && <section className="mt-5 rounded-xl border border-white/10 bg-[#111722] p-5"><h2 className="font-medium">About {token.name}</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-[#8c98ab]">{token.description}</p></section>}</div></main>
}

function chartHeight(candle: { high: number; low: number; close: number }, candles: { high: number; low: number }[]) {
  const low = Math.min(...candles.map(item => item.low))
  const high = Math.max(...candles.map(item => item.high))
  return Math.max(8, Math.min(100, ((candle.close - low) / Math.max(0.000001, high - low)) * 90 + 8))
}

function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] text-[#718096]">{label}</p><p className="mt-1 truncate text-sm font-medium text-[#e8edf4]">{value}</p></div> }

const _routeContract = 'token-detail'
