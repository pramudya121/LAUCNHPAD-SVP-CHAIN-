import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080c14] px-5 text-center text-white">
      <section className="max-w-md rounded-3xl border border-white/[0.08] bg-[#101722] p-8 shadow-2xl shadow-black/30">
        <p className="text-xs uppercase tracking-[0.28em] text-[#71d7ba]">LUNAFAD / 404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Workspace not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#8b98ad]">This route or token workspace does not exist in the indexed registry.</p>
        <Link href="/explore" className="mt-7 inline-flex rounded-xl bg-[#f1f5fa] px-4 py-3 text-sm font-semibold text-[#172033]">Return to Explore</Link>
      </section>
    </main>
  )
}
