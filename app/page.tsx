'use client'

import useSWR from 'swr'
import { useState } from 'react'
import { ArrowDownUp, Bell, ChevronDown, Copy, Flame, Globe2, LayoutGrid, List, Menu, Plus, Search, Settings2, Star, TrendingUp, Wallet, X, Zap } from 'lucide-react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const tokens = [
  { name: 'MoonCat', symbol: 'MCAT', price: '$0.00482', change: '+128.4%', market: '$482K', volume: '$91.2K', age: '2h', color: 'from-violet-500 to-fuchsia-400', icon: 'MC' },
  { name: 'Luna Dog', symbol: 'LUDOG', price: '$0.00129', change: '+74.8%', market: '$129K', volume: '$38.6K', age: '5h', color: 'from-sky-400 to-blue-600', icon: 'LD' },
  { name: 'Silver Pepe', symbol: 'SPEPE', price: '$0.00064', change: '+42.1%', market: '$64K', volume: '$24.8K', age: '8h', color: 'from-slate-300 to-slate-500', icon: 'SP' },
  { name: 'Orbit Frog', symbol: 'ORBIT', price: '$0.00031', change: '-8.2%', market: '$31K', volume: '$18.4K', age: '1d', color: 'from-emerald-300 to-green-700', icon: 'OF' },
]

function TokenIcon({ token, size = 'md' }: { token: typeof tokens[number]; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${token.color} font-bold text-white shadow-lg shadow-black/20 ${size === 'lg' ? 'size-14 text-lg' : size === 'sm' ? 'size-8 text-[10px]' : 'size-10 text-xs'}`}>{token.icon}</div>
}

function Sparkline({ down = false }: { down?: boolean }) {
  return <svg className="h-8 w-20" viewBox="0 0 80 32" fill="none" aria-hidden="true"><path d={down ? 'M1 6C9 10 10 23 19 18C28 13 29 22 39 20C49 18 51 28 61 25C70 22 73 29 79 27' : 'M1 28C8 26 11 18 19 22C27 26 28 12 37 16C46 20 48 4 57 10C66 16 70 3 79 5'} stroke={down ? '#e87984' : '#71d7ba'} strokeWidth="2" strokeLinecap="round" /></svg>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [watching, setWatching] = useState<string[]>([])
  const [walletOpen, setWalletOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const [query, setQuery] = useState('')
  const supabase = getSupabaseBrowserClient()
  const { data: liveTokens } = useSWR(supabase ? 'lunafad-tokens' : null, async () => {
    if (!supabase) return []
    const { data, error } = await supabase.from('tokens').select('name, symbol, price, market_cap, volume_24h, created_at').order('created_at', { ascending: false }).limit(8)
    if (error) throw error
    return data
  }, { revalidateOnFocus: false })
  const catalog = liveTokens?.length ? liveTokens.map((token, index) => ({
    name: token.name,
    symbol: token.symbol,
    price: `$${Number(token.price).toFixed(5)}`,
    change: '+0.0%',
    market: `$${Math.round(Number(token.market_cap) / 1000)}K`,
    volume: `$${Math.round(Number(token.volume_24h) / 1000)}K`,
    age: 'new',
    color: tokens[index % tokens.length].color,
    icon: token.symbol.slice(0, 2).toUpperCase(),
  })) : tokens
  const filtered = catalog.filter(t => `${t.name} ${t.symbol}`.toLowerCase().includes(query.toLowerCase()))

  const nav = ['Overview', 'Explore', 'Trending', 'Portfolio']
  const marketTokens = catalog.length ? catalog : tokens
  return (
    <main className="min-h-screen bg-[#0b0f16] text-white">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0b0f16]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-5 lg:px-8">
          <button className="flex items-center gap-2.5" onClick={() => setActive('Overview')}><div className="flex size-8 items-center justify-center rounded-[10px] bg-[#345d9d] shadow-[0_0_24px_rgba(52,93,157,.45)]"><Zap className="size-4 fill-white" /></div><span className="text-[17px] font-semibold tracking-tight">LUNA<span className="text-[#6e9de1]">FAD</span></span></button>
          <nav className="hidden items-center gap-1 md:flex">{nav.map(item => <button key={item} onClick={() => setActive(item)} className={`rounded-lg px-3 py-2 text-[13px] transition ${active === item ? 'bg-white/[0.08] text-white' : 'text-[#818a9b] hover:text-white'}`}>{item}</button>)}</nav>
          <div className="ml-auto flex items-center gap-2.5"><div className="relative hidden lg:block"><Search className="absolute left-3 top-2.5 size-4 text-[#687386]" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tokens" className="h-9 w-48 rounded-lg border border-white/[0.08] bg-white/[0.035] pl-9 pr-3 text-xs outline-none placeholder:text-[#687386] focus:border-[#345d9d]" /></div><button className="hidden size-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#8993a5] transition hover:bg-white/[0.06] hover:text-white sm:flex"><Bell className="size-4" /></button><button onClick={() => setWalletOpen(true)} className="flex h-9 items-center gap-2 rounded-lg bg-[#345d9d] px-3.5 text-xs font-medium transition hover:bg-[#426fb5]"><Wallet className="size-3.5" />{connected ? '0x71...A4C2' : 'Connect wallet'}</button><button onClick={() => setMobileNav(!mobileNav)} className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] md:hidden"><Menu className="size-4" /></button></div>
        </div>
        {mobileNav && <div className="border-t border-white/[0.07] px-5 py-3 md:hidden">{nav.map(item => <button key={item} onClick={() => { setActive(item); setMobileNav(false) }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-[#a5a8a9]">{item}</button>)}</div>}
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#152540] via-[#111b2c] to-[#111722] p-7 sm:p-10"><div className="pointer-events-none absolute -right-24 -top-36 size-[420px] rounded-full bg-[#345d9d]/20 blur-[100px]" /><div className="pointer-events-none absolute bottom-[-180px] left-1/3 size-[340px] rounded-full bg-[#668bc7]/10 blur-[80px]" /><div className="relative max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#668bc7]/30 bg-[#345d9d]/10 px-3 py-1.5 text-[11px] font-medium text-[#a9c5f5]"><span className="size-1.5 rounded-full bg-[#71d7ba] shadow-[0_0_8px_#71d7ba]" />SVP Chain Testnet <span className="text-[#7182a1]">•</span> Live now</div><h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">Discover the next<br /><span className="text-[#8eb1eb]">100x token.</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-[#8c98ab]">Launch, discover, and trade the most promising community tokens on SVP Chain.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setActive('Explore')} className="flex h-10 items-center gap-2 rounded-lg bg-[#f2f5fa] px-4 text-xs font-semibold text-[#131a28] transition hover:bg-white"><Globe2 className="size-3.5" />Explore tokens</button><button onClick={() => setActive('Create')} className="flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-4 text-xs font-medium text-white transition hover:bg-white/[0.1]"><Plus className="size-3.5" />Create token</button></div></div><div className="absolute bottom-6 right-8 hidden w-64 lg:block"><div className="mb-2 flex items-center justify-between text-[10px] text-[#72819a]"><span>SVP ecosystem</span><span className="text-[#a5bde3]">Growing every day</span></div><div className="h-1 rounded-full bg-white/10"><div className="h-1 w-[72%] rounded-full bg-gradient-to-r from-[#345d9d] to-[#8eb1eb]" /></div><div className="mt-3 grid grid-cols-3 gap-3"><div><p className="text-lg font-semibold">2.4K</p><p className="text-[10px] text-[#71809a]">Traders</p></div><div><p className="text-lg font-semibold">184</p><p className="text-[10px] text-[#71809a]">Tokens</p></div><div><p className="text-lg font-semibold">$1.2M</p><p className="text-[10px] text-[#71809a]">Volume</p></div></div></div></section>

        <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4"><Stat label="Total volume" value="$1,284,902" change="+18.4%" /><Stat label="Tokens launched" value="184" change="+12 today" /><Stat label="Active traders" value="2,418" change="+9.2%" /><Stat label="SVP price" value="$0.0842" change="+3.8%" /></section>

        <section className="mt-10"><div className="mb-4 flex items-end justify-between"><div><p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#71819a]">Market pulse</p><h2 className="text-xl font-semibold tracking-tight">Trending tokens</h2></div><button onClick={() => setActive('Explore')} className="hidden items-center gap-1 text-xs text-[#8eb1eb] sm:flex">View all <ChevronDown className="size-3 -rotate-90" /></button></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{filtered.map((token, i) => <article key={token.symbol} className="group rounded-xl border border-white/[0.08] bg-[#111722] p-4 transition hover:-translate-y-0.5 hover:border-[#345d9d]/70 hover:bg-[#141d2b]"><div className="mb-4 flex items-start justify-between"><div className="flex items-center gap-3"><TokenIcon token={token} /><div><div className="flex items-center gap-1.5"><h3 className="text-sm font-medium">{token.name}</h3>{i < 2 && <span className="rounded bg-[#345d9d]/20 px-1 py-0.5 text-[9px] text-[#9dbbed]">NEW</span>}</div><p className="mt-0.5 text-[11px] text-[#71809a]">{token.symbol}</p></div></div><button aria-label={`Favorite ${token.name}`} onClick={() => setWatching(watching.includes(token.symbol) ? watching.filter(x => x !== token.symbol) : [...watching, token.symbol])} className="text-[#657187] hover:text-[#d8b36e]"><Star className={`size-4 ${watching.includes(token.symbol) ? 'fill-[#d8b36e] text-[#d8b36e]' : ''}`} /></button></div><div className="flex items-end justify-between"><div><p className="text-lg font-semibold tracking-tight">{token.price}</p><p className={`mt-1 text-[11px] font-medium ${token.change.startsWith('-') ? 'text-[#e87984]' : 'text-[#71d7ba]'}`}>{token.change} <span className="font-normal text-[#657187]">24h</span></p></div><Sparkline down={token.change.startsWith('-')} /></div><div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3"><Metric label="MCap" value={token.market} /><Metric label="Volume" value={token.volume} /><Metric label="Age" value={token.age} /></div></article>)}</div></section>

        <section className="mt-10 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><div className="rounded-xl border border-white/[0.08] bg-[#111722] p-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Market overview</h2><p className="mt-1 text-[11px] text-[#71809a]">Real-time activity across SVP Chain</p></div><button className="flex items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-[#a5a8a9]">24h <ChevronDown className="size-3" /></button></div><div className="flex h-40 items-end gap-1.5 sm:gap-3">{[34,48,39,58,51,64,53,70,61,75,68,84,72,91,79,88,82,96,87,100,93,97].map((height,i) => <div key={i} className="group relative flex flex-1 flex-col justify-end"><div className={`rounded-t-sm transition group-hover:bg-[#6e9de1] ${i > 16 ? 'bg-[#4774b9]' : 'bg-[#345d9d]/70'}`} style={{height: `${height}%`}} /></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-[#5d6b81]"><span>12:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>Now</span></div></div><div className="rounded-xl border border-white/[0.08] bg-[#111722] p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-semibold">Top movers</h2><p className="mt-1 text-[11px] text-[#71809a]">Biggest changes today</p></div><TrendingUp className="size-4 text-[#71d7ba]" /></div><div className="flex flex-col gap-1">{marketTokens.slice(0,3).map((token,i) => <div key={token.symbol} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-white/[0.035]"><span className="w-4 text-center text-[11px] text-[#58657a]">0{i+1}</span><TokenIcon token={token} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{token.name}</p><p className="text-[10px] text-[#71809a]">{token.symbol}</p></div><div className="text-right"><p className="text-xs font-medium">{token.price}</p><p className={`text-[10px] ${token.change.startsWith('-') ? 'text-[#e87984]' : 'text-[#71d7ba]'}`}>{token.change}</p></div></div>)}</div></div></section>
      </div>

      <footer className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/[0.07] px-5 py-6 text-[11px] text-[#657187] sm:flex-row sm:items-center sm:justify-between lg:px-8"><div className="flex items-center gap-2"><div className="flex size-5 items-center justify-center rounded-md bg-[#345d9d]"><Zap className="size-3 fill-white text-white" /></div><span>LUNAFAD on SVP Chain</span></div><div className="flex gap-4"><span>Docs</span><span>Discord</span><span>Terms</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#71d7ba]" />All systems operational</span></div></footer>

      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm" onClick={() => setWalletOpen(false)}><div className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#141b28] p-5 shadow-2xl" onClick={e => e.stopPropagation()}><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Connect wallet</h2><p className="mt-1 text-xs text-[#71809a]">Connect to trade on SVP Chain</p></div><button onClick={() => setWalletOpen(false)} className="text-[#71809a] hover:text-white"><X className="size-4" /></button></div>{['MetaMask','WalletConnect','Coinbase Wallet','Rabby'].map((wallet,i) => <button key={wallet} onClick={() => { setConnected(true); setWalletOpen(false) }} className="mb-2 flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left text-sm transition hover:border-[#345d9d] hover:bg-[#345d9d]/10"><div className={`flex size-8 items-center justify-center rounded-full ${i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-sky-400' : 'bg-red-400'}`}><Wallet className="size-4 text-white" /></div><span>{wallet}</span><ChevronDown className="ml-auto size-4 -rotate-90 text-[#71809a]" /></button>)}<p className="mt-4 text-center text-[10px] text-[#5f6c80]">By connecting, you agree to the Terms of Service.</p></div></div>}
    </main>
  )
}

function Stat({ label, value, change }: { label: string; value: string; change: string }) { return <div className="rounded-xl border border-white/[0.08] bg-[#111722] p-4"><p className="text-[11px] text-[#71809a]">{label}</p><div className="mt-2 flex items-end justify-between gap-2"><p className="text-lg font-semibold tracking-tight">{value}</p><span className="text-[10px] text-[#71d7ba]">{change}</span></div></div> }
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-[9px] uppercase tracking-wide text-[#5d6b81]">{label}</p><p className="mt-1 text-[11px] text-[#a5a8a9]">{value}</p></div> }
