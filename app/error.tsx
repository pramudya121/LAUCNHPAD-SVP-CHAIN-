'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex min-h-screen items-center justify-center bg-[#0b0f16] px-6 text-white"><section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111722] p-8 text-center"><AlertTriangle className="mx-auto mb-5 size-8 text-[#e87984]" /><h1 className="text-xl font-semibold">Something went wrong</h1><p className="mt-3 text-sm leading-6 text-[#8c98ab]">The page could not finish loading. Your wallet and on-chain funds were not changed.</p><button type="button" onClick={() => reset()} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#345d9d] px-4 py-3 text-sm font-medium" aria-label="Retry loading the page"><RefreshCw className="size-4" />Try again</button></section></main>
}
