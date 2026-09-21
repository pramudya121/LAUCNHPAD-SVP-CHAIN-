'use client'

import { useEffect } from 'react'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { document.title = 'Something went wrong · LUNAFAD' }, [])
  return <main className="flex min-h-screen items-center justify-center bg-[#080c14] px-5 text-white"><section className="w-full max-w-md rounded-3xl border border-[#d9b878]/20 bg-[#111722] p-8 text-center"><p className="text-xs uppercase tracking-[0.18em] text-[#d9b878]">Recovery mode</p><h1 className="mt-3 text-2xl font-semibold">This workspace hit a snag.</h1><p className="mt-3 text-sm leading-6 text-[#8c98ab]">No wallet or financial state was changed. Retry the page or return to the public home.</p><div className="mt-6 flex justify-center gap-3"><button onClick={reset} className="rounded-xl bg-[#668bc7] px-4 py-2 text-sm font-medium text-white">Try again</button><a href="/" className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[#b9c3d1]">Go home</a></div></section></main>
}
