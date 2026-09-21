export default function Loading() {
  return (
    <main className="min-h-screen bg-[#080c14] px-5 py-8 text-white lg:px-10" aria-label="Loading LUNAFAD">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
          <div className="lunafad-skeleton h-8 w-36 rounded-lg" />
          <div className="hidden gap-2 sm:flex"><div className="lunafad-skeleton h-9 w-20 rounded-lg" /><div className="lunafad-skeleton h-9 w-28 rounded-lg" /></div>
        </div>
        <div className="py-16"><div className="lunafad-skeleton h-3 w-28 rounded" /><div className="lunafad-skeleton mt-4 h-12 w-72 max-w-full rounded-xl" /><div className="lunafad-skeleton mt-4 h-5 w-[32rem] max-w-full rounded" /><div className="mt-10 grid gap-4 md:grid-cols-3"><div className="lunafad-skeleton h-40 rounded-2xl" /><div className="lunafad-skeleton h-40 rounded-2xl" /><div className="lunafad-skeleton h-40 rounded-2xl" /></div></div>
      </div>
    </main>
  )
}
