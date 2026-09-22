"use client"

import { useState } from 'react'
import { PageFrame, SectionHeading } from '@/components/app-header'

const capabilities = [
  { title: 'Read-only API', detail: 'Scoped token, market, and portfolio reads with explicit source metadata.', status: 'Available' },
  { title: 'Verified webhooks', detail: 'Event delivery for confirmed launches, trades, and reconciliation checkpoints.', status: 'Configure signing' },
  { title: 'Shareable token pages', detail: 'Public pages preserve freshness, confidence, explorer links, and chain context.', status: 'Available' },
  { title: 'Organization analytics', detail: 'Workspace reporting stays permission-aware and privacy-safe.', status: 'Coming with auth' },
]

export default function EcosystemPage() {
  const [region, setRegion] = useState('UTC')
  return <PageFrame active=""><div className="mx-auto max-w-6xl"><SectionHeading eyebrow="Ecosystem · trust-first growth" title="Build on LUNAFAD" description="A clean surface for creators, partners, and operators to discover verified data without bypassing wallet or permission boundaries." /><div className="mt-8 grid gap-4 md:grid-cols-2">{capabilities.map((capability) => <article key={capability.title} className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-base font-semibold">{capability.title}</h2><span className="rounded-full border border-[#71d7ba]/20 bg-[#71d7ba]/[0.06] px-2 py-1 text-[10px] uppercase tracking-wider text-[#9de8d1]">{capability.status}</span></div><p className="mt-3 text-sm leading-6 text-[#8c98ab]">{capability.detail}</p></article>)}</div><section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101722] p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-medium">Locale and time context</p><p className="mt-1 text-xs text-[#71809a]">Formatting preferences are local until an authenticated profile is connected.</p></div><label className="flex items-center gap-2 text-xs text-[#aab6c8]">Timezone<select value={region} onChange={(event) => setRegion(event.target.value)} className="rounded-lg border border-white/[0.1] bg-[#0b0f16] px-3 py-2 text-xs text-white"><option>UTC</option><option>Asia/Jakarta</option><option>America/New_York</option><option>Europe/London</option></select></label></div></section><div className="mt-6 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-[#71809a]"><span className="rounded-full border border-white/[0.08] px-2.5 py-1">No private keys</span><span className="rounded-full border border-white/[0.08] px-2.5 py-1">No fabricated metrics</span><span className="rounded-full border border-white/[0.08] px-2.5 py-1">Chain-aware</span></div></div></PageFrame>
}
