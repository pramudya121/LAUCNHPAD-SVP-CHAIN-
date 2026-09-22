'use client'

import { useMemo, useState } from 'react'
import { Accessibility, CheckCircle2, Gauge, ShieldCheck, TestTube2 } from 'lucide-react'
import { PageFrame, SectionHeading } from '@/components/app-header'

const checks = [
  { id: 'routes', label: 'Direct public routes', detail: 'Every public surface resolves from a direct deployment URL.', status: 'pass' },
  { id: 'wallet', label: 'Wallet recovery', detail: 'Account, chain, disconnect, and provider errors clear stale identity.', status: 'pass' },
  { id: 'a11y', label: 'WCAG 2.2 AA review', detail: 'Keyboard focus, labels, contrast, and reduced motion are tracked.', status: 'pending' },
  { id: 'perf', label: 'Performance budget', detail: 'Core routes target a 2.5s LCP and zero avoidable layout shift.', status: 'pending' },
  { id: 'rollback', label: 'Rollback readiness', detail: 'Release status, health endpoint, and recovery copy are available.', status: 'pass' },
]

export default function QualityCenterPage() {
  const [filter, setFilter] = useState<'all' | 'pass' | 'pending'>('all')
  const visible = useMemo(() => checks.filter(item => filter === 'all' || item.status === filter), [filter])
  const passed = checks.filter(item => item.status === 'pass').length
  return <PageFrame active="System Health"><div className="mx-auto max-w-5xl"><SectionHeading eyebrow="Phase 11 · quality operations" title="Quality center" description="A transparent readiness workspace for accessibility, performance, wallet recovery, and release confidence." /><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-[#71d7ba]/20 bg-[#71d7ba]/[0.06] p-5"><ShieldCheck className="size-5 text-[#71d7ba]" /><p className="mt-3 text-2xl font-semibold">{passed}/{checks.length}</p><p className="mt-1 text-xs text-[#71809a]">verified checks</p></div><div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5"><Accessibility className="size-5 text-[#9ab8ea]" /><p className="mt-3 text-2xl font-semibold">AA</p><p className="mt-1 text-xs text-[#71809a]">accessibility target</p></div><div className="rounded-2xl border border-white/[0.08] bg-[#101722] p-5"><Gauge className="size-5 text-[#d9b878]" /><p className="mt-3 text-2xl font-semibold">2.5s</p><p className="mt-1 text-xs text-[#71809a]">LCP budget</p></div></div><section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#101722] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><TestTube2 className="size-4 text-[#71d7ba]" /><h2 className="font-medium">Release checks</h2></div><div className="flex gap-2">{(['all','pass','pending'] as const).map(value => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-lg border px-3 py-2 text-xs capitalize ${filter === value ? 'border-[#71d7ba]/40 bg-[#71d7ba]/10 text-[#9de8d1]' : 'border-white/[0.08] text-[#8492a8]'}`}>{value}</button>)}</div></div><div className="mt-4 space-y-2">{visible.map(item => <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] px-4 py-3"><div><p className="text-sm text-[#d8e0eb]">{item.label}</p><p className="mt-1 text-xs leading-5 text-[#71809a]">{item.detail}</p></div><span className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] uppercase tracking-wider ${item.status === 'pass' ? 'border-[#71d7ba]/20 text-[#71d7ba]' : 'border-[#d9b878]/25 text-[#d9b878]'}`}>{item.status === 'pass' && <CheckCircle2 className="size-3" />}{item.status}</span></div>)}</div></section></div></PageFrame>
}
